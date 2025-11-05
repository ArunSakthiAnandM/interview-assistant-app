package com.interview.organiser;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class OrganiserApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrganiserApplication.class, args);
    }

}
