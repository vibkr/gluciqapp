# System Patterns - GluciQ
## Architecture & Implementation Standards

### Microservices Architecture Overview

#### Service Architecture Diagram
```
┌─────────────────────────────────────────────────────────────────┐
│                    GluciQ Unified Platform                     │
├─────────────────────────────────────────────────────────────────┤
│  React Native App (iOS/Android)                                │
│  ├── Legend State (Global State Management)                    │
│  ├── Clerk Authentication (Healthcare-Grade Security)          │
│  ├── Expo Router (File-based Navigation)                       │
│  └── Offline-First Architecture with Local Storage             │
├─────────────────────────────────────────────────────────────────┤
│  Supabase Backend (PostgreSQL + Row Level Security)            │
│  ├── User Service Schema (user_service)                        │
│  ├── Food Service Schema (food_service)                        │
│  ├── Food Analysis Schema (food_analysis)                      │
│  ├── Logging Service Schema (logging_service)                  │
│  ├── Formula Service Schema (formula_service)                  │
│  └── Meal Planning Schema (meal_planning)                      │
├─────────────────────────────────────────────────────────────────┤
│  External AI Services                                          │
│  ├── Google Gemini Vision (Primary)                           │
│  ├── OpenAI Vision (Fallback)                                 │
│  ├── USDA FoodData Central (Nutrition Database)               │
│  └── Open Food Facts (Barcode Recognition)                    │
└─────────────────────────────────────────────────────────────────┘
```

#### Microservice Schema Responsibilities

**User Service** (`user_service` schema)
- **Core Tables**: users, type1_settings, type2_settings, metabolic_settings
- **Relationships**: healthcare_providers, provider_relationships, caregiver_relationships
- **Subscriptions**: user_subscriptions, subscription_tiers, billing_history
- **Engagement**: user_preferences, notification_settings, user_engagement_metrics
- **Total Tables**: 12 tables with comprehensive user management

**Food Service** (`food_service` schema)
- **Core Tables**: foods, nutrition_facts, glycemic_info, food_categories
- **User Data**: user_favorite_foods, user_custom_foods, user_food_preferences
- **Scoring**: food_scores, cultural_food_associations, dietary_restrictions
- **Total Tables**: 9 tables with comprehensive food database

**Food Analysis Service** (`food_analysis` schema)
- **AI Processing**: food_images, food_analysis_results, analyzed_foods
- **Barcode**: barcode_scans, package_foods, ingredient_lists
- **Total Tables**: 6 tables for AI-powered food recognition

**Logging Service** (`logging_service` schema)
- **Core Logging**: food_logs, food_log_entries, glucose_readings, insulin_doses
- **Context**: contextual_factors, daily_summaries, glucose_patterns
- **Gamification**: achievement_definitions, user_achievements, streak_tracking
- **Sync**: offline_sync_queue, sync_conflicts, data_integrity_checks
- **Total Tables**: 12 tables with comprehensive tracking

**Formula Service** (`formula_service` schema)
- **Formulas**: formulas, user_formula_parameters, formula_templates
- **Calculations**: insulin_calculations, batch_calculations, calculation_history
- **Knowledge**: formula_knowledge_base, calculation_audit_logs
- **Total Tables**: 8 tables for medical calculations

**Meal Planning Service** (`meal_planning` schema)
- **Planning**: meal_plans, planned_meals, planned_meal_foods
- **Recipes**: recipes, recipe_ingredients, recipe_instructions, recipe_ratings
- **Shopping**: shopping_lists, shopping_list_items, pantry_items
- **Recommendations**: meal_recommendations, recommendation_feedback
- **Total Tables**: 11 tables for comprehensive meal planning

### Database Design Patterns

#### Global Schema Structure
```sql
-- PostgreSQL Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Global Enums (15+ types for type safety)
CREATE TYPE food_category_enum AS ENUM (
    'grains', 'vegetables', 'fruits', 'proteins', 'dairy',
    'packaged_food', 'beverages', 'sweets', 'snacks', 'mixed_meal', 'unknown'
);

CREATE TYPE diabetes_type_enum AS ENUM (
    'type1', 'type2', 'metabolic', 'gestational', 'other'
);

CREATE TYPE user_role_enum AS ENUM (
    'patient', 'healthcare_provider', 'caregiver', 'admin', 'support', 'researcher'
);

-- Service-specific schemas with proper isolation
CREATE SCHEMA user_service;
CREATE SCHEMA food_service;
CREATE SCHEMA food_analysis;
CREATE SCHEMA logging_service;
CREATE SCHEMA formula_service;
CREATE SCHEMA meal_planning;
```

