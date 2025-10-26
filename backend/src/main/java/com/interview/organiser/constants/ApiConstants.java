package com.interview.organiser.constants;

/**
 * API endpoint constants
 */
public final class ApiConstants {

    private ApiConstants() {
        // Private constructor to prevent instantiation
    }

    // Base Paths
    public static final String API_V1_BASE = AppConstants.API_BASE_PATH;

    // Health Check
    public static final String HEALTH_ENDPOINT = "/health";

    // Interview Management
    public static final String INTERVIEWS_ENDPOINT = "/interviews";

    // Candidate Management
    public static final String CANDIDATES_ENDPOINT = "/candidates";

    // User Management
    public static final String USERS_ENDPOINT = "/users";

    // Authentication
    public static final String AUTH_ENDPOINT = "/auth";
    public static final String LOGIN_ENDPOINT = AUTH_ENDPOINT + "/login";
    public static final String REGISTER_ENDPOINT = AUTH_ENDPOINT + "/register";
    public static final String LOGOUT_ENDPOINT = AUTH_ENDPOINT + "/logout";

    // HTTP Headers
    public static final String AUTHORIZATION_HEADER = "Authorization";
    public static final String CONTENT_TYPE_HEADER = "Content-Type";
    public static final String ACCEPT_HEADER = "Accept";

    // Response Messages
    public static final String SUCCESS_MESSAGE = "Operation completed successfully";
    public static final String CREATED_MESSAGE = "Resource created successfully";
    public static final String UPDATED_MESSAGE = "Resource updated successfully";
    public static final String DELETED_MESSAGE = "Resource deleted successfully";
    public static final String HEALTH_OK_MESSAGE = "Service is up and running";
}

