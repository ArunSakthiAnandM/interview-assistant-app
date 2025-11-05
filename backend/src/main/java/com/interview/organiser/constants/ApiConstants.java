package com.interview.organiser.constants;

public class ApiConstants {

    // Auth endpoints
    public static final String AUTH_BASE = "/auth";
    public static final String AUTH_REGISTER = "/register";
    public static final String AUTH_LOGIN = "/login";
    public static final String AUTH_REFRESH = "/refresh";
    public static final String AUTH_LOGOUT = "/logout";

    // User endpoints
    public static final String USER_BASE = "/users";

    // Candidate endpoints
    public static final String CANDIDATE_BASE = "/candidates";

    // Interviewer endpoints
    public static final String INTERVIEWER_BASE = "/interviewers";

    // Interview endpoints
    public static final String INTERVIEW_BASE = "/interviews";
    public static final String INTERVIEW_STATUS = "/status";

    // Feedback endpoints
    public static final String FEEDBACK_BASE = "/feedback";

    // Health endpoint
    public static final String HEALTH = "/health";

    // Headers
    public static final String AUTHORIZATION_HEADER = "Authorization";
    public static final String BEARER_PREFIX = "Bearer ";

    private ApiConstants() {
        // Private constructor to prevent instantiation
    }
}

