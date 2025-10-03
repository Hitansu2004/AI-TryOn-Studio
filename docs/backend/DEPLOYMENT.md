# Deployment Guide

## Overview

This guide covers deploying the Virtual Try-On Backend application to various environments including local development, staging, and production.

## Prerequisites

### System Requirements

- **Java**: OpenJDK 21 or Oracle JDK 21+
- **Memory**: Minimum 2GB RAM (4GB recommended)
- **Storage**: 10GB free space for application and image storage
- **Network**: Internet access for Gemini API calls

### External Dependencies

- **Gemini API**: Valid Google AI Studio API key
- **Frontend Application**: Deployed at known URL for CORS configuration

---

## Local Development

### 1. Environment Setup

```bash
# Clone repository
git clone <repository-url>
cd backend

# Verify Java version
java --version  # Should be 21+

# Verify Maven installation
mvn --version   # Should be 3.6+
```

### 2. Configuration

Create or update `src/main/resources/application-local.yml`:

```yaml
server:
  port: 8080

spring:
  profiles:
    active: local
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB

gemini:
  api:
    key: "YOUR_GEMINI_API_KEY"
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
    org.springframework.web: DEBUG
```

### 3. Build and Run

```bash
# Clean and compile
mvn clean compile

# Run tests
mvn test

# Start application
mvn spring-boot:run
```

### 4. Verify Deployment

```bash
# Health check
curl http://localhost:8080/actuator/health

# API test
curl http://localhost:8080/api/products
```

---

## Docker Deployment

### 1. Create Dockerfile

Create `Dockerfile` in the backend root:

```dockerfile
# Multi-stage build for optimized image
FROM openjdk:21-jdk-slim AS builder

WORKDIR /app
COPY pom.xml .
COPY src ./src

# Install Maven
RUN apt-get update && apt-get install -y maven

# Build application
RUN mvn clean package -DskipTests

# Production stage
FROM openjdk:21-jre-slim

WORKDIR /app

# Copy JAR file
COPY --from=builder /app/target/*.jar app.jar

# Create directories for file storage
RUN mkdir -p /app/storage/uploads /app/storage/results

# Set timezone
ENV TZ=UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Run as non-root user
RUN addgroup --system tryon && adduser --system --group tryon
RUN chown -R tryon:tryon /app
USER tryon

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 2. Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  tryon-backend:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=docker
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - CORS_ALLOWED_ORIGINS=${FRONTEND_URL:-http://localhost:3000}
    volumes:
      - ./storage:/app/storage
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### 3. Environment Configuration

Create `.env` file:

```env
GEMINI_API_KEY=your_actual_api_key_here
FRONTEND_URL=http://localhost:3000
```

### 4. Build and Deploy

```bash
# Build image
docker build -t tryon-backend .

# Run with Docker Compose
docker-compose up -d

# Check logs
docker-compose logs -f tryon-backend

# Stop services
docker-compose down
```

---

## Production Deployment

### 1. Production Configuration

Create `src/main/resources/application-prod.yml`:

```yaml
server:
  port: 8080
  servlet:
    context-path: /api
  compression:
    enabled: true
    mime-types: application/json,application/xml,text/html,text/xml,text/plain

spring:
  profiles:
    active: prod
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB

gemini:
  api:
    key: "${GEMINI_API_KEY}"
    url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent"
    model: "gemini-2.0-flash-exp"

cors:
  allowed-origins: "${CORS_ALLOWED_ORIGINS:https://your-frontend-domain.com}"
  allowed-methods: "GET,POST,PUT,DELETE,OPTIONS"
  allowed-headers: "*"

logging:
  level:
    com.tryon: INFO
    org.springframework: WARN
    org.springframework.security: INFO
  file:
    name: logs/tryon-backend.log
  logback:
    rollingpolicy:
      max-file-size: 10MB
      max-history: 30

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
  endpoint:
    health:
      show-details: when-authorized
```

### 2. Environment Variables

Set the following environment variables:

```bash
export SPRING_PROFILES_ACTIVE=prod
export GEMINI_API_KEY="your_production_api_key"
export CORS_ALLOWED_ORIGINS="https://your-frontend-domain.com"
export JVM_OPTS="-Xmx2g -Xms1g -XX:+UseG1GC"
```

### 3. Systemd Service (Linux)

Create `/etc/systemd/system/tryon-backend.service`:

```ini
[Unit]
Description=TryOn Backend Service
After=network.target

