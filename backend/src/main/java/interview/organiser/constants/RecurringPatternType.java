package interview.organiser.constants;

/**
 * Enum representing recurring pattern types for availability
 */
public enum RecurringPatternType {
    NONE,           // One-time slot
    DAILY,          // Repeat every day
    WEEKLY,         // Repeat every week (same day of week)
    MONTHLY,        // Repeat every month (same day of month)
    CUSTOM          // Custom pattern (stored as cron expression)
}

