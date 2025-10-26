# Entity Package - Agent Instructions

## Purpose
This package contains MongoDB document entities that represent database collections.

## Responsibilities
- Define database schema
- Map to MongoDB collections
- Define relationships between documents
- Index definitions

## Annotations to Use
- `@Document(collection = "collection_name")` - Define MongoDB collection
- `@Id` - MongoDB document ID
- `@Field` - Custom field name mapping
- `@Indexed` - Create indexes
- `@DBRef` - Reference to another document
- `@CreatedDate`, `@LastModifiedDate` - Audit fields

## Lombok Annotations
- `@Data` - Generates getters, setters, toString, equals, hashCode
- `@Builder` - Builder pattern
- `@NoArgsConstructor` - No-args constructor
- `@AllArgsConstructor` - All-args constructor

## Best Practices
1. **ID Field**: Always use String type for MongoDB ID
2. **Audit Fields**: Include createdAt, updatedAt timestamps
3. **Indexes**: Add indexes for frequently queried fields
4. **Validation**: Keep entity validation minimal
5. **Relationships**: Use @DBRef sparingly, prefer embedding
6. **Immutability**: Consider using @Value for immutable entities

## Example Structure
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "interviews")
public class Interview {
    
    @Id
    private String id;
    
    @Indexed(unique = true)
    @Field("interview_code")
    private String interviewCode;
    
    @Field("candidate_name")
    private String candidateName;
    
    private String position;
    
    private LocalDateTime scheduledDate;
    
    private String status;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

## MongoDB Best Practices
- Use meaningful collection names (plural, lowercase)
- Design for query patterns
- Embed related data when possible
- Use references for large or shared data
- Add indexes for performance
- Consider document size limits (16MB)

