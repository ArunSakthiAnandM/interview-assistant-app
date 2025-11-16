package interview.organiser.exception;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Standard error response format for all API errors
 */
@Data
@AllArgsConstructor
public class ErrorResponse {

    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
    private Map<String, String> fieldErrors; // For validation errors

    public ErrorResponse(LocalDateTime timestamp, int status, String error, String message, String path) {
        this.timestamp = timestamp;
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
    }
}

