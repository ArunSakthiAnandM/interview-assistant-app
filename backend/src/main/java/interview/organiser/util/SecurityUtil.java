package interview.organiser.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Security utility class for getting current user information
 */
@Component
public class SecurityUtil {

    /**
     * Get current authenticated user ID
     */
    public static String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof String) {
            return (String) authentication.getPrincipal();
        }
        return null;
    }

    /**
     * Get current authenticated user's role
     */
    public static String getCurrentUserRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getAuthorities() != null && !authentication.getAuthorities().isEmpty()) {
            return authentication.getAuthorities().iterator().next().getAuthority();
        }
        return null;
    }

    /**
     * Check if user is authenticated
     */
    public static boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated();
    }

    /**
     * Check if current user has a specific role
     */
    public static boolean hasRole(String role) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getAuthorities() != null) {
            String roleToCheck = role.startsWith("ROLE_") ? role : "ROLE_" + role;
            return authentication.getAuthorities().stream()
                    .anyMatch(authority -> authority.getAuthority().equals(roleToCheck));
        }
        return false;
    }
}
