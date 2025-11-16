# Repository Package - Agent Instructions

## Purpose
This package contains data access layer interfaces for MongoDB operations.

## Responsibilities
- Database CRUD operations
- Custom query methods
- Data persistence and retrieval
- Database-specific operations

## Naming Conventions
- Repositories should end with `Repository`
- Example: `InterviewRepository.java`, `CandidateRepository.java`

## Annotations to Use
- `@Repository` - Optional, Spring Data already handles it
- `@Query` - For custom MongoDB queries

## Design Guidelines
1. **Extend MongoRepository**: All repositories should extend MongoRepository
2. **Method Naming**: Use Spring Data naming conventions
3. **Custom Queries**: Use @Query for complex queries
4. **Return Types**: Use Optional for single results, List for multiple

## Spring Data Method Naming
Spring Data MongoDB automatically implements queries based on method names:
- `findBy*` - Find records
- `existsBy*` - Check existence
- `countBy*` - Count records
- `deleteBy*` - Delete records

Examples:
- `findByEmail(String email)`
- `findByStatusAndDate(String status, LocalDate date)`
- `existsByEmail(String email)`

## Best Practices
- Keep repositories simple and focused
- Use method naming conventions
- Only add custom queries when needed
- Return Optional for single results
- Don't put business logic in repositories
- Use pagination for large result sets

## Example Structure
```java
@Repository
public interface InterviewRepository extends MongoRepository<Interview, String> {
    
    // Spring Data auto-implemented methods
    Optional<Interview> findByInterviewCode(String code);
    
    List<Interview> findByStatus(String status);
    
    boolean existsByEmail(String email);
    
    // Custom query
    @Query("{ 'status': ?0, 'date': { $gte: ?1 } }")
    List<Interview> findUpcomingInterviews(String status, LocalDate date);
}
```

## MongoDB Specific
- Use String type for MongoDB IDs (_id field)
- Leverage MongoDB query capabilities
- Use indexes for frequently queried fields
- Consider using aggregation for complex queries

