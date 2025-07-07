# Technical Architecture Document - MetaboTrack Platform

## System Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Native  │    │   REST API      │    │   Supabase      │
│   Mobile App    │◄──►│   Gateway       │◄──►│   PostgreSQL    │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ SQLite +    │ │    │ │ Auth Layer  │ │    │ │ Data Tables │ │
│ │ WatermelonDB│ │    │ │ (Clerk)     │ │    │ │ + Functions │ │
│ │             │ │    │ │             │ │    │ │             │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │                 │
│ │ Zustand     │ │    │ │ Sync Engine │ │    │                 │
│ │ State Mgmt  │ │    │ │ + Conflict  │ │    │                 │
│ │             │ │    │ │ Resolution  │ │    │                 │
│ └─────────────┘ │    │ └─────────────┘ │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Third-Party     │    │ Background      │    │ Analytics &     │
│ Integrations    │    │ Services        │    │ Monitoring      │
│                 │    │                 │    │                 │
│ • Clerk Auth    │    │ • Sync Worker   │    │ • Sentry        │
│ • RevenueCat    │    │ • Push Notifs   │    │ • Mixpanel      │
│ • Google Vision │    │ • File Upload   │    │ • Performance   │
│ • Health APIs   │    │ • AI Processing │    │ • Error Logs    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Data Flow Architecture

### Primary Data Flow
```
[User Input] → [Local SQLite] → [Sync Queue] → [REST API] → [PostgreSQL]
                     ↓              ↑              ↓              ↓
[UI Components] ← [Zustand] ← [Sync Response] ← [Conflict Resolution]
```

### Offline-First Data Strategy
```
1. Write Operations:
   User Action → Local SQLite → Zustand State → UI Update → Background Sync Queue

2. Read Operations:
   UI Request → Zustand State → Local SQLite → Display (with sync indicators)

3. Sync Process:
   Background Worker → Check Connectivity → Upload Changes → Download Updates → Resolve Conflicts
```

## Offline-First Sync Strategy

### Conflict Resolution Protocol
```typescript
interface SyncRecord {
  id: string;
  table: string;
  localTimestamp: number;
  serverTimestamp: number;
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  data: any;
  conflictResolution: 'SERVER_WINS' | 'CLIENT_WINS' | 'MERGE' | 'MANUAL';
}
```

### Sync Priorities
1. **Critical Health Data** (glucose readings, insulin doses): Real-time when online
2. **User Actions** (food logs, exercise): Every 5 minutes when online
3. **Settings & Preferences**: On app focus/background
4. **Analytics Data**: Batched hourly

### Retry Logic
```
Exponential Backoff: 1s → 2s → 4s → 8s → 16s → 30s (max)
Max Retries: 5 attempts per record
Permanent Failure: Move to manual resolution queue
```

## Security Model

### Authentication Flow
```
1. Clerk SDK → Biometric/PIN → JWT Token
2. Token Refresh → Automatic background renewal
3. Offline Mode → Cached token validation (max 7 days)
4. API Gateway → Token verification + user context
```

### Data Security
- **Encryption at Rest**: SQLite with SQLCipher
- **Encryption in Transit**: TLS 1.3 for all API calls
- **PII Handling**: Local hashing for sensitive data
- **Token Storage**: Keychain (iOS) / Keystore (Android)

### API Authentication Headers
```
Authorization: Bearer <clerk_jwt_token>
X-Client-Version: 1.0.0
X-Platform: ios|android
X-Device-ID: <unique_device_identifier>
```

## Performance Targets

### App Performance
- **Cold Start**: < 2 seconds (iOS), < 2.5 seconds (Android)
- **UI Interactions**: < 100ms response time
- **Database Queries**: < 50ms for common operations
- **Sync Operations**: < 500ms for critical health data

### API Performance
- **Authentication**: < 200ms
- **CRUD Operations**: < 300ms
- **Sync Endpoints**: < 500ms
- **AI Analysis**: < 2 seconds (with caching)

### Resource Optimization
- **Memory Usage**: < 150MB base, < 300MB peak
- **Battery Impact**: < 2% per hour active use
- **Network Usage**: < 1MB per day typical usage
- **Storage Growth**: < 10MB per month per user

## Integration Patterns

### Clerk Authentication Integration
```typescript
// Initialization
await Clerk.initialize({
  publishableKey: CLERK_PUBLISHABLE_KEY,
  biometric: {
    enabled: true,
    fallback: 'pin'
  }
});

// Auth Flow
const { session } = await Clerk.signIn({
  identifier: email,
  password: password
});
```

### RevenueCat Integration
```typescript
// Subscription Setup
await Purchases.configure({
  apiKey: REVENUECAT_API_KEY,
  userId: clerkUser.id
});

// Purchase Flow
const { customerInfo } = await Purchases.purchasePackage(package);
// Webhook to API: subscription status update
```

### Google Vision API Integration
```typescript
// Image Analysis
const analysisResult = await GoogleVision.analyzeNutrition({
  image: base64Image,
  cacheKey: imageHash,
  userId: currentUser.id
});

// Response cached locally for 30 days
```

### Health Platform Integrations
```typescript
// Apple HealthKit
await HealthKit.requestPermissions([
  'bloodGlucose',
  'insulin',
  'carbohydrates',
  'steps',
  'heartRate'
]);

// Google Fit
await GoogleFit.authorize({
  scopes: [
    'fitness.body.read',
    'fitness.activity.read',
    'fitness.nutrition.read'
  ]
});
```

## Architecture Decisions

### State Management Strategy
- **Zustand** for global app state (user, settings, sync status)
- **React Query** for server state caching and synchronization
- **WatermelonDB** for complex relational offline data
- **AsyncStorage** for simple key-value persistence

### Database Strategy
- **Local**: SQLite + WatermelonDB for reactive queries
- **Remote**: PostgreSQL via REST API abstraction
- **Sync**: Timestamp-based with conflict resolution
- **Migration**: Automated schema migrations for both local/remote

### API Design Philosophy
- **RESTful** endpoints with consistent naming
- **Hypermedia** links for related resources
- **Pagination** for all list endpoints
- **Versioning** through Accept headers
- **Rate Limiting** with user-friendly error messages

### Error Handling Strategy
```typescript
interface APIError {
  code: string;
  message: string;
  details?: any;
  retryable: boolean;
  userMessage: string;
}
```

### Background Processing
- **React Native Background Job** for sync operations
- **Push Notifications** for critical alerts
- **Background App Refresh** for data updates
- **Silent Push** for real-time sync triggers

## Scalability Considerations

### Horizontal Scaling
- **API Gateway**: Load balancer with auto-scaling
- **Database**: Read replicas for analytics queries
- **File Storage**: CDN for image uploads
- **Background Jobs**: Queue system with workers

### Caching Strategy
- **API Response**: 5-minute cache for static data
- **Image Analysis**: 30-day cache for nutrition data
- **User Settings**: Local cache with sync validation
- **Food Database**: Weekly updates with delta sync

### Monitoring & Observability
- **Error Tracking**: Sentry for crash reporting
- **Performance**: Native profiling + custom metrics
- **Analytics**: Mixpanel for user behavior
- **Health Checks**: API endpoint monitoring