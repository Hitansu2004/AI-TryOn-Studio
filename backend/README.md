# Virtual Try-On E-commerce Backend

A Spring Boot 3.x backend service for virtual try-on e-commerce platform that handles product image management and virtual try-on processing via external specialized microservices.

## Features

- **Product Management**: Upload, store, and manage product images with metadata
- **Virtual Try-On Processing**: Async job processing using specialized garment transfer models
- **File Storage**: Configurable local file storage with validation and security
- **REST APIs**: Full OpenAPI/Swagger documentation
- **CORS Support**: Configured for Next.js frontend integration

## Technology Stack

- **Java 21** with Spring Boot 3.3.4
- **Maven** for dependency management
- **Spring Web** for REST APIs
- **Spring Validation** for input validation
- **Spring Actuator** for monitoring
- **springdoc-openapi** for API documentation
- **Lombok** for boilerplate reduction

## Prerequisites

- Java 21 or higher
- Maven 3.6+ 
- External try-on microservice (see [Try-On Service Requirements](#try-on-service-requirements))

## Quick Start

### 1. Clone and Setup

```bash
cd backend
mvn clean install
```

### 2. Configure Environment

Set required environment variables:

```bash
# Required: External try-on microservice URL
export TRYON_SERVICE_URL=http://localhost:8081/api/tryon

# Optional: For future creative/image edit experiments (not used by /api/tryon)
export GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run the Application

```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

### 4. Access Documentation

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs
- **Health Check**: http://localhost:8080/actuator/health

## Configuration

### Application Properties

Key configuration options in `src/main/resources/application.yml`:

```yaml
# Server configuration
server:
  port: 8080

# Storage directories (automatically created)
storage:
  products: ./storage/products          # Product images
  user-uploads: ./storage/user         # User uploaded images
  results: ./storage/results           # Generated try-on results
  max-file-size: 10485760             # 10MB max file size
  allowed-content-types:
    - image/jpeg
    - image/png

# CORS configuration (update for production)
cors:
  allowed-origins:
    - http://localhost:3000            # Next.js dev server
  # For production, update to your domain:
  # allowed-origins:
  #   - https://yourdomain.com
  #   - https://www.yourdomain.com

# Try-on service configuration
tryon:
  service:
    url: ${TRYON_SERVICE_URL}          # External microservice URL
    timeout: 300                       # 5 minutes processing timeout
```

### Production Configuration

For production deployment:

1. **Update CORS origins** in `application.yml` to your production domains
2. **Use mounted volumes** for storage directories
3. **Set up monitoring** via actuator endpoints
4. **Configure logging** levels appropriately

## API Endpoints

### Product Management

#### Upload Product with Image
```bash
curl -X POST "http://localhost:8080/api/products" \
  -F "image=@product-image.jpg" \
  -F "name=Classic Blue Jeans" \
  -F "sku=JEANS-001-BLUE" \
  -F "color=Blue" \
  -F "description=Comfortable classic fit blue jeans"
```

#### List All Products
```bash
curl -X GET "http://localhost:8080/api/products"
```

#### Get Product by ID
```bash
curl -X GET "http://localhost:8080/api/products/{productId}"
```

### Virtual Try-On

#### Submit Try-On Job (with existing product)
```bash
curl -X POST "http://localhost:8080/api/tryon" \
  -F "productId=123e4567-e89b-12d3-a456-426614174000" \
  -F "userImage=@user-photo.jpg" \
  -F "prompt=Show the blue jeans on the person with a casual fit"
```

#### Submit Try-On Job (with new product image)
```bash
curl -X POST "http://localhost:8080/api/tryon" \
  -F "productImage=@new-product.jpg" \
  -F "userImage=@user-photo.jpg" \
  -F "prompt=Show the jeans on the person with a casual fit"
```

#### Check Job Status
```bash
curl -X GET "http://localhost:8080/api/tryon/{jobId}"
```

## Try-On Service Requirements

The backend calls an external try-on microservice that must implement a specialized two-image garment transfer model. **Generic text-to-image models are not suitable** for accurate virtual try-on.

### Recommended Architecture

- **TryOnDiffusion** with Parallel-UNet architecture
- **Garment preservation**: Maintains garment identity, color, and texture
- **Pose awareness**: Realistic draping and fit based on person's pose
- **Two-image conditioning**: Uses both product and person images as input

### External Service API Contract

**Endpoint**: `POST /api/tryon`

**Request**: Multipart form data
- `productImage`: Product garment image (JPEG/PNG)
- `userImage`: Person/customer image (JPEG/PNG) 
- `prompt`: Text description of desired result

**Response**: Binary image data (JPEG/PNG)

**Example Implementation**: 
- TryOnDiffusion: https://github.com/fashn-AI/tryondiffusion
- Academic paper: [TryOnDiffusion: A Tale of Two UNets](https://arxiv.org/abs/2306.08276)

## Storage Architecture

```
./storage/
├── products/          # Product images (UUID-named)
├── user/             # User uploaded images  
└── results/          # Generated try-on results
```

Files are served via `/api/images/{category}/{filename}` endpoints with proper content-type headers.

## Database Integration (Future)

The current implementation uses in-memory storage for rapid prototyping. To add database persistence:

### 1. Add JPA Dependencies

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
<!-- Or for PostgreSQL -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

### 2. Create JPA Entities

```java
@Entity
public class Product {
    @Id
    private String id;
    private String name;
    private String sku;
    private String imagePath;
    // ... other fields
}

@Entity  
public class TryOnJob {
    @Id
    private String jobId;
    @Enumerated(EnumType.STRING)
    private JobStatus status;
    // ... other fields
}
```

### 3. Replace Service Layer

Replace `ConcurrentHashMap` storage in services with JPA repositories:

```java
@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    List<Product> findByNameContainingIgnoreCase(String name);
}
```

## Monitoring and Health

### Health Checks
- **Application Health**: `/actuator/health`
- **Metrics**: `/actuator/metrics`
- **Info**: `/actuator/info`

### Logging

Logs include request IDs for tracing:
```
2024-01-15 10:30:00 [http-nio-8080-exec-1] INFO [req-abc123] ProductController - Created product: Classic Blue Jeans
```

## Security Considerations

### File Upload Security
- **MIME type validation**: Only JPEG/PNG allowed
- **File size limits**: 10MB maximum
- **Filename sanitization**: Prevents path traversal attacks
- **Content type verification**: Double-checks file headers

### CORS Configuration
- **Development**: Allows `localhost:3000` (Next.js)
- **Production**: Configure specific domains in `application.yml`

## Future Enhancements

### Creative Image Generation (Optional)

For marketing shots and creative edits, Google Imagen 3 is available via Gemini API:

```java
// Example utility for future creative generation (separate from try-on)
@Service
public class CreativeImageService {
    
    @Value("${gemini.api-key}")
    private String geminiApiKey;
    
    public byte[] generateMarketingShot(String prompt) {
        // Call Gemini API with Imagen 3 model
        // Used for: product photography, background generation, creative edits
        // NOT for virtual try-on (use specialized try-on service instead)
    }
}
```

### Performance Optimizations
- **Async file processing**: Background image optimization
- **CDN integration**: Serve images from CDN
- **Database indexing**: Optimize product queries
- **Caching**: Redis for frequently accessed data

## Troubleshooting

### Common Issues

1. **Storage directory permissions**:
   ```bash
   chmod -R 755 ./storage/
   ```

2. **Try-on service connection**:
   - Verify `TRYON_SERVICE_URL` is accessible
   - Check microservice health endpoint
   - Review logs for connection errors

3. **File upload failures**:
   - Check file size limits in `application.yml`
   - Verify MIME types are in allowed list
   - Ensure storage directories exist and are writable

### Debug Mode

Enable debug logging:
```yaml
logging:
  level:
    com.tryon: DEBUG
    org.springframework.web: DEBUG
```

## License

MIT License - see LICENSE file for details.

## Support

For issues related to:
- **Backend API**: Check logs and actuator endpoints
- **Try-on quality**: Verify external microservice model
- **File uploads**: Review storage configuration and permissions
