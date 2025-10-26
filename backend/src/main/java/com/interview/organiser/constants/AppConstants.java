package com.interview.organiser.constants;

/**
 * Application-wide constants
 */
public final class AppConstants {

    private AppConstants() {
        // Private constructor to prevent instantiation
    }

    // API Configuration
    public static final String API_VERSION = "v1";
    public static final String API_BASE_PATH = "/api/" + API_VERSION;

    // Application Info
    public static final String APP_NAME = "Interview Organiser";
    public static final String APP_VERSION = "1.0.0";

    // Pagination
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MAX_PAGE_SIZE = 100;
    public static final String DEFAULT_SORT_FIELD = "createdAt";
    public static final String DEFAULT_SORT_DIRECTION = "DESC";

    // Date Formats
    public static final String DATE_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";
    public static final String DATE_FORMAT = "yyyy-MM-dd";
    public static final String TIME_FORMAT = "HH:mm:ss";

    // Validation
    public static final int MIN_PASSWORD_LENGTH = 8;
    public static final int MAX_PASSWORD_LENGTH = 50;
    public static final int MAX_NAME_LENGTH = 100;
    public static final int MAX_EMAIL_LENGTH = 100;
    public static final int MAX_DESCRIPTION_LENGTH = 500;
}

