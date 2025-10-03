package com.tryon.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * OpenAPI configuration for Swagger UI documentation
 *
 * Swagger UI available at: http://localhost:8080/swagger-ui.html
 * OpenAPI JSON spec at: http://localhost:8080/v3/api-docs
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Virtual Try-On E-commerce API")
                        .version("1.0.0")
                        .description("Backend API for virtual try-on e-commerce platform. " +
                                   "Supports product image management and virtual try-on processing " +
                                   "via external specialized microservice.")
                        .contact(new Contact()
                                .name("Try-On Team")
                                .email("support@tryon.com")))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Development server"),
                        new Server().url("https://api.tryon.com").description("Production server")
                ));
    }
}
