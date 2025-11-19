package interview.organiser.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.data.mongodb.core.index.IndexInfo;
import org.springframework.data.mongodb.core.index.IndexOperations;

import java.time.Duration;
import java.util.List;

/**
 * MongoDB Configuration
 * Sets up indexes and database-specific configurations
 */
@Slf4j
@Configuration
public class MongoConfig {

    private final MongoTemplate mongoTemplate;

    public MongoConfig(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    /**
     * Initialize MongoDB indexes after application is ready
     * Sets up TTL (Time To Live) index for notifications collection
     * This method is called after the application context is fully initialized
     */
    @EventListener(ApplicationReadyEvent.class)
    public void initializeMongoIndexes() {
        try {
            log.info("Initializing MongoDB indexes...");

            // Create TTL index for notifications collection
            // Notifications will be automatically deleted 30 days after creation
            IndexOperations indexOps = mongoTemplate.indexOps("notifications");

            // Check if TTL index already exists
            List<IndexInfo> existingIndexes = indexOps.getIndexInfo();
            existingIndexes.forEach(indexInfo -> log.info(indexInfo.toString()));
            boolean ttlIndexExists = existingIndexes.stream()
                    .anyMatch(index ->
                        index.getIndexFields().stream()
                            .anyMatch(field -> "createdAt".equals(field.getKey()))
                                && index.getExpireAfter().isPresent()
                    );

            if (!ttlIndexExists) {
                // Drop the simple index if it exists (without TTL)
                existingIndexes.stream()
                    .filter(index ->
                        "createdAt".equals(index.getName()) ||
                        index.getIndexFields().stream()
                            .anyMatch(field -> "createdAt".equals(field.getKey()))
                    )
                    .filter(index -> index.getExpireAfter() == null) // Only drop non-TTL indexes
                    .forEach(index -> {
                        try {
                            log.info("Dropping existing non-TTL index: {}", index.getName());
                            indexOps.dropIndex(index.getName());
                        } catch (Exception e) {
                            log.warn("Could not drop index {}: {}", index.getName(), e.getMessage());
                        }
                    });

                // Create new TTL index
                Index ttlIndex = new Index()
                        .on("createdAt", org.springframework.data.domain.Sort.Direction.ASC)
                        .expire(Duration.ofDays(30))
                        .named("createdAt_ttl");

                indexOps.createIndex(ttlIndex);
                log.info("Successfully created TTL index on notifications.createdAt");
            } else {
                log.info("TTL index on notifications.createdAt already exists, skipping creation");
            }

        } catch (Exception e) {
            log.error("Error initializing MongoDB indexes: {}", e.getMessage(), e);
            // Don't fail application startup due to index issues
        }
    }
}

