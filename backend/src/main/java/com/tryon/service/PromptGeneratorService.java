package com.tryon.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Service for generating AI prompts for virtual try-on using Gemini API
 * Contains carefully crafted prompts for realistic virtual clothing try-on
 */
@Component
@Slf4j
public class PromptGeneratorService {

    /**
     * Generate a comprehensive prompt for virtual try-on that works for all demographics
     * and clothing types. This prompt is designed to create realistic, natural-looking
     * virtual try-on results.
     */
    public String generateVirtualTryOnPrompt(String productName, String productCategory, 
                                           String productDescription, String gender, 
                                           String[] availableSizes, String[] availableColors) {
        
        String basePrompt = buildBasePrompt();
        String productSpecific = buildProductSpecificPrompt(productName, productCategory, productDescription);
        String fittingGuidelines = buildFittingGuidelines(gender, availableSizes);
        String qualityAndRealism = buildQualityGuidelines();
        String technicalRequirements = buildTechnicalRequirements();
        
        String fullPrompt = String.join("\n\n", 
            basePrompt, 
            productSpecific, 
            fittingGuidelines, 
            qualityAndRealism, 
            technicalRequirements
        );
        
        log.info("Generated virtual try-on prompt for product: {} (category: {})", productName, productCategory);
        return fullPrompt;
    }

    private String buildBasePrompt() {
        return """
            CREATE A PHOTOREALISTIC VIRTUAL TRY-ON IMAGE:
            
            You are an expert fashion AI specializing in virtual clothing try-on technology. 
            You will receive two images:
            1. A product image showing a clothing item
            2. A customer's photo (person who wants to try on the clothing)
            
            Your task is to create a highly realistic, natural-looking image where the customer 
            is wearing the clothing item from the product image. The result should look like 
            a real photograph, not an AI-generated or edited image.
            """;
    }

    private String buildProductSpecificPrompt(String productName, String productCategory, String productDescription) {
        return String.format("""
            PRODUCT INFORMATION:
            - Product Name: %s
            - Category: %s
            - Description: %s
            
            CLOTHING INTEGRATION REQUIREMENTS:
            - Replace or overlay the customer's existing clothing with the product item
            - Maintain the exact design, pattern, color, and style from the product image
            - Ensure the clothing item appears to be the same material and texture as shown in the product image
            - If the product has specific details (buttons, zippers, logos, embroidery, prints), include them accurately
            - The clothing should appear to be properly fitted and naturally worn by the customer
            """, productName, productCategory, productDescription);
    }

    private String buildFittingGuidelines(String gender, String[] availableSizes) {
        String sizeInfo = availableSizes != null ? String.join(", ", availableSizes) : "Standard sizes";
        
        return String.format("""
            FITTING AND SIZING GUIDELINES:
            - Target demographic: %s
            - Available sizes: %s
            - Ensure the clothing fits naturally on the customer's body type and size
            - Adjust the clothing proportions to match the customer's body dimensions
            - The fit should look comfortable and appropriate for the clothing type
            - For formal wear: ensure crisp, tailored appearance
            - For casual wear: ensure relaxed, comfortable fit
            - For sportswear: ensure athletic, flexible fit
            - Maintain natural body proportions and posture
            - Ensure clothing drapes and folds realistically based on fabric type and body movement
            """, gender, sizeInfo);
    }

    private String buildQualityGuidelines() {
        return """
            REALISM AND QUALITY STANDARDS:
            
            LIGHTING AND SHADOWS:
            - Match the lighting conditions from the customer's original photo
            - Create realistic shadows and highlights on the clothing
            - Ensure consistent light direction and intensity
            - Add subtle fabric texture shadows and natural creases
            
            BODY INTEGRATION:
            - Preserve the customer's natural body shape, posture, and proportions
            - Maintain the customer's skin tone, facial features, and hair exactly as in the original
            - Keep the customer's pose, gesture, and body position unchanged
            - Ensure seamless integration between clothing and visible body parts
            
            FABRIC REALISM:
            - Show appropriate fabric texture, sheen, and material properties
            - Display natural fabric behavior (how it hangs, wrinkles, stretches)
            - For denim: show appropriate stiffness and texture
            - For knits: show soft draping and stretch
            - For silk/satin: show appropriate sheen and flow
            - For cotton: show natural matte finish and moderate draping
            
            ENVIRONMENTAL CONSISTENCY:
            - Keep the background exactly as in the customer's original photo
            - Maintain the same setting, environment, and context
            - Preserve any objects or people in the background
            - Ensure the new clothing fits naturally within the scene's context
            """;
    }

