package interview.organiser.exception;

/**
 * Exception thrown when invitation has expired
 */
public class InvitationExpiredException extends RuntimeException {

    public InvitationExpiredException(String message) {
        super(message);
    }
}

