# Technical Context - GluciQ
## Technology Stack & Implementation Details

### Core Technology Stack

#### Frontend Architecture
- **Framework**: React Native with Expo SDK 50+
- **Language**: TypeScript with strict mode enabled
- **State Management**: Legend State (observable-based, medical-grade reactivity)
- **Navigation**: Expo Router with file-based routing
- **UI Components**: Custom components with medical-grade accessibility
- **Styling**: React Native StyleSheet with theme system
- **Camera**: Expo Camera with optimized food photography settings
- **Image Processing**: Expo Image Manipulator for AI optimization

#### Backend Architecture
- **Database**: PostgreSQL via Supabase with Row Level Security
- **Authentication**: Clerk with healthcare-grade security compliance
- **API Layer**: Supabase REST API with real-time subscriptions
- **File Storage**: Supabase Storage for image management
- **Migration System**: Custom versioned migration management

#### AI & External Services
- **Primary Vision AI**: Google Gemini Vision API
- **Fallback Vision AI**: OpenAI Vision API
- **Nutrition Data**: USDA FoodData Central API
- **Barcode Recognition**: Open Food Facts API
- **Health Integration**: Apple Health, Google Fit APIs

### Database Architecture

#### Microservices Schema Structure
```sql
-- Global extensions and enums
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Service schemas
CREATE SCHEMA user_service;      -- User management and authentication
CREATE SCHEMA food_service;      -- Food database and nutrition
CREATE SCHEMA food_analysis;     -- AI processing and results
CREATE SCHEMA logging_service;   -- Meal and glucose tracking
CREATE SCHEMA formula_service;   -- Calculation engines
CREATE SCHEMA meal_planning;     -- Meal planning and recipes
```

#### Schema Design Patterns
- **40+ Tables**: Comprehensive data model across all services
- **15+ Enums**: Type safety for medical data (diabetes_type, meal_type, etc.)
- **UUID Primary Keys**: Distributed-friendly unique identifiers
- **Audit Fields**: created_at, updated_at with automatic triggers
- **Foreign Key Constraints**: Referential integrity across services
- **Strategic Indexing**: Performance optimization for common queries

#### Migration Management System
```javascript
// Professional migration system with version control
class MigrationSystem {
  constructor(connectionString) {
    this.db = new Database(connectionString);
    this.migrationsPath = './migrations/versions/';
  }

  // Semantic versioning: V2.1.0__description.sql
  async migrate() {
    await this.ensureMigrationTable();
    const pending = await this.getPendingMigrations();
    
    for (const migration of pending) {
      await this.executeMigration(migration);
    }
  }
}
```

### Development Environment

#### Project Structure
```
src/
├── app/                 # Expo Router pages
│   ├── (tabs)/         # Tab navigation screens
│   ├── camera/         # Camera-related screens
│   └── analysis/       # Food analysis results
├── components/         # Reusable UI components
│   ├── ui/            # Basic UI components
│   ├── auth/          # Authentication components
│   └── food/          # Food-specific components
├── lib/               # Core business logic
│   ├── ai/           # AI service integrations
│   ├── api/          # API clients and types
│   ├── database/     # Database utilities
│   ├── services/     # Business logic services
│   └── storage/      # File storage utilities
├── stores/           # Legend State stores
├── contexts/         # React contexts
├── hooks/           # Custom React hooks
└── types/           # TypeScript type definitions
```

#### Development Tools
- **Package Manager**: npm with package-lock.json
- **Linting**: ESLint with TypeScript rules
- **Type Checking**: TypeScript compiler with strict mode
- **Testing**: Jest with React Native Testing Library
- **Code Formatting**: Prettier with consistent rules
- **Version Control**: Git with semantic commit messages

### Authentication & Security

#### Clerk Integration
```typescript
// Healthcare-grade authentication setup
import { ClerkProvider } from '@clerk/clerk-expo';

const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <UnifiedAuthProvider>
        <App />
      </UnifiedAuthProvider>
    </ClerkProvider>
  );
}
```

#### Security Measures
- **End-to-End Encryption**: AES-256-GCM for medical data
- **Row Level Security**: Database-level access control
- **API Key Management**: Secure environment variable handling
- **HIPAA Compliance**: Healthcare data protection standards
- **Audit Logging**: Complete tracking of medical data access

### AI Service Integration

#### Food Recognition Pipeline
```typescript
class FoodRecognitionService {
  private services = [
    { name: 'gemini', service: GoogleGeminiVisionService },
    { name: 'openai', service: OpenAIVisionService }
  ];

  async recognizeFood(imageUri: string): Promise<FoodAnalysis> {
    // Fallback strategy with multiple AI providers
    for (const { name, service: Service } of this.services) {
      try {
        const result = await new Service().analyzeFood(imageUri);
        if (result.confidence > 0.7) return result;
      } catch (error) {
        continue; // Try next service
      }
    }
    throw new Error('All AI services failed');
  }
}
```

#### Image Processing Optimization
- **Resolution**: Optimized to 1024x1024 for AI processing
- **Compression**: 80% JPEG compression for API efficiency
- **Caching**: Intelligent caching of AI results by image hash
- **Offline Support**: Local food database for offline recognition

### State Management Architecture