[Service]
Type=simple
User=tryon
WorkingDirectory=/opt/tryon-backend
ExecStart=/usr/bin/java -jar /opt/tryon-backend/app.jar
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=tryon-backend
Environment=SPRING_PROFILES_ACTIVE=prod
Environment=GEMINI_API_KEY=your_production_api_key
Environment=CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable tryon-backend
sudo systemctl start tryon-backend
sudo systemctl status tryon-backend
```

### 4. Nginx Reverse Proxy

Create `/etc/nginx/sites-available/tryon-backend`:

```nginx
server {
    listen 80;
    server_name api.your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.your-domain.com;

    # SSL configuration
    ssl_certificate /etc/ssl/certs/your-domain.crt;
    ssl_certificate_key /etc/ssl/private/your-domain.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;

    # Proxy settings
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Handle large file uploads
        client_max_body_size 10M;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Static file serving with caching
    location /api/images/ {
        proxy_pass http://localhost:8080;
        proxy_cache_valid 200 1h;
        add_header Cache-Control "public, max-age=3600";
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:8080/actuator/health;
        access_log off;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/tryon-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Cloud Deployment (AWS)

### 1. EC2 Instance Setup

```bash
# Launch EC2 instance (Ubuntu 22.04 LTS)
# Instance type: t3.medium or larger
# Security group: Allow ports 22, 80, 443, 8080

# Connect to instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Java 21
sudo apt install openjdk-21-jdk -y

# Install Docker (optional)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu
```

### 2. Application Deployment

```bash
# Create application directory
sudo mkdir -p /opt/tryon-backend
sudo chown ubuntu:ubuntu /opt/tryon-backend

# Upload JAR file
scp -i your-key.pem target/tryon-backend-*.jar ubuntu@your-instance-ip:/opt/tryon-backend/app.jar

# Create storage directories
mkdir -p /opt/tryon-backend/storage/{uploads,results}
mkdir -p /opt/tryon-backend/logs
```

### 3. Environment Configuration

```bash
# Create environment file
sudo tee /opt/tryon-backend/.env << EOF
SPRING_PROFILES_ACTIVE=prod
GEMINI_API_KEY=your_production_api_key
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
EOF

# Set proper permissions
sudo chmod 600 /opt/tryon-backend/.env
```

### 4. Load Balancer (ALB) Configuration

If using Application Load Balancer:

- **Target Group**: Port 8080, HTTP health check on `/actuator/health`
- **Health Check**: 30s interval, 3 healthy threshold
- **Sticky Sessions**: Not required
- **SSL Termination**: At load balancer level

---

## Monitoring and Maintenance

### 1. Health Monitoring

```bash
# Check application health
curl http://localhost:8080/actuator/health

# Monitor logs
tail -f logs/tryon-backend.log

# System resource monitoring
htop
df -h
```

### 2. Log Management

Configure log rotation in `/etc/logrotate.d/tryon-backend`:

```
/opt/tryon-backend/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    copytruncate
}
```

### 3. Backup Strategy

```bash
# Backup configuration
tar -czf backup-config-$(date +%Y%m%d).tar.gz \
    /opt/tryon-backend/.env \
    /etc/systemd/system/tryon-backend.service

# Backup user uploads (if needed)
tar -czf backup-uploads-$(date +%Y%m%d).tar.gz \
    /opt/tryon-backend/storage/uploads
```

### 4. Performance Tuning

JVM tuning for production:

```bash
export JVM_OPTS="-Xmx4g -Xms2g -XX:+UseG1GC -XX:MaxGCPauseMillis=200 -XX:+HeapDumpOnOutOfMemoryError"
```

---

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   sudo lsof -i :8080
   sudo kill -9 <PID>
   ```

2. **Out of Memory**
   ```bash
   # Increase JVM heap size
   export JVM_OPTS="-Xmx4g -Xms2g"
   ```

3. **File Permission Issues**
   ```bash
   sudo chown -R tryon:tryon /opt/tryon-backend/storage
   sudo chmod -R 755 /opt/tryon-backend/storage
   ```

4. **SSL Certificate Issues**
   ```bash
   # Verify certificate
   sudo certbot certificates
   
   # Renew certificates
   sudo certbot renew
   ```

### Debugging

Enable debug logging:

```yaml
logging:
  level:
    com.tryon: DEBUG
    org.springframework.web: DEBUG
    org.springframework.security: DEBUG
```

---

## Security Checklist

- [ ] API key stored securely (not in source code)
- [ ] HTTPS enabled in production
- [ ] CORS properly configured
- [ ] File upload validation enabled
- [ ] Rate limiting implemented (if needed)
- [ ] Security headers configured
- [ ] Regular security updates applied
- [ ] Backup strategy in place
- [ ] Monitoring and alerting configured
- [ ] Log rotation enabled