    private String buildTechnicalRequirements() {
        return """
            TECHNICAL SPECIFICATIONS:
            
            IMAGE QUALITY:
            - Output resolution should match or exceed the customer's input image
            - Maintain high definition with sharp details
            - Ensure no blurriness, artifacts, or unnatural transitions
            - Preserve image quality without compression artifacts
            
            COLOR ACCURACY:
            - Match the exact colors from the product image
            - Maintain color consistency under the customer's lighting conditions
            - Ensure natural color interaction with skin tone and environment
            - Handle color variations due to lighting realistically
            
            EDGE AND BOUNDARY HANDLING:
            - Create seamless edges where clothing meets skin
            - Ensure natural transitions at clothing boundaries
            - Handle overlapping clothing layers realistically
            - Maintain proper depth and layering of clothing items
            
            POSE AND MOVEMENT:
            - Adapt clothing to the customer's specific pose and body position
            - Show how the clothing would naturally fall and move with the body
            - Ensure clothing behavior matches the customer's stance and movement
            - Handle seated, standing, or dynamic poses appropriately
            
            FINAL VERIFICATION:
            - The result should look like a genuine photograph of the customer wearing the product
            - No obvious signs of digital manipulation or AI generation
            - Natural, believable, and commercially viable for e-commerce display
            - The customer should look comfortable and confident in the clothing
            """;
    }

    /**
     * Generate a shorter, optimized prompt for API calls with character limits
     */
    public String generateOptimizedPrompt(String productName, String productCategory) {
        return String.format("""
            Create a photorealistic image where the person in the uploaded photo is wearing the %s (%s) 
            from the product image. Requirements:
            
            1. REPLACE/OVERLAY: Seamlessly replace the person's current clothing with the product item
            2. EXACT MATCH: Use the exact design, color, pattern, and style from the product image
            3. NATURAL FIT: Ensure the clothing fits naturally on the person's body type and proportions
            4. PRESERVE PERSON: Keep the person's face, body shape, pose, and background exactly the same
            5. REALISTIC LIGHTING: Match lighting, shadows, and fabric texture to look like a real photograph
            6. HIGH QUALITY: Output should be sharp, detailed, and commercially viable
            
            The final image should look like a genuine photograph of the person naturally wearing the product,
            with no signs of digital manipulation. Focus on realism, proper fit, and natural appearance.
            """, productName, productCategory);
    }

    /**
     * Generate prompt specifically for children's clothing
     */
    public String generateKidsPrompt(String productName, String productCategory) {
        return String.format("""
            Create a photorealistic image of the child wearing the %s (%s) from the product image.
            
            SPECIAL CONSIDERATIONS FOR CHILDREN:
            - Ensure age-appropriate fit and styling
            - Maintain playful, comfortable appearance
            - Show clothing that allows for natural child movement and play
            - Ensure safety considerations (no loose strings, appropriate coverage)
            - Keep the child's natural expression and pose
            - Use bright, cheerful styling appropriate for children
            
            Standard requirements: exact product match, natural lighting, high quality, 
            seamless integration, preserve child's appearance and background.
            """, productName, productCategory);
    }

    /**
     * Generate prompt for formal wear
     */
    public String generateFormalWearPrompt(String productName, String productCategory) {
        return String.format("""
            Create a photorealistic image showing the person wearing the %s (%s) in a formal context.
            
            FORMAL WEAR SPECIFICS:
            - Ensure crisp, tailored, professional appearance
            - Show proper formal fit and draping
            - Display appropriate formality for business/special occasions
            - Ensure clothing appears well-pressed and properly maintained
            - Show sophisticated styling and presentation
            
            Maintain exact product details, natural lighting, high quality, and seamless integration.
            The person should look professionally dressed and confident.
            """, productName, productCategory);
    }
}