#### Legend State Implementation
```typescript
// Medical-grade state management with safety observers
export const glucoseStore = observable({
  readings: [] as GlucoseReading[],
  currentReading: null as GlucoseReading | null,
  trends: { average24h: 0, timeInRange: 0 }
});

// Safety-critical validation
observe(() => {
  const current = glucoseStore.currentReading.get();
  if (current && (current.value < 40 || current.value > 400)) {
    triggerEmergencyAlert(current.value);
  }
});

// Real-time Supabase sync
export const mealStore = observable(syncedSupabase({
  table: 'logging_service.food_logs',
  select: 'id, user_id, meal_type, total_carbs, insulin_dose',
  realtime: true,
  persist: { name: 'meals', retrySync: true }
}));
```

#### Store Architecture
- **glucoseStore**: Glucose readings and trends
- **foodStore**: Food database and search results
- **insulinStore**: Insulin calculations and dosing
- **authStore**: Authentication state and user profile
- **themeStore**: UI theme and accessibility settings

### Performance Optimization

#### Caching Strategy
```typescript
class PerformanceOptimizer {
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  
  static async getCachedFoodData(foodId: string): Promise<Food | null> {
    const cached = await AsyncStorage.getItem(`food_${foodId}`);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > this.CACHE_DURATION) {
      await AsyncStorage.removeItem(`food_${foodId}`);
      return null;
    }
    
    return data;
  }
}
```

#### Database Performance
- **Indexes**: Strategic indexing for user queries and date ranges
- **Materialized Views**: Pre-computed daily summaries and trends
- **Connection Pooling**: Efficient database connection management
- **Query Optimization**: Optimized SQL queries with proper JOINs

### Build & Deployment

#### Build Configuration
```json
{
  "expo": {
    "name": "GluciQ",
    "slug": "gluciq",
    "version": "1.0.0",
    "platforms": ["ios", "android"],
    "ios": {
      "bundleIdentifier": "com.gluciq.app",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.gluciq.app",
      "versionCode": 1
    }
  }
}
```

#### Environment Configuration
- **Development**: Local Supabase instance with test data
- **Staging**: Supabase staging environment with production-like data
- **Production**: Production Supabase with full security and monitoring

### API Architecture

#### Service Registry Pattern
```typescript
class ServiceRegistry {
  private static services = new Map<string, any>();
  
  static register<T>(name: string, service: T): void {
    this.services.set(name, service);
  }
  
  static get<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) throw new Error(`Service ${name} not found`);
    return service;
  }
}

// Service registration
ServiceRegistry.register('foodService', new FoodService(supabase));
ServiceRegistry.register('analysisService', new FoodAnalysisService());
```

#### API Client Configuration
```typescript
class APIClient {
  constructor(
    private baseURL: string,
    private apiKey: string,
    private timeout: number = 30000
  ) {}

  async request<T>(endpoint: string, options: RequestOptions): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      timeout: this.timeout
    });

    if (!response.ok) {
      throw new APIError(response.status, await response.text());
    }

    return response.json();
  }
}
```

### Testing Strategy

#### Testing Framework
- **Unit Tests**: Jest with React Native Testing Library
- **Integration Tests**: Supertest for API endpoints
- **E2E Tests**: Detox for complete user workflows
- **Medical Safety Tests**: Comprehensive validation of insulin calculations

#### Test Categories
```typescript
// Medical calculation safety tests
describe('InsulinCalculator Safety', () => {
  it('should reject dangerous dose calculations', () => {
    const result = InsulinCalculator.calculateMealDose(1000, 5);
    expect(result.success).toBe(false);
    expect(result.error).toContain('safety limit');
  });
});

// AI service integration tests
describe('FoodRecognitionService', () => {
  it('should fallback to secondary AI service', async () => {
    mockGeminiService.mockRejectedValue(new Error('Service unavailable'));
    const result = await foodRecognitionService.recognizeFood(testImage);
    expect(result).toBeDefined();
    expect(mockOpenAIService).toHaveBeenCalled();
  });
});
```

### Monitoring & Analytics

#### Error Tracking
- **Crash Reporting**: Comprehensive error logging and reporting
- **Performance Monitoring**: App performance and API response times
- **Medical Safety Alerts**: Critical error notifications for medical calculations
- **User Analytics**: Privacy-compliant usage analytics

#### Health Metrics
- **API Response Times**: Monitoring AI service performance
- **Database Query Performance**: Tracking slow queries and optimization
- **User Engagement**: Meal logging frequency and feature usage
- **Medical Accuracy**: Tracking insulin calculation accuracy and safety

### Compliance & Regulations

#### Healthcare Compliance
- **HIPAA**: Health Insurance Portability and Accountability Act compliance
- **FDA Guidance**: Mobile medical app regulatory considerations
- **Data Privacy**: GDPR and CCPA compliance for international users
- **Medical Disclaimers**: Clear communication of app limitations

#### Quality Assurance
- **ISO 13485**: Quality management system for medical devices
- **Clinical Validation**: Evidence-based algorithm validation
- **Security Audits**: Regular security assessments and penetration testing
- **Code Reviews**: Comprehensive peer review process for medical code

### Future Technical Considerations

#### Scalability Planning
- **Microservices**: Ready for service separation when needed
- **Load Balancing**: Horizontal scaling for high user volumes
- **CDN Integration**: Global content delivery for AI processing
- **Caching Layers**: Redis for high-performance data caching

#### Technology Evolution
- **AI Model Updates**: Framework for updating AI models without app updates
- **Real-time Features**: WebSocket integration for real-time collaboration
- **Offline Capabilities**: Enhanced offline functionality with sync queues
- **Platform Expansion**: Web app and desktop versions using React Native Web

This technical foundation provides a robust, secure, and scalable platform for medical-grade diabetes management software, with comprehensive safety measures and performance optimization throughout the system. 