package interview.organiser.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

/**
 * AWS S3 Client Configuration
 */
@Configuration
@RequiredArgsConstructor
public class AwsS3Config {

    private final AwsS3ConfigProperties s3ConfigProperties;

    @Bean
    public S3Client s3Client() {
        AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(
                s3ConfigProperties.getAccessKey(),
                s3ConfigProperties.getSecretKey()
        );

        return S3Client.builder()
                .region(Region.of(s3ConfigProperties.getRegion()))
                .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                .build();
    }

    @Bean
    public S3Presigner s3Presigner() {
        AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(
                s3ConfigProperties.getAccessKey(),
                s3ConfigProperties.getSecretKey()
        );

        return S3Presigner.builder()
                .region(Region.of(s3ConfigProperties.getRegion()))
                .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                .build();
    }
}

