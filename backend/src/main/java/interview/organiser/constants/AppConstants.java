package interview.organiser.constants;

/**
 * Application-wide constants
 */
public class AppConstants {

    // JWT Constants
    public static final String JWT_HEADER = "Authorization";
    public static final String JWT_TOKEN_PREFIX = "Bearer ";

    // Pagination Constants
    public static final int DEFAULT_PAGE_SIZE = 5;
    public static final int MAX_PAGE_SIZE = 100;
    public static final String DEFAULT_SORT_BY = "createdAt";
    public static final String DEFAULT_SORT_DIRECTION = "DESC";

    // Password Pattern
    public static final String PASSWORD_PATTERN = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";

    // Email Pattern
    public static final String EMAIL_PATTERN = "^[A-Za-z0-9+_.-]+@(.+)$";

    // Phone Pattern
    public static final String PHONE_PATTERN = "^[0-9]{10,15}$";

    // Token Types
    public static final String ACCESS_TOKEN = "ACCESS";
    public static final String REFRESH_TOKEN = "REFRESH";

    // Default Values
    public static final int DEFAULT_INVITATION_EXPIRY_DAYS = 7;

    private AppConstants() {
        // Private constructor to prevent instantiation
    }
}