#### Standard Table Design Pattern
```sql
-- Standard table structure with audit fields
CREATE TABLE schema_name.table_name (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    -- Business columns
    user_id UUID REFERENCES user_service.users(id) ON DELETE CASCADE,
    -- Additional fields with proper constraints
    
    -- Constraints and validation
    CONSTRAINT valid_data CHECK (condition),
    CONSTRAINT unique_constraint UNIQUE (field1, field2)
);

-- Indexes for performance
CREATE INDEX idx_table_user_id ON schema_name.table_name(user_id);
CREATE INDEX idx_table_created_at ON schema_name.table_name(created_at);
CREATE INDEX idx_table_lookup ON schema_name.table_name(lookup_field) WHERE active = true;

-- Automatic timestamp updates
CREATE TRIGGER update_table_updated_at
    BEFORE UPDATE ON schema_name.table_name
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### Cross-Service Relationship Pattern
```sql
-- Example: Food logs referencing food analysis
CREATE TABLE logging_service.food_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_service.users(id),
    analysis_id UUID REFERENCES food_analysis.food_analysis_results(id),
    meal_type meal_type_enum NOT NULL,
    total_carbs DECIMAL(8,2) NOT NULL CHECK (total_carbs >= 0),
    confidence_score DECIMAL(3,2) CHECK (confidence_score BETWEEN 0 AND 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Migration System Architecture

#### Professional Migration Management
```javascript
// Migration system with semantic versioning
class MigrationSystem {
    constructor(connectionString) {
        this.db = new Database(connectionString);
        this.migrationsPath = './migrations/versions/';
        this.migrationTable = 'schema_migrations';
    }

    // Semantic versioning: V2.1.0__description.sql
    async migrate() {
        await this.ensureMigrationTable();
        const pending = await this.getPendingMigrations();
        
        console.log(`Found ${pending.length} pending migrations`);
        
        for (const migration of pending) {
            await this.executeMigration(migration);
        }
    }

    async executeMigration(migration) {
        const transaction = await this.db.beginTransaction();
        try {
            console.log(`Executing migration: ${migration.filename}`);
            await this.runMigrationSQL(migration.sql);
            await this.recordMigration(migration);
            await transaction.commit();
            console.log(`✅ Migration ${migration.filename} completed`);
        } catch (error) {
            await transaction.rollback();
            console.error(`❌ Migration ${migration.filename} failed:`, error);
            throw error;
        }
    }

    async getPendingMigrations() {
        const files = await fs.readdir(this.migrationsPath);
        const appliedMigrations = await this.getAppliedMigrations();
        
        return files
            .filter(file => file.endsWith('.sql'))
            .filter(file => !appliedMigrations.includes(file))
            .sort()
            .map(file => ({
                filename: file,
                sql: fs.readFileSync(path.join(this.migrationsPath, file), 'utf8')
            }));
    }
}
```

#### Current Migration Versions
```
V2.0.0__global_enums_and_extensions.sql    # Global types and extensions
V2.1.0__user_service_schema.sql           # User management
V2.2.0__food_service_schema.sql           # Food database
V2.3.0__food_analysis_schema.sql          # AI analysis
V2.4.0__logging_service_schema.sql        # Tracking and logging
V2.5.0__formula_service_schema.sql        # Medical calculations
V2.6.0__meal_planning_schema.sql          # Meal planning
```

### Frontend Architecture Patterns

#### TypeScript Safety with Medical Data
```typescript
// Strict medical data types with validation
interface GlucoseReading {
  readonly id: string;
  readonly value: number; // mg/dL, validated range 20-600
  readonly timestamp: Date;
  readonly mealContext?: 'before' | 'after' | 'fasting';
  readonly confidence?: number; // 0-1 for AI predictions
  readonly notes?: string;
}

interface InsulinDose {
  readonly id: string;
  readonly units: number; // Validated range 0.5-50
  readonly type: 'bolus' | 'correction' | 'basal';
  readonly calculatedBy: 'user' | 'ai' | 'formula';
  readonly rationale: string; // Required for medical audit
  readonly timestamp: Date;
  readonly foodLogId?: string;
}

// Result pattern for safe medical calculations
type Result<T, E> = { success: true; data: T } | { success: false; error: E };

class InsulinCalculator {
  private static readonly MAX_SAFE_DOSE = 50; // units
  private static readonly MIN_DOSE = 0.5; // units
  
  static calculateMealDose(
    carbs: number, 
    ratio: number, 
    currentGlucose?: number,
    targetGlucose?: number,
    correctionFactor?: number
  ): Result<InsulinCalculation, string> {
    // Input validation
    if (carbs <= 0 || ratio <= 0) {
      return { success: false, error: 'Invalid carb or ratio values' };
    }
    
    // Meal bolus calculation
    const mealDose = carbs / ratio;
    
    // Correction dose if glucose provided
    let correctionDose = 0;
    if (currentGlucose && targetGlucose && correctionFactor) {
      if (currentGlucose > targetGlucose) {
        correctionDose = (currentGlucose - targetGlucose) / correctionFactor;
      }
    }
    
    const totalDose = mealDose + correctionDose;
    
    // Safety validation
    if (totalDose > this.MAX_SAFE_DOSE) {
      return { 
        success: false, 
        error: `Calculated dose (${totalDose.toFixed(1)} units) exceeds safety limit` 
      };
    }
    
    if (totalDose < this.MIN_DOSE) {
      return { 
        success: false, 
        error: `Calculated dose (${totalDose.toFixed(1)} units) below minimum` 
      };
    }
    
    return { 
      success: true, 
      data: {
        mealDose: Math.round(mealDose * 2) / 2, // Round to 0.5 units
        correctionDose: Math.round(correctionDose * 2) / 2,
        totalDose: Math.round(totalDose * 2) / 2,
        rationale: `${carbs}g carbs ÷ ${ratio} ratio = ${mealDose.toFixed(1)} units${correctionDose > 0 ? ` + ${correctionDose.toFixed(1)} correction` : ''}`,
        timestamp: new Date()
      }
    };
  }
}
```

#### State Management with Legend State
```typescript
// Medical-grade state management with safety observers
export const glucoseStore = observable({
  readings: [] as GlucoseReading[],
  currentReading: null as GlucoseReading | null,
  trends: { 
    average24h: 0, 
    timeInRange: 0,
    lastUpdated: null as Date | null
  },
  
  // Computed values
  get isInDangerZone() {
    const current = this.currentReading.get();
    return current && (current.value < 70 || current.value > 250);
  },
  
  get recentTrend() {
    const readings = this.readings.get();
    if (readings.length < 2) return 'stable';
    
    const recent = readings.slice(-2);
    const diff = recent[1].value - recent[0].value;
    
    if (diff > 30) return 'rising';
    if (diff < -30) return 'falling';
    return 'stable';
  }
});

// Safety-critical validation observer
observe(() => {
  const current = glucoseStore.currentReading.get();
  if (current && (current.value < 40 || current.value > 400)) {
    // Trigger emergency alert
    triggerEmergencyAlert({
      type: current.value < 40 ? 'severe_hypoglycemia' : 'severe_hyperglycemia',
      value: current.value,
      timestamp: current.timestamp
    });
  }
});

// Real-time Supabase sync with conflict resolution
export const mealStore = observable(syncedSupabase({
  supabase: supabaseClient,
  table: 'logging_service.food_logs',
  select: `
    id, user_id, meal_type, total_carbs, insulin_dose, confidence_score,
    created_at, updated_at,
    food_log_entries (
      id, food_id, quantity, unit,
      foods:food_id (name, category)
    )
  `,
  filter: (query) => query.eq('user_id', getCurrentUserId()),
  realtime: true,
  persist: { 
    name: 'meals', 
    retrySync: true,
    conflictResolution: 'last-write-wins'
  }
}));
```

### AI Service Integration Patterns

#### Food Recognition Pipeline with Fallback
```typescript
interface FoodRecognitionService {
  analyzeFood(imageUri: string): Promise<FoodAnalysisResult>;
}

class FoodRecognitionPipeline {
  private services: Array<{
    name: string;
    service: FoodRecognitionService;
    costPerRequest: number;
  }> = [
    { 
      name: 'gemini', 
      service: new GoogleGeminiVisionService(),
      costPerRequest: 0.002
    },
    { 
      name: 'openai', 
      service: new OpenAIVisionService(),
      costPerRequest: 0.01
    }
  ];

  async recognizeFood(imageUri: string): Promise<FoodAnalysisResult> {
    // Optimize image for AI processing
    const optimizedImage = await this.optimizeImage(imageUri);
    
    // Try each service in order of preference
    for (const { name, service } of this.services) {
      try {
        console.log(`Attempting food recognition with ${name}`);
        const result = await service.analyzeFood(optimizedImage);
        
        // Validate confidence threshold
        if (result.confidence > 0.7) {
          await this.logSuccessfulRecognition(name, result);
          return result;
        }
        
        console.log(`${name} confidence too low: ${result.confidence}`);
      } catch (error) {
        console.error(`${name} recognition failed:`, error);
        await this.logFailedRecognition(name, error);
        continue; // Try next service
      }
    }
    
    throw new Error('All AI services failed or returned low confidence');
  }

  private async optimizeImage(imageUri: string): Promise<string> {
    // Resize to 1024x1024 for optimal AI processing
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 1024, height: 1024 } }],
      { 
        compress: 0.8, 
        format: ImageManipulator.SaveFormat.JPEG 
      }
    );
    
    return manipulatedImage.uri;
  }
}
```

#### Caching Strategy for Cost Optimization
```typescript
class AIResultCache {
  private cache = new Map<string, CachedResult>();
  private readonly TTL = 24 * 60 * 60 * 1000; // 24 hours

  async getCachedResult(imageHash: string): Promise<FoodAnalysisResult | null> {
    const cached = this.cache.get(imageHash);
    
    if (cached && Date.now() - cached.timestamp < this.TTL) {
      return cached.result;
    }
    
    // Remove expired cache entry
    if (cached) {
      this.cache.delete(imageHash);
    }
    
    return null;
  }

  async cacheResult(imageHash: string, result: FoodAnalysisResult): Promise<void> {
    this.cache.set(imageHash, {
      result,
      timestamp: Date.now()
    });
    
    // Persist to local storage for offline access
    await AsyncStorage.setItem(
      `ai_cache_${imageHash}`,
      JSON.stringify({ result, timestamp: Date.now() })
    );
  }

  private async generateImageHash(imageUri: string): Promise<string> {
    // Generate hash for image deduplication
    const imageData = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64
    });
    
    return CryptoJS.SHA256(imageData).toString();
  }
}
```

### Service Integration Patterns

#### Data Access Layer Pattern
```typescript
// Service-specific data access with type safety
class UserService {
  constructor(private supabase: SupabaseClient) {}

  async getUserProfile(userId: string): Promise<UserProfile> {
    const { data, error } = await this.supabase
      .from('user_service.users')
      .select(`
        id, email, display_name, diabetes_type, program_type,
        user_diabetes_settings (
          insulin_to_carb_breakfast, insulin_to_carb_lunch, insulin_to_carb_dinner,
          correction_factor, target_glucose_range
        ),
        user_preferences (
          glucose_unit, preferred_units, notifications_enabled
        )
      `)
      .eq('id', userId)
      .single();

    if (error) throw new Error(`Failed to fetch user profile: ${error.message}`);
    
    return this.transformUserData(data);
  }

  private transformUserData(data: any): UserProfile {
    return {
      id: data.id,
      email: data.email,
      displayName: data.display_name,
      diabetesType: data.diabetes_type,
      programType: data.program_type,
      insulinRatios: {
        breakfast: data.user_diabetes_settings?.insulin_to_carb_breakfast || 15,
        lunch: data.user_diabetes_settings?.insulin_to_carb_lunch || 15,
        dinner: data.user_diabetes_settings?.insulin_to_carb_dinner || 15
      },
      preferences: {
        glucoseUnit: data.user_preferences?.glucose_unit || 'mg/dL',
        units: data.user_preferences?.preferred_units || 'metric',
        notifications: data.user_preferences?.notifications_enabled ?? true
      }
    };
  }
}
```

#### Cross-Service Communication Pattern
```typescript
// Service registry for cross-service communication
class ServiceRegistry {
  private services = new Map<string, any>();

  register<T>(name: string, service: T): void {
    this.services.set(name, service);
  }

  get<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service '${name}' not found`);
    }
    return service as T;
  }
}

