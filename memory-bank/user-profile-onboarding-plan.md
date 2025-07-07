# User Profile & Onboarding System Implementation Plan

## Current State Analysis

### Existing Architecture
- **Authentication**: Clerk is working for login/signup
- **Database**: Supabase with comprehensive user_service schema
- **State Management**: Legend State with offline-first approach
- **Sync**: Legend State + Supabase sync configured but not fully implemented for user data

### Current Issues
1. No user profile completion check after login
2. No onboarding flow for first-time users
3. No settings screens for profile management
4. User data not properly synced between Clerk and Supabase
5. No diabetes-specific settings management

## Implementation Plan

### Phase 1: Core User Store & Data Layer

#### 1.1 User Store Creation (`userStore.ts`)
- **Purpose**: Central state management for user profile, preferences, and diabetes settings
- **Features**:
  - Profile data (name, DOB, contact info)
  - Diabetes settings (type, diagnosis date, insulin ratios)
  - Preferences (units, notifications, theme)
  - Onboarding progress tracking
  - Offline-first with Supabase sync

#### 1.2 Enhanced Clerk-Supabase Integration
- **Purpose**: Automatic user creation in Supabase when user signs up with Clerk
- **Features**:
  - JWT token integration for RLS
  - Automatic user record creation
  - Profile completion status tracking

### Phase 2: Onboarding Flow

#### 2.1 Onboarding Screens
1. **Welcome Screen** - Introduction to the app
2. **Basic Profile** - Name, DOB, contact info
3. **Diabetes Type** - Type selection and diagnosis date
4. **Medical Settings** - Insulin ratios, target glucose, CGM/pump info
5. **Preferences** - Units, notifications, emergency contacts
6. **Completion** - Summary and confirmation

#### 2.2 Profile Completion Check
- **Purpose**: Redirect incomplete profiles to onboarding
- **Implementation**: Check `onboarding_completed` flag in user record
- **Location**: Chat index screen with conditional rendering

### Phase 3: Settings & Profile Management

#### 3.1 Settings Screens
1. **Profile Settings** - Edit personal information
2. **Diabetes Settings** - Manage insulin ratios, targets, devices
3. **Preferences** - Units, notifications, theme
4. **Emergency Contacts** - Healthcare provider, emergency contact
5. **Account Settings** - Email, password, data export

#### 3.2 Navigation Integration
- Add settings navigation to chat layout
- Profile completion indicator
- Settings access from dashboard

### Phase 4: Data Sync & Offline Support

#### 4.1 Offline-First Implementation
- **Local Storage**: AsyncStorage for persistence
- **Sync Strategy**: Timestamp-based with conflict resolution
- **Retry Logic**: Exponential backoff for failed syncs

#### 4.2 Conflict Resolution
- **Server Wins**: For critical medical data
- **Client Wins**: For user preferences
- **Merge Strategy**: For non-conflicting updates

## Technical Implementation Details

### User Store Architecture
```typescript
interface UserStoreState {
  // Core user data
  profile: User | null;
  preferences: UserPreferences | null;
  diabetesSettings: UserDiabetesSettings | null;
  
  // Onboarding state
  onboardingStep: number;
  onboardingCompleted: boolean;
  
  // Sync state
  isLoading: boolean;
  isSyncing: boolean;
  lastSyncTime: string | null;
  syncError: string | null;
}
```

### Onboarding Flow State Machine
```typescript
enum OnboardingStep {
  WELCOME = 0,
  BASIC_PROFILE = 1,
  DIABETES_TYPE = 2,
  MEDICAL_SETTINGS = 3,
  PREFERENCES = 4,
  COMPLETION = 5
}
```

### Database Schema Integration
- **Primary Table**: `user_service.users`
- **Related Tables**: 
  - `user_service.user_preferences`
  - `user_service.user_diabetes_settings`
  - `user_service.user_subscriptions`

## File Structure

```
src/
├── stores/
│   └── userStore.ts                 # Main user state management
├── app/(chat)/
│   ├── onboarding/
│   │   ├── _layout.tsx
│   │   ├── welcome.tsx
│   │   ├── basic-profile.tsx
│   │   ├── diabetes-type.tsx
│   │   ├── medical-settings.tsx
│   │   ├── preferences.tsx
│   │   └── completion.tsx
│   └── settings/
│       ├── _layout.tsx
│       ├── profile.tsx
│       ├── diabetes.tsx
│       ├── preferences.tsx
│       └── emergency-contacts.tsx
├── components/
│   ├── onboarding/
│   │   ├── OnboardingStep.tsx
│   │   ├── ProgressIndicator.tsx
│   │   └── FormField.tsx
│   └── settings/
│       ├── SettingsCard.tsx
│       ├── SettingsToggle.tsx
│       └── SettingsInput.tsx
└── lib/
    └── services/
        └── UserService.ts          # User data operations
```

## Success Criteria

### Phase 1 Complete
- [ ] User store created with full type safety
- [ ] Supabase sync working for user data
- [ ] Clerk-Supabase integration enhanced

### Phase 2 Complete
- [ ] Onboarding flow functional
- [ ] Profile completion check working
- [ ] New users guided through setup

### Phase 3 Complete
- [ ] Settings screens functional
- [ ] Profile editing working
- [ ] Diabetes settings management

### Phase 4 Complete
- [ ] Offline-first sync implemented
- [ ] Conflict resolution working
- [ ] Data persistence reliable

## Risk Mitigation

### Technical Risks
1. **Sync Conflicts**: Implement clear conflict resolution strategy
2. **Data Loss**: Robust offline persistence with backup
3. **Performance**: Optimize sync operations and caching

### User Experience Risks
1. **Onboarding Friction**: Keep steps minimal and intuitive
2. **Data Entry**: Provide smart defaults and validation
3. **Accessibility**: Ensure all screens are accessible

## Next Steps

1. **Start with Phase 1**: Create user store and enhance Clerk integration
2. **Implement Profile Check**: Add logic to chat index for onboarding redirect
3. **Build Onboarding Screens**: Create step-by-step profile setup
4. **Add Settings Management**: Enable profile editing and diabetes settings
5. **Implement Sync**: Add robust offline-first synchronization

## Architecture Improvements

### Current Architecture Enhancement
- **Better Type Safety**: Use discriminated unions for diabetes types
- **Validation Layer**: Add Zod schemas for data validation
- **Error Handling**: Comprehensive error boundaries and retry logic
- **Performance**: Implement selective sync and caching strategies

### Future Considerations
- **Multi-tenant Support**: Healthcare provider access
- **Data Export**: HIPAA-compliant data export
- **Analytics**: User engagement and health outcome tracking
- **Integration**: Apple Health, Google Fit, CGM devices 