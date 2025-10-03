# API Reference

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible during development.

## Base URL

```
http://localhost:8080
```

## Content Types

- **Request**: `application/json` or `multipart/form-data`
- **Response**: `application/json`
- **Images**: Binary data with appropriate MIME types

---

## Products API

### List All Products

**GET** `/api/products`

Retrieves all available products in the system.

**Response 200:**
```json
[
  {
    "id": "1",
    "name": "Summer Floral Dress",
    "description": "Light and airy summer dress perfect for casual outings",
    "imageUrl": "/products/product1.jpg",
    "category": "clothing",
    "price": 89.99
  },
  {
    "id": "2", 
    "name": "Elegant Evening Gown",
    "description": "Sophisticated evening gown for special occasions",
    "imageUrl": "/products/product2.jpg",
    "category": "formal",
    "price": 249.99
  }
]
```

### Get Product by ID

**GET** `/api/products/{id}`

Retrieves a specific product by its unique identifier.

**Parameters:**
- `id` (path, required): Product identifier (string)

**Response 200:**
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

**Response 404:**
```json
{
  "message": "Product not found with id: 1",
  "timestamp": "2024-01-20T10:30:00Z",
  "status": 404,
  "path": "/api/products/1"
}
```

### Create Product

**POST** `/api/products`

Creates a new product in the system.

**Request Body:**
```json
{
  "name": "New Product Name",
  "description": "Detailed product description",
  "category": "clothing",
  "price": 99.99
}
```

**Response 201:**
```json
{
  "id": "6",
  "name": "New Product Name", 
  "description": "Detailed product description",
  "imageUrl": null,
  "category": "clothing",
  "price": 99.99
}
```

**Response 400:**
```json
{
  "message": "Validation failed: Name is required",
  "timestamp": "2024-01-20T10:30:00Z",
  "status": 400,
  "path": "/api/products"
}
```

---

## Virtual Try-On API

### Process Try-On Request

**POST** `/api/tryon`

Processes a virtual try-on request using AI image generation.

**Content-Type:** `multipart/form-data`

**Parameters:**
- `productId` (form-data, required): ID of the product to try on
- `userImage` (file, required): User's photo (JPEG/PNG, max 10MB)
- `prompt` (form-data, optional): Additional instructions for AI

**Example Request:**
```bash
curl -X POST http://localhost:8080/api/tryon \
  -F "productId=1" \
  -F "userImage=@user_photo.jpg" \
  -F "prompt=Make sure the dress fits well"
```

**Response 200 (Success):**
```json
{
  "jobId": "tryon_job_1642680600000",
  "status": "COMPLETED",
  "resultImageUrl": "/api/images/result_1642680600000.jpg",
  "processingTimeMs": 2847,
  "prompt": "Create a virtual try-on image showing the Summer Floral Dress on the person in the uploaded photo. Ensure realistic fit, natural lighting, and accurate color representation. Make sure the dress fits well."
}
```

**Response 200 (Processing):**
```json
{
  "jobId": "tryon_job_1642680600000", 
  "status": "PROCESSING",
  "resultImageUrl": null,
  "processingTimeMs": 0,
  "prompt": "Create a virtual try-on image showing the Summer Floral Dress on the person in the uploaded photo. Ensure realistic fit, natural lighting, and accurate color representation."
}
```

**Response 400 (Invalid Request):**
```json
{
  "message": "Product ID is required",
  "timestamp": "2024-01-20T10:30:00Z", 
  "status": 400,
  "path": "/api/tryon"
}
```

**Response 413 (File Too Large):**
```json
{
  "message": "File size exceeds maximum allowed size of 10MB",
  "timestamp": "2024-01-20T10:30:00Z",
  "status": 413,
  "path": "/api/tryon"
}
```

**Response 500 (Processing Error):**
```json
{
  "message": "Failed to process virtual try-on request",
  "timestamp": "2024-01-20T10:30:00Z",
  "status": 500,
  "path": "/api/tryon"
}
```

