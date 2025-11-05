package com.interview.organiser.constants;

public class AppConstants {

    // Application
    public static final String APPLICATION_NAME = "Interview Organiser";
    public static final String APPLICATION_VERSION = "1.0.0";

    // Pagination
    public static final int DEFAULT_PAGE_SIZE = 10;
    public static final int MAX_PAGE_SIZE = 100;
    public static final int DEFAULT_PAGE_NUMBER = 0;

    // JWT
    public static final long JWT_EXPIRATION_MS = 3600000; // 1 hour
    public static final long JWT_REFRESH_EXPIRATION_MS = 604800000; // 7 days
    public static final String BEARER_TOKEN_TYPE = "Bearer";

    // Date/Time
    public static final String DATE_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";
    public static final String DATE_FORMAT = "yyyy-MM-dd";
    public static final String TIME_ZONE = "UTC";

    // Validation
    public static final int MIN_PASSWORD_LENGTH = 8;
    public static final int MAX_PASSWORD_LENGTH = 100;
    public static final int MAX_NAME_LENGTH = 50;
    public static final int MAX_EMAIL_LENGTH = 100;
    public static final int MAX_PHONE_LENGTH = 20;
    public static final int MAX_URL_LENGTH = 500;
    public static final int MAX_TEXT_LENGTH = 5000;

    // Interview
    public static final int DEFAULT_INTERVIEW_DURATION = 60; // minutes
    public static final int MIN_INTERVIEW_DURATION = 15; // minutes
    public static final int MAX_INTERVIEW_DURATION = 480; // minutes (8 hours)

    // Feedback
    public static final int MIN_RATING = 1;
    public static final int MAX_RATING = 10;

    // Messages
    public static final String USER_NOT_FOUND = "User not found";
    public static final String CANDIDATE_NOT_FOUND = "Candidate not found";
    public static final String INTERVIEWER_NOT_FOUND = "Interviewer not found";
    public static final String INTERVIEW_NOT_FOUND = "Interview not found";
    public static final String FEEDBACK_NOT_FOUND = "Feedback not found";
    public static final String EMAIL_ALREADY_EXISTS = "Email already exists";
    public static final String INVALID_CREDENTIALS = "Invalid email or password";
    public static final String INVALID_TOKEN = "Invalid or expired token";
    public static final String UNAUTHORIZED_ACCESS = "Unauthorized access";
    public static final String ACCESS_DENIED = "Access denied";

    private AppConstants() {
        // Private constructor to prevent instantiation
    }
}


