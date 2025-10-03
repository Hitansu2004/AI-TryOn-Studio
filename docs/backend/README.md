# Backend Documentation

## Overview

The Virtual Try-On Backend is a Spring Boot application that provides AI-powered virtual try-on functionality using Google's Gemini 2.5 Flash Image API. The application allows users to upload their photos and see how different products would look on them.

## Architecture

### Technologies Used
- **Java 21**: Modern Java runtime with latest features
- **Spring Boot 3.x**: Core framework for REST API development
- **Spring Web**: REST API endpoints and request handling
- **Gemini 2.5 Flash Image API**: AI-powered image generation and virtual try-on
- **Maven**: Dependency management and build tool

### Project Structure
```
src/main/java/com/tryon/
├── TryOnBackendApplication.java    # Main application entry point
├── config/                         # Configuration classes
│   ├── CorsConfig.java            # Cross-origin resource sharing setup
│   └── OpenApiConfig.java         # API documentation configuration
├── controller/                     # REST API endpoints
│   ├── ImageController.java       # Image upload and management
│   ├── ProductController.java     # Product CRUD operations
│   └── TryOnController.java       # Virtual try-on processing
├── dto/                           # Data Transfer Objects
│   ├── ErrorResponse.java         # Error response structure
│   ├── ProductRequest.java        # Product creation request
│   ├── ProductResponse.java       # Product data response
│   ├── TryOnJobResponse.java      # Try-on job status and results
│   └── TryOnRequest.java          # Try-on processing request
├── error/                         # Error handling
│   └── GlobalExceptionHandler.java # Global exception management
└── service/                       # Business logic
    ├── GeminiImageService.java    # Gemini API integration
    ├── ImageStorageService.java   # File storage management
    ├── ProductService.java        # Product business logic
    └── TryOnService.java          # Try-on processing logic
```

## API Endpoints

### Product Management

#### GET /api/products
Retrieve all available products.

**Response:**
```json
[
  {
    "id": "1",
    "name": "Summer Floral Dress",
    "description": "Light and airy summer dress perfect for casual outings",
    "imageUrl": "/products/product1.jpg",
    "category": "clothing",
    "price": 89.99
  }
]
```

#### GET /api/products/{id}
Retrieve a specific product by ID.

**Parameters:**
- `id` (path): Product identifier

**Response:**
```json
{
  "id": "1",
  "name": "Summer Floral Dress",
  "description": "Light and airy summer dress perfect for casual outings",
  "imageUrl": "/products/product1.jpg",
  "category": "clothing",
  "price": 89.99
}
```

#### POST /api/products
Create a new product.

**Request Body:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "category": "clothing",
  "price": 99.99
}
```

### Virtual Try-On

#### POST /api/tryon
Process virtual try-on request using Gemini AI.

**Request (Multipart Form Data):**
- `productId` (string): ID of the product to try on
- `userImage` (file): User's photo for virtual try-on
- `prompt` (string, optional): Additional instructions for AI

**Response:**
```json
{
  "jobId": "job_123456",
  "status": "COMPLETED",
  "resultImageUrl": "/api/images/result_123456.jpg",
  "processingTimeMs": 2500,
  "prompt": "Generated AI prompt for virtual try-on"
}
```

### Image Management

#### GET /api/images/{filename}
Retrieve uploaded or generated images.

**Parameters:**
- `filename` (path): Name of the image file

**Response:** Binary image data

## Services

### GeminiImageService

Handles integration with Google's Gemini 2.5 Flash Image API for virtual try-on processing.

**Key Features:**
- Automatic prompt generation for optimal results
- Image preprocessing and optimization
- Error handling and retry logic
- Response parsing and validation

**Configuration:**
```yaml
gemini:
  api:
    key: "AIzaSyCyRRweZEPFn8u-MR7ZGkE8JL58Jykf0Qs"
    url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent"
    model: "gemini-2.0-flash-exp"
```

### ProductService

Manages product data and business logic.

**Features:**
- Product CRUD operations
- Product data validation
- Category management
- Price calculations

### ImageStorageService

Handles file storage for uploaded and generated images.

**Features:**
- Secure file upload handling
- Image validation and processing
- File system organization
- Cleanup and maintenance

### TryOnService

Orchestrates the virtual try-on process.

**Features:**
- Request validation
- Service coordination
- Result processing
- Error handling

## Configuration

### Application Properties
Located in `src/main/resources/application.yml`:

```yaml
server:
  port: 8080

spring:
  application:
    name: tryon-backend
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB

gemini:
  api:
    key: "AIzaSyCyRRweZEPFn8u-MR7ZGkE8JL58Jykf0Qs"
    url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent"
    model: "gemini-2.0-flash-exp"

cors:
  allowed-origins: "http://localhost:3000"
  allowed-methods: "GET,POST,PUT,DELETE,OPTIONS"
  allowed-headers: "*"

logging:
  level:
    com.tryon: DEBUG
    org.springframework: INFO
```

### CORS Configuration
Cross-origin requests are configured to allow frontend communication:
- **Allowed Origins**: http://localhost:3000 (development)
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Allowed Headers**: All headers (*) 

## Error Handling

### Global Exception Handler
The `GlobalExceptionHandler` provides centralized error handling:

**Error Response Format:**
```json
{
  "message": "Error description",
  "timestamp": "2024-01-20T10:30:00Z",
  "status": 400,
  "path": "/api/tryon"
}
```

**Common Error Codes:**
- `400 Bad Request`: Invalid request parameters
- `404 Not Found`: Resource not found
- `413 Payload Too Large`: File size exceeds limit
- `500 Internal Server Error`: Server processing error

## Development

### Running the Application

1. **Prerequisites:**
   - Java 21 or higher
   - Maven 3.6+
   - Valid Gemini API key

2. **Build and Run:**
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

3. **Access:**
   - API Base URL: http://localhost:8080
   - Swagger UI: http://localhost:8080/swagger-ui.html
   - Health Check: http://localhost:8080/actuator/health

### Testing

**Manual Testing:**
```bash
# Test product listing
curl http://localhost:8080/api/products

# Test virtual try-on
curl -X POST http://localhost:8080/api/tryon \
  -F "productId=1" \
  -F "userImage=@user_photo.jpg" \
  -F "prompt=Show this dress on the person"
```

### Dependencies

**Core Dependencies:**
- `spring-boot-starter-web`: Web application framework
- `spring-boot-starter-validation`: Input validation
- `jackson-databind`: JSON processing
- `commons-io`: File operations

**Development Dependencies:**
- `spring-boot-starter-test`: Testing framework
- `spring-boot-devtools`: Development tools

## Security Considerations

1. **API Key Protection**: Gemini API key is stored in configuration
2. **File Upload Validation**: Size and type restrictions on uploads
3. **Input Sanitization**: All user inputs are validated
4. **CORS Configuration**: Restricted to specific origins
5. **Error Information**: Sensitive information excluded from error responses

## Performance Optimization

1. **Image Processing**: Optimized image handling for faster processing
2. **API Calls**: Efficient Gemini API usage with proper error handling
3. **File Storage**: Organized file system structure for quick access
4. **Memory Management**: Proper resource cleanup and disposal

## Monitoring and Logging

- **Application Logs**: Comprehensive logging for debugging
- **API Metrics**: Request/response timing and status
- **Error Tracking**: Detailed error logging with context
- **Health Monitoring**: Actuator endpoints for system health
