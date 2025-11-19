package interview.organiser.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.data.mongodb.core.index.IndexOperations;

import java.time.Duration;

/**
 * MongoDB Configuration
 * Sets up indexes and database-specific configurations
 */
@Configuration
public class MongoConfig {

    /**
     * Initialize MongoDB indexes
     * Sets up TTL (Time To Live) index for notifications collection
     */
    @Bean
    public boolean initializeMongoIndexes(MongoTemplate mongoTemplate) {
        // Create TTL index for notifications collection
        // Notifications will be automatically deleted 30 days after creation
        IndexOperations indexOps = mongoTemplate.indexOps("notifications");
        Index ttlIndex = new Index()
                .on("createdAt", org.springframework.data.domain.Sort.Direction.ASC)
                .expire(Duration.ofDays(30));

        // Use createIndex instead of deprecated ensureIndex
        indexOps.createIndex(ttlIndex);

        return true;
    }
}

