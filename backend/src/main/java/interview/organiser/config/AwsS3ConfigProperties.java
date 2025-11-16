package interview.organiser.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * AWS S3 Configuration Properties
 */
@Configuration
@ConfigurationProperties(prefix = "aws.s3")
@Getter
@Setter
public class AwsS3ConfigProperties {

    private String accessKey;
    private String secretKey;
    private String region;
    private String bucketName;
    private Long presignedUrlExpiration = 3600L; // Default 1 hour in seconds
}