// Example usage in food logging
class FoodLoggingService {
  constructor(
    private supabase: SupabaseClient,
    private serviceRegistry: ServiceRegistry
  ) {}

  async logMeal(mealData: MealLogData): Promise<FoodLog> {
    // Get AI analysis from Food Analysis Service
    const analysisService = this.serviceRegistry.get<FoodAnalysisService>('foodAnalysis');
    const analysis = await analysisService.getAnalysisResult(mealData.imageId);

    // Calculate insulin dose using Formula Service
    const formulaService = this.serviceRegistry.get<FormulaService>('formula');
    const insulinCalc = await formulaService.calculateInsulinDose({
      carbs: analysis.totalCarbs,
      userId: mealData.userId,
      mealType: mealData.mealType
    });

    // Create food log entry
    const { data, error } = await this.supabase
      .from('logging_service.food_logs')
      .insert({
        user_id: mealData.userId,
        analysis_id: analysis.id,
        meal_type: mealData.mealType,
        total_carbs: analysis.totalCarbs,
        insulin_dose: insulinCalc.totalDose,
        confidence_score: analysis.confidence
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to log meal: ${error.message}`);
    
    return data;
  }
}
```

### Security Patterns

#### Row Level Security (RLS) Implementation
```sql
-- Enable RLS on all user-related tables
ALTER TABLE user_service.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE logging_service.food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_analysis.food_analysis_results ENABLE ROW LEVEL SECURITY;

-- User can only access their own data
CREATE POLICY "Users can view own profile" ON user_service.users
    FOR SELECT USING (auth.uid()::text = auth_user_id);

CREATE POLICY "Users can update own profile" ON user_service.users
    FOR UPDATE USING (auth.uid()::text = auth_user_id);

-- Food logs accessible by user and their healthcare providers
CREATE POLICY "Users can view own food logs" ON logging_service.food_logs
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM user_service.users 
            WHERE auth_user_id = auth.uid()::text
        )
    );

-- Healthcare providers can view patient data with permission
CREATE POLICY "Providers can view patient logs" ON logging_service.food_logs
    FOR SELECT USING (
        user_id IN (
            SELECT patient_id FROM user_service.provider_relationships 
            WHERE provider_id = (
                SELECT id FROM user_service.users 
                WHERE auth_user_id = auth.uid()::text
            )
            AND status = 'active'
            AND access_level IN ('standard', 'full')
        )
    );
```

#### Data Encryption Pattern
```typescript
// Encrypt sensitive medical data before storage
class MedicalDataEncryption {
  private readonly key: string;

  constructor(encryptionKey: string) {
    this.key = encryptionKey;
  }

  encryptGlucoseReading(reading: GlucoseReading): EncryptedGlucoseReading {
    return {
      id: reading.id,
      encrypted_value: this.encrypt(reading.value.toString()),
      encrypted_notes: reading.notes ? this.encrypt(reading.notes) : null,
      timestamp: reading.timestamp,
      meal_context: reading.mealContext // Non-sensitive data not encrypted
    };
  }

  decryptGlucoseReading(encrypted: EncryptedGlucoseReading): GlucoseReading {
    return {
      id: encrypted.id,
      value: parseFloat(this.decrypt(encrypted.encrypted_value)),
      notes: encrypted.encrypted_notes ? this.decrypt(encrypted.encrypted_notes) : undefined,
      timestamp: encrypted.timestamp,
      mealContext: encrypted.meal_context
    };
  }

  private encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.key).toString();
  }

  private decrypt(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
```

### Performance Optimization Patterns

#### Database Query Optimization
```sql
-- Strategic indexing for common query patterns
CREATE INDEX CONCURRENTLY idx_food_logs_user_date 
ON logging_service.food_logs (user_id, created_at DESC);

CREATE INDEX CONCURRENTLY idx_glucose_readings_user_recent 
ON logging_service.glucose_readings (user_id, timestamp DESC) 
WHERE timestamp > NOW() - INTERVAL '30 days';

CREATE INDEX CONCURRENTLY idx_food_analysis_confidence 
ON food_analysis.food_analysis_results (confidence) 
WHERE confidence > 0.7;

-- Partial indexes for active data only
CREATE INDEX CONCURRENTLY idx_active_users 
ON user_service.users (id, created_at) 
WHERE is_active = true;
```

#### Caching Strategy
```typescript
// Multi-level caching for performance
class CacheManager {
  private memoryCache = new Map<string, CachedItem>();
  private readonly MEMORY_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly STORAGE_TTL = 24 * 60 * 60 * 1000; // 24 hours

  async get<T>(key: string): Promise<T | null> {
    // Level 1: Memory cache
    const memoryItem = this.memoryCache.get(key);
    if (memoryItem && Date.now() - memoryItem.timestamp < this.MEMORY_TTL) {
      return memoryItem.data as T;
    }

    // Level 2: AsyncStorage cache
    try {
      const storageItem = await AsyncStorage.getItem(`cache_${key}`);
      if (storageItem) {
        const parsed = JSON.parse(storageItem);
        if (Date.now() - parsed.timestamp < this.STORAGE_TTL) {
          // Refresh memory cache
          this.memoryCache.set(key, { data: parsed.data, timestamp: Date.now() });
          return parsed.data as T;
        }
      }
    } catch (error) {
      console.error('Cache read error:', error);
    }

    return null;
  }

  async set<T>(key: string, data: T): Promise<void> {
    const timestamp = Date.now();
    
    // Set memory cache
    this.memoryCache.set(key, { data, timestamp });
    
    // Set storage cache
    try {
      await AsyncStorage.setItem(`cache_${key}`, JSON.stringify({ data, timestamp }));
    } catch (error) {
      console.error('Cache write error:', error);
    }
  }
}
```

### Error Handling and Monitoring Patterns

#### Comprehensive Error Handling
```typescript
// Medical-grade error handling with detailed logging
class MedicalErrorHandler {
  static async handleInsulinCalculationError(
    error: Error,
    context: InsulinCalculationContext
  ): Promise<never> {
    // Log error with full context for medical audit
    await this.logMedicalError({
      type: 'insulin_calculation_error',
      error: error.message,
      context,
      timestamp: new Date(),
      severity: 'high',
      userId: context.userId
    });

    // Notify healthcare providers if critical
    if (this.isCriticalError(error)) {
      await this.notifyHealthcareProviders(context.userId, error);
    }

    // Provide safe fallback guidance
    throw new SafeMedicalError(
      'Insulin calculation failed. Please calculate manually or consult your healthcare provider.',
      'CALCULATION_ERROR',
      {
        fallbackGuidance: 'Use your standard insulin-to-carb ratio',
        emergencyContact: context.emergencyContact
      }
    );
  }

  private static isCriticalError(error: Error): boolean {
    return error.message.includes('safety limit') || 
           error.message.includes('dangerous') ||
           error.message.includes('emergency');
  }
}
```

#### Monitoring and Analytics
```typescript
// Performance and medical safety monitoring
class HealthMetricsMonitor {
  async trackInsulinCalculation(calculation: InsulinCalculation): Promise<void> {
    // Track calculation accuracy and safety
    await this.recordMetric({
      type: 'insulin_calculation',
      userId: calculation.userId,
      dose: calculation.totalDose,
      confidence: calculation.confidence,
      timestamp: new Date(),
      metadata: {
        carbs: calculation.carbs,
        ratio: calculation.ratio,
        correctionFactor: calculation.correctionFactor
      }
    });

    // Alert on unusual patterns
    if (calculation.totalDose > 30) {
      await this.flagHighDoseCalculation(calculation);
    }
  }

  async trackGlucosePattern(userId: string, readings: GlucoseReading[]): Promise<void> {
    const pattern = this.analyzeGlucosePattern(readings);
    
    if (pattern.riskLevel === 'high') {
      await this.alertHealthcareProvider(userId, pattern);
    }
  }
}
```

### Testing Patterns

#### Medical Safety Testing
```typescript
// Comprehensive testing for medical calculations
describe('InsulinCalculator', () => {
  describe('Safety Validation', () => {
    it('should reject doses above safety limit', () => {
      const result = InsulinCalculator.calculateMealDose(500, 10); // 50 units
      expect(result.success).toBe(false);
      expect(result.error).toContain('safety limit');
    });

    it('should handle edge cases safely', () => {
      const result = InsulinCalculator.calculateMealDose(0, 15);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid');
    });

    it('should provide clear rationale for calculations', () => {
      const result = InsulinCalculator.calculateMealDose(60, 15);
      expect(result.success).toBe(true);
      expect(result.data.rationale).toContain('60g carbs ÷ 15 ratio');
    });
  });
});
```

This comprehensive system architecture provides a solid foundation for building a medical-grade diabetes management platform with proper safety measures, scalability, and maintainability. 