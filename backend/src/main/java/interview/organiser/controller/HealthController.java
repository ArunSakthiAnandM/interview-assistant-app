package interview.organiser.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Health check controller for monitoring application status
 */
@RestController
@RequestMapping("/health")
public class HealthController {

    /**
     * Basic health check endpoint
     * @return ResponseEntity with health status
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now());
        response.put("service", "Interview Organiser API");
        response.put("version", "1.0.0");

        return ResponseEntity.ok(response);
    }

    /**
     * Detailed health check with additional information
     * @return ResponseEntity with detailed health information
     */
    @GetMapping("/detailed")
    public ResponseEntity<Map<String, Object>> detailedHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now());
        response.put("service", "Interview Organiser API");
        response.put("version", "1.0.0");

        // System information
        Map<String, Object> systemInfo = new HashMap<>();
        systemInfo.put("javaVersion", System.getProperty("java.version"));
        systemInfo.put("osName", System.getProperty("os.name"));
        systemInfo.put("osVersion", System.getProperty("os.version"));

        // Memory information
        Runtime runtime = Runtime.getRuntime();
        Map<String, Object> memoryInfo = new HashMap<>();
        memoryInfo.put("totalMemory", runtime.totalMemory() / (1024 * 1024) + " MB");
        memoryInfo.put("freeMemory", runtime.freeMemory() / (1024 * 1024) + " MB");
        memoryInfo.put("maxMemory", runtime.maxMemory() / (1024 * 1024) + " MB");

        response.put("system", systemInfo);
        response.put("memory", memoryInfo);

        return ResponseEntity.ok(response);
    }

    /**
     * Ping endpoint for simple availability check
     * @return ResponseEntity with pong message
     */
    @GetMapping("/ping")
    public ResponseEntity<Map<String, String>> ping() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "pong");
        response.put("timestamp", LocalDateTime.now().toString());

        return ResponseEntity.ok(response);
    }

    /**
     * Ready endpoint to check if application is ready to serve requests
     * @return ResponseEntity with ready status
     */
    @GetMapping("/ready")
    public ResponseEntity<Map<String, Object>> ready() {
        Map<String, Object> response = new HashMap<>();
        response.put("ready", true);
        response.put("timestamp", LocalDateTime.now());

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    /**
     * Live endpoint to check if application is alive
     * @return ResponseEntity with live status
     */
    @GetMapping("/live")
    public ResponseEntity<Map<String, Object>> live() {
        Map<String, Object> response = new HashMap<>();
        response.put("alive", true);
        response.put("timestamp", LocalDateTime.now());

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
