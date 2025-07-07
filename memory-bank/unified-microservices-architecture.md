# Unified Microservices Architecture for GluciQ

**Document Version:** 1.0  
**Last Updated:** 2024  
**Status:** Architecture Design  

## Executive Summary

This document defines a unified microservices architecture for GluciQ that consolidates the current fragmented schema design into five clean, focused services. The architecture removes authentication complexity (RLS/Clerk) to focus on core data modeling, establishes clear service boundaries, and ensures TypeScript domain model alignment.

## Table of Contents

1. [Current Architecture Challenges](#current-architecture-challenges)
2. [Service Boundaries & Data Ownership](#service-boundaries--data-ownership)
3. [Schema Unification Strategy](#schema-unification-strategy)
4. [TypeScript Domain Model Alignment](#typescript-domain-model-alignment)
5. [Service Communication Patterns](#service-communication-patterns)
6. [Implementation Roadmap](#implementation-roadmap)
7. [Technical Specifications](#technical-specifications)

## Current Architecture Challenges

### Schema Fragmentation Issues
- **Monolithic Current Schema**: `gluciq` schema with heavy RLS/Clerk integration mixing concerns
- **Microservice Schemas**: Four separate schemas with overlapping data responsibilities
- **Type Misalignment**: TypeScript domain models don't match database schemas consistently
- **Authentication Complexity**: RLS policies and Clerk integration obscure core data architecture

### Data Ownership Conflicts
- User data split between `gluciq.user_profiles` and `user_service.user_profiles`
- Food analysis in both `gluciq.food_analysis_results` and implied in logging service
- Insulin calculations scattered across multiple schemas
- No clear service boundaries for data management

## Service Boundaries & Data Ownership

### 1. User Service
**Owns:** User identity, profiles, preferences, relationships, subscriptions

**Core Responsibilities:**
- User profile management (diabetes type, settings, preferences)
- Healthcare provider & caregiver relationships
- Subscription and plan management
- User preferences and settings
- Onboarding and engagement tracking

**Data Entities:** Users, diabetes settings, relationships, subscriptions, preferences

### 2. Food Service  
**Owns:** Food database, nutrition data, AI analysis results

**Core Responsibilities:**
- Food database management (nutrition facts, glycemic data)
- AI-powered food analysis (vision, barcode scanning)
- Food categorization and search
- User favorite foods management
- Portion and serving calculations

**Data Entities:** Foods, nutrition data, analysis results, favorites, portions

### 3. Logging Service
**Owns:** Time-series data for food, glucose, insulin, activities

**Core Responsibilities:**
- Food intake logging and meal tracking
- Glucose reading storage and trends
- Insulin dose recording and IOB calculations
- Activity and exercise logging
- Daily summaries and analytics

**Data Entities:** Food logs, glucose readings, insulin doses, activities, daily summaries

### 4. Calculation Service
**Owns:** Mathematical formulas and AI-driven scoring

**Core Responsibilities:**
- GlucoBalance™ score calculations
- Insulin dosing calculations with personalization
- Formula parameter management and learning
- Performance tracking and optimization
- Mathematical model versioning

**Data Entities:** Formulas, parameters, calculations, scores, performance metrics

### 5. Planning Service
**Owns:** Meal planning, recipes, recommendations

**Core Responsibilities:**
- Meal plan creation and management
- Recipe database and collections
- Shopping list generation
- Personalized meal recommendations
- Cultural and dietary preference matching

**Data Entities:** Meal plans, recipes, ingredients, shopping lists, recommendations

## Schema Unification Strategy

### Phase 1: Clean Schema Foundation

#### Remove Authentication Complexity
```sql
-- Remove RLS policies and Clerk-specific functions
-- Focus on pure data modeling without authentication layers
-- Use simple UUID references for cross-service communication
```

#### Establish Service Schemas
```sql
-- Each service owns its schema namespace
CREATE SCHEMA user_service;
CREATE SCHEMA food_service; 
CREATE SCHEMA logging_service;
CREATE SCHEMA calculation_service;
CREATE SCHEMA planning_service;
```

#### Cross-Service References
```sql
-- Use UUID references without foreign key constraints
-- Services communicate via APIs, not direct database links
user_id UUID NOT NULL  -- References user_service.users.id
food_id UUID NOT NULL  -- References food_service.foods.id
```

### Phase 2: Data Model Alignment

#### TypeScript-First Design
Ensure database schemas match TypeScript domain models exactly:

**Food Service Schema ↔ Food.ts Domain Model**
```typescript
// Domain Model
interface NutritionValues {
  calories: number;
  carbohydrates: number;
  fat: number;
  protein: number;
  fiber: number;
  sugar: number;
  sodium?: number;
}

// Database Schema
CREATE TABLE food_service.nutrition_facts (
  food_id UUID PRIMARY KEY,
  calories INTEGER NOT NULL,
  carbohydrates DECIMAL(8,2) NOT NULL,
  fat DECIMAL(8,2) NOT NULL,
  protein DECIMAL(8,2) NOT NULL,
  fiber DECIMAL(8,2) NOT NULL,
  sugar DECIMAL(8,2) NOT NULL,
  sodium DECIMAL(8,2)
);
```

**Calculation Service ↔ InsulinCalculation.ts**
```typescript
// Domain Model
interface InsulinSettings {
  carbRatios: Array<{
    timeStart: string;
    timeEnd: string; 
    ratio: number;
  }>;
  // ... other settings
}

// Database Schema  
CREATE TABLE calculation_service.user_carb_ratios (
  user_id UUID NOT NULL,
  time_start TIME NOT NULL,
  time_end TIME NOT NULL,
  ratio DECIMAL(5,2) NOT NULL
);
```

### Phase 3: Service Integration

#### Event-Driven Communication
```typescript
// Cross-service events
interface FoodAnalyzedEvent {
  eventType: 'food.analyzed';
  userId: string;
  foodId: string;
  analysisResult: AnalysisResult;
  timestamp: Date;
}

interface MealLoggedEvent {
  eventType: 'meal.logged';
  userId: string;
  mealId: string;
  foods: Array<{foodId: string, portion: Portion}>;
  timestamp: Date;
}
```

## TypeScript Domain Model Alignment

### Enhanced Food Types

```typescript
// Aligned with unified food_service schema
export interface Food {
  id: string;
  name: string;
  category: FoodCategory;
  nutrition: NutritionFacts;
  glycemic: GlycemicInfo;
  metadata: FoodMetadata;
}

export interface FoodAnalysisResult {
  id: string;
  userId: string;
  foodId: string;
  analysisSource: 'vision' | 'barcode' | 'hybrid';
  confidenceScore: number;
  nutrition: NutritionFacts;
  verificationStatus: 'pending' | 'verified' | 'rejected';
}
```

### Service Communication DTOs

```typescript
// Cross-service data transfer objects
export interface UserProfileSummaryDTO {
  userId: string;
  diabetesType: 'type1' | 'type2' | 'metabolic';
  preferences: UserPreferences;
  currentSettings: UserSettings;
}

export interface FoodLogEntryDTO {
  userId: string;
  foodId: string;
  portion: Portion;
  mealType: MealType;
  timestamp: Date;
  nutrition: NutritionFacts;
}

export interface InsulinCalculationRequestDTO {
  userId: string;
  currentGlucose?: number;
  carbohydrates: number;
  mealContext: MealContext;
  userSettings: InsulinSettings;
}
```

### Cross-Service Event Interfaces

```typescript
export interface ServiceEvent {
  eventId: string;
  eventType: string;
  userId: string;
  timestamp: Date;
  data: any;
}

export interface FoodServiceEvents {
  'food.analyzed': FoodAnalyzedEvent;
  'food.favorited': FoodFavoritedEvent;
  'nutrition.updated': NutritionUpdatedEvent;
}

export interface LoggingServiceEvents {
  'meal.logged': MealLoggedEvent;
  'glucose.recorded': GlucoseRecordedEvent;
  'insulin.dosed': InsulinDosedEvent;
}
```

## Service Communication Patterns

### 1. Synchronous API Communication
```typescript
// Service-to-service API calls for immediate data needs
class FoodService {
  async getFoodNutrition(foodId: string): Promise<NutritionFacts> {
    // Direct API call to food service
  }
}

class CalculationService {
  async calculateInsulinDose(request: InsulinCalculationRequestDTO): Promise<InsulinCalculationResult> {
    // Uses user settings from user service
    // Uses food nutrition from food service
    // Returns calculation with explanation
  }
}
```

### 2. Asynchronous Event Processing
```typescript
// Event-driven updates for non-critical data synchronization
class LoggingService {
  async logMeal(mealData: MealLogEntryDTO): Promise<void> {
    // Store meal log
    // Emit event for calculation service to compute scores
    // Emit event for planning service to update recommendations
  }
}

class CalculationService {
  @EventHandler('meal.logged')
  async calculateMealScore(event: MealLoggedEvent): Promise<void> {
    // Calculate GlucoBalance score for logged meal
    // Store calculation results
    // Emit score calculated event
  }
}
```

### 3. Data Consistency Patterns

#### Eventually Consistent Reads
```typescript
// Services maintain local copies of frequently accessed data
class LoggingService {
  private userProfileCache = new Map<string, UserProfileSummaryDTO>();
  
  async logFood(userId: string, foodData: FoodLogEntryDTO): Promise<void> {
    // Use cached user profile for immediate processing
    // Periodically sync with user service for updates
  }
}
```

#### Saga Pattern for Complex Operations
```typescript
// Multi-service operations with compensation
class MealPlanningOrchestrator {
  async createPersonalizedMealPlan(userId: string, preferences: MealPlanPreferences): Promise<MealPlan> {
    // 1. Get user profile and settings
    // 2. Get food preferences and restrictions  
    // 3. Generate meal recommendations
    // 4. Calculate nutrition totals
    // 5. Create meal plan
    // Handle rollback if any step fails
  }
}
```

## Implementation Roadmap

### Phase 1: Schema Cleanup (Week 1-2)

#### Week 1: Current Schema Analysis & Migration Planning
- [ ] Audit all existing data in `gluciq` schema
- [ ] Map data migration paths to new service schemas  
- [ ] Create unified schema files for each service
- [ ] Design cross-service reference patterns

#### Week 2: Schema Implementation
- [ ] Create clean service schemas without RLS/Clerk
- [ ] Implement data migration scripts
- [ ] Establish service communication patterns
- [ ] Update TypeScript types to match schemas

### Phase 2: Service Implementation (Week 3-6)

#### Week 3: Core Services Foundation  
- [ ] Implement User Service with basic CRUD operations
- [ ] Implement Food Service with nutrition management
- [ ] Create service communication infrastructure
- [ ] Establish testing patterns

#### Week 4: Advanced Food Service Features
- [ ] Integrate AI analysis pipeline (Gemini Vision + OpenFoodFacts)
- [ ] Implement food search and categorization
- [ ] Add favorite foods management
- [ ] Create portion calculation engine

#### Week 5: Logging Service Implementation
- [ ] Implement time-series data storage
- [ ] Create meal and food logging APIs
- [ ] Add glucose and insulin tracking
- [ ] Implement daily summary generation

#### Week 6: Calculation Service Development
- [ ] Implement GlucoBalance scoring engine
- [ ] Create insulin calculation algorithms
- [ ] Add formula personalization
- [ ] Implement calculation caching

### Phase 3: Integration & Testing (Week 7-8)

#### Week 7: Service Integration
- [ ] Connect all services with event-driven communication
- [ ] Implement cross-service data flows
- [ ] Add comprehensive error handling
- [ ] Create health check and monitoring

#### Week 8: Testing & Optimization
- [ ] End-to-end testing of all user journeys
- [ ] Performance testing and optimization
- [ ] Data consistency validation
- [ ] Security and compliance review

### Phase 4: Web App & Advanced Features (Week 9-12)

#### Week 9-10: NextJS Web Application
- [ ] Create web app using same unified services
- [ ] Implement provider dashboard features
- [ ] Add advanced analytics and reporting
- [ ] Create admin interfaces

#### Week 11-12: Advanced AI Features
- [ ] Implement personalized meal recommendations
- [ ] Add predictive glucose modeling
- [ ] Create advanced insulin optimization
- [ ] Launch beta testing program

## Technical Specifications

### Service APIs

#### User Service API
```typescript
interface UserServiceAPI {
  // Core user management
  GET    /users/{id}
  PUT    /users/{id}/profile
  GET    /users/{id}/settings
  PUT    /users/{id}/settings
  
  // Relationships
  GET    /users/{id}/providers
  POST   /users/{id}/providers/{providerId}/invite
  GET    /users/{id}/caregivers
  
  // Subscriptions
  GET    /users/{id}/subscription
  POST   /users/{id}/subscription/activate
}
```

#### Food Service API  
```typescript
interface FoodServiceAPI {
  // Food database
  GET    /foods/search?query={query}
  GET    /foods/{id}
  POST   /foods/{id}/analyze-image
  POST   /foods/barcode/{barcode}
  
  // User favorites
  GET    /users/{userId}/favorite-foods
  POST   /users/{userId}/favorite-foods/{foodId}
  DELETE /users/{userId}/favorite-foods/{foodId}
  
  // Nutrition calculations
  POST   /foods/{id}/calculate-nutrition
}
```

#### Logging Service API
```typescript
interface LoggingServiceAPI {
  // Food logging
  GET    /users/{userId}/food-logs
  POST   /users/{userId}/food-logs
  GET    /users/{userId}/meals
  POST   /users/{userId}/meals
  
  // Health metrics
  GET    /users/{userId}/glucose-readings
  POST   /users/{userId}/glucose-readings
  GET    /users/{userId}/insulin-doses
  POST   /users/{userId}/insulin-doses
  
  // Analytics
  GET    /users/{userId}/daily-summaries
  GET    /users/{userId}/trends
}
```

### Data Consistency Strategy

#### Read Patterns
```typescript
// Eventual consistency for non-critical reads
class ServiceDataCache {
  async getUserProfile(userId: string): Promise<UserProfile> {
    // Try cache first, fall back to user service
    // Refresh cache asynchronously if stale
  }
  
  async getFoodNutrition(foodId: string): Promise<NutritionFacts> {
    // Cache nutrition data locally with TTL
    // Food nutrition rarely changes
  }
}
```

#### Write Patterns  
```typescript
// Strong consistency for critical writes
class TransactionalWriter {
  async logMealWithCalculation(mealData: MealData): Promise<void> {
    // 1. Log meal in logging service
    // 2. Calculate scores in calculation service  
    // 3. Update user statistics
    // 4. Emit events for recommendations
    // All steps must succeed or rollback
  }
}
```

### Performance & Scalability

#### Caching Strategy
- **User Profiles**: Cache in all services with 15-minute TTL
- **Food Nutrition**: Cache locally with 24-hour TTL
- **Calculation Results**: Cache with user-specific invalidation
- **Meal Recommendations**: Cache with preference-based keys

#### Database Optimization
- **Time-series Partitioning**: Partition logging tables by date
- **Indexing Strategy**: Optimize for user_id + timestamp queries
- **Connection Pooling**: Shared pools per service with circuit breakers
- **Read Replicas**: Separate read/write for analytics queries

### Security & Compliance

#### Data Protection
- **Service-Level Auth**: JWT tokens for service-to-service communication
- **Data Encryption**: Encrypt PII at rest and in transit
- **Audit Logging**: Track all data access and modifications
- **Data Retention**: Automated cleanup of old time-series data

#### HIPAA Compliance
- **Data Classification**: Mark all health data appropriately
- **Access Controls**: Role-based access at service level  
- **Audit Trails**: Comprehensive logging of all health data access
- **Business Associate Agreements**: Proper vendor management

### Monitoring & Observability

#### Service Health
```typescript
interface ServiceHealth {
  serviceName: string;
  version: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  dependencies: Array<{
    name: string;
    status: string;
    latency: number;
  }>;
  metrics: {
    requestsPerSecond: number;
    averageLatency: number;
    errorRate: number;
  };
}
```

#### Business Metrics
- **User Engagement**: Logging frequency, feature usage
- **AI Accuracy**: Food recognition success rates
- **Calculation Performance**: Insulin dosing accuracy vs outcomes
- **Service Performance**: Latency, throughput, error rates

## Benefits of Unified Architecture

### 1. Clean Separation of Concerns
- Each service has clear data ownership and responsibilities
- No overlapping business logic between services
- Easy to reason about data flows and dependencies

### 2. Scalability & Performance  
- Services can be scaled independently based on usage patterns
- Optimized data models for each domain's specific needs
- Efficient caching and data access patterns

### 3. Developer Experience
- TypeScript domain models align perfectly with database schemas
- Clear API contracts between services
- Consistent patterns across all services

### 4. Maintainability
- No complex RLS policies or authentication mixing concerns
- Simple UUID-based references between services
- Event-driven architecture enables easy feature additions

### 5. Platform Flexibility
- Same services can support mobile app, web app, and API clients
- Easy to add new client applications
- Microservices can be deployed independently

### 6. Future-Proof Design
- Easy to add new services (e.g., AI/ML service, notification service)
- Can migrate individual services to different technologies
- Supports advanced features like real-time collaboration

## Next Steps

1. **Review and Approve Architecture**: Stakeholder review of this unified design
2. **Create Detailed Schemas**: Generate complete SQL files for each service
3. **Build Service Prototypes**: Implement core APIs for each service
4. **Data Migration Planning**: Design migration from current to unified schema
5. **Implementation Execution**: Follow the 12-week roadmap outlined above

This unified architecture provides a solid foundation for GluciQ's growth while maintaining clean separation of concerns and optimal performance characteristics. 