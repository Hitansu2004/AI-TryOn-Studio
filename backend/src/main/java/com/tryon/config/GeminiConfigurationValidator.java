package com.tryon.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class GeminiConfigurationValidator {
    
    private static final Logger logger = LoggerFactory.getLogger(GeminiConfigurationValidator.class);
    
    @Value("${gemini.api-key:#{null}}")
    private String apiKey;
    
    @Value("${gemini.api-url:#{null}}")
    private String apiUrl;
    
    @EventListener(ApplicationReadyEvent.class)
    public void validateConfiguration() {
        logger.info("=== Gemini Configuration Validation ===");
        
        if (apiKey == null || apiKey.trim().isEmpty()) {
            logger.error("❌ Gemini API key is not configured!");
            logger.error("Please set gemini.api-key in application.yml");
        } else {
            logger.info("✅ Gemini API key is configured (length: {})", apiKey.length());
        }
        
        if (apiUrl == null || apiUrl.trim().isEmpty()) {
            logger.error("❌ Gemini API URL is not configured!");
            logger.error("Please set gemini.api-url in application.yml");
        } else {
            logger.info("✅ Gemini API URL is configured: {}", apiUrl);
        }
        
        // Test basic connectivity
        if (apiKey != null && !apiKey.trim().isEmpty() && 
            apiUrl != null && !apiUrl.trim().isEmpty()) {
            logger.info("✅ Basic Gemini configuration appears valid");
            logger.info("Note: Full API connectivity will be tested on first try-on request");
        } else {
            logger.warn("⚠️ Gemini configuration incomplete - virtual try-on will not work");
        }
        
        logger.info("=== Configuration Validation Complete ===");
    }
}
