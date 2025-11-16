package interview.organiser.exception;

/**
 * Exception thrown when there is a conflict with existing data
 */
public class ResourceAlreadyExistsException extends RuntimeException {

    public ResourceAlreadyExistsException(String message) {
        super(message);
    }
}

