package com.tryon.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO for try-on job status and result
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Try-on job response with status and result information")
public class TryOnJobResponse {

    @Schema(description = "Unique job identifier", example = "job-123e4567-e89b-12d3-a456-426614174000")
    private String jobId;

    @Schema(description = "Current job status",
            example = "SUCCEEDED",
            allowableValues = {"QUEUED", "RUNNING", "SUCCEEDED", "FAILED"})
    private JobStatus status;

    @Schema(description = "URL to access the generated try-on result image (available when status is SUCCEEDED)",
            example = "http://localhost:8080/api/images/results/job-123e4567-e89b-12d3-a456-426614174000.jpg")
    private String resultImageUrl;

    @Schema(description = "Source product ID used for try-on (if applicable)")
    private String sourceProductId;

    @Schema(description = "Original prompt used for try-on processing")
    private String prompt;

    @Schema(description = "Error message (available when status is FAILED)")
    private String errorMessage;

    @Schema(description = "Job creation timestamp")
    private LocalDateTime createdAt;

    @Schema(description = "Job completion timestamp (when status becomes SUCCEEDED or FAILED)")
    private LocalDateTime completedAt;

    @Schema(description = "Estimated processing time in seconds")
    private Integer estimatedProcessingTimeSeconds;

    /**
     * Job processing status enumeration
     */
    public enum JobStatus {
        QUEUED,     // Job submitted and waiting to be processed
        RUNNING,    // Job currently being processed by try-on service
        SUCCEEDED,  // Job completed successfully, result available
        FAILED      // Job failed, check errorMessage for details
    }
}