---

## Image API

### Get Image

**GET** `/api/images/{filename}`

Retrieves an uploaded or generated image file.

**Parameters:**
- `filename` (path, required): Name of the image file

**Response 200:**
- **Content-Type**: `image/jpeg`, `image/png`, or appropriate MIME type
- **Body**: Binary image data

**Response 404:**
```json
{
  "message": "Image not found: result_123456.jpg",
  "timestamp": "2024-01-20T10:30:00Z",
  "status": 404,
  "path": "/api/images/result_123456.jpg"
}
```

**Example Usage:**
```html
<img src="http://localhost:8080/api/images/result_1642680600000.jpg" alt="Try-on result" />
```

---

## Data Models

### Product

```typescript
interface Product {
  id: string;              // Unique product identifier
  name: string;            // Product name
  description: string;     // Product description
  imageUrl: string | null; // Relative path to product image
  category: string;        // Product category (e.g., "clothing", "formal")
  price: number;          // Product price in USD
}
```

### ProductRequest

```typescript
interface ProductRequest {
  name: string;        // Required: Product name
  description: string; // Required: Product description  
  category: string;    // Required: Product category
  price: number;       // Required: Product price (positive number)
}
```

### TryOnJobResponse

```typescript
interface TryOnJobResponse {
  jobId: string;                    // Unique job identifier
  status: "PROCESSING" | "COMPLETED" | "FAILED"; // Job status
  resultImageUrl: string | null;    // URL to result image (null if processing/failed)
  processingTimeMs: number;         // Processing time in milliseconds
  prompt: string;                   // AI prompt used for generation
}
```

### ErrorResponse

```typescript
interface ErrorResponse {
  message: string;    // Error description
  timestamp: string;  // ISO 8601 timestamp
  status: number;     // HTTP status code
  path: string;       // Request path that caused the error
}
```

---

## File Upload Constraints

### Image Files

- **Supported Formats**: JPEG, PNG
- **Maximum Size**: 10MB per file
- **Dimensions**: No specific restrictions, but recommended max 2000x2000px for optimal processing
- **Color Space**: RGB recommended

### Form Data Limits

- **Maximum Request Size**: 10MB total
- **Field Limits**: Standard multipart form data limits apply

---

## Status Codes

| Code | Description | Usage |
|------|-------------|--------|
| 200 | OK | Successful GET requests |
| 201 | Created | Successful POST requests creating resources |
| 400 | Bad Request | Invalid request parameters or validation errors |
| 404 | Not Found | Resource not found |
| 413 | Payload Too Large | File size exceeds limits |
| 500 | Internal Server Error | Server processing errors |

---

## Rate Limiting

Currently, no rate limiting is implemented. In production, consider implementing:

- API key-based rate limiting
- IP-based request throttling  
- File upload frequency limits
- AI processing queue management

---

## Examples

### Complete Try-On Workflow

```bash
# 1. Get available products
curl http://localhost:8080/api/products

# 2. Submit try-on request
curl -X POST http://localhost:8080/api/tryon \
  -F "productId=1" \
  -F "userImage=@user_photo.jpg" \
  -F "prompt=Show natural lighting"

# 3. Get result image (use resultImageUrl from step 2)
curl http://localhost:8080/api/images/result_1642680600000.jpg \
  --output tryon_result.jpg
```

### JavaScript/Fetch Example

```javascript
// Submit try-on request
const formData = new FormData();
formData.append('productId', '1');
formData.append('userImage', fileInput.files[0]);
formData.append('prompt', 'Natural lighting please');

const response = await fetch('http://localhost:8080/api/tryon', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log('Try-on result:', result);

// Display result image
if (result.status === 'COMPLETED') {
  const imageUrl = `http://localhost:8080${result.resultImageUrl}`;
  document.getElementById('result').src = imageUrl;
}
```
