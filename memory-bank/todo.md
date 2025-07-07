# 🎯 GLUCIQ MOBILE APP - COMPLETE REFACTORING PLAN

**Status**: ACTIVE REFACTORING  
**Priority**: CRITICAL  
**Target**: Production-ready food scanning & insulin calculation app  
**Context**: Moving from Expo 53/React 19 to Expo 52/React 18, massive code cleanup needed

---

## 🔥 CURRENT SITUATION ANALYSIS

### **What We Have**
- ✅ **Database Schema**: Professional 6-service microservices architecture with 40+ tables
- ✅ **AI Services**: Google Gemini Vision API integration ready
- ✅ **Authentication**: Clerk + Supabase integration configured
- ✅ **Core Logic**: Insulin calculation algorithms and food analysis services
- ✅ **Modern Stack**: React Native with Expo 52, TypeScript, Legend State

### **What's Broken**
- ❌ **Version Mismatch**: Code from Expo 53/React 19 app moved to Expo 52/React 18
- ❌ **Import Errors**: Missing dependencies and version conflicts
- ❌ **Library Conflicts**: Some libraries incompatible with current Expo version
- ❌ **Navigation Issues**: Routing problems with camera and analysis screens
- ❌ **Type Errors**: TypeScript errors due to version mismatches

### **What Needs to Happen**
1. **Fix all TypeScript/import errors** (CRITICAL)
2. **Downgrade incompatible libraries** to Expo 52 compatible versions
3. **Fix routing and navigation** issues
4. **Test basic food scanning workflow** 
5. **Implement simple dashboard** with food/barcode scanning buttons
6. **Get insulin calculation working** with user data

---

## 🏗️ PHASE 1: CRITICAL ERROR FIXES (IMMEDIATE)

### **1.1 Library Compatibility Fixes**
- [ ] **Task 1.1.1**: Audit package.json for Expo 53/React 19 incompatible packages
- [ ] **Task 1.1.2**: Downgrade or replace incompatible libraries
- [ ] **Task 1.1.3**: Fix all import errors in TypeScript files
- [ ] **Task 1.1.4**: Resolve version conflicts in package-lock.json
- [ ] **Task 1.1.5**: Test basic app starts without errors

### **1.2 Navigation & Routing Fixes**
- [ ] **Task 1.2.1**: Fix app/_layout.tsx to properly handle nested routes
- [ ] **Task 1.2.2**: Verify camera routes work: (chat)/camera/food-capture.tsx
- [ ] **Task 1.2.3**: Verify analysis routes work: (chat)/analysis/food-results.tsx  
- [ ] **Task 1.2.4**: Fix navigation between screens
- [ ] **Task 1.2.5**: Test basic screen navigation flow

### **1.3 Core Service Integration**
- [ ] **Task 1.3.1**: Test Supabase database connection
- [ ] **Task 1.3.2**: Test Clerk authentication flow
- [ ] **Task 1.3.3**: Test Google Gemini Vision API connectivity
- [ ] **Task 1.3.4**: Verify user data loading from database
- [ ] **Task 1.3.5**: Test basic data flow end-to-end

---

## 🏗️ PHASE 2: CORE FUNCTIONALITY IMPLEMENTATION

### **2.1 Simple Dashboard Implementation**
- [ ] **Task 2.1.1**: Create clean (chat)/index.tsx with two main buttons
- [ ] **Task 2.1.2**: Add "Food Scanning" button → navigate to camera/food-capture
- [ ] **Task 2.1.3**: Add "Barcode Scanning" button → navigate to camera/barcode-scanner
- [ ] **Task 2.1.4**: Add user greeting with data from Supabase
- [ ] **Task 2.1.5**: Add basic navigation and logout functionality

### **2.2 Food Scanning Pipeline**
- [ ] **Task 2.2.1**: Fix camera/food-capture.tsx - camera interface
- [ ] **Task 2.2.2**: Test image upload to Supabase storage
- [ ] **Task 2.2.3**: Test Google Gemini Vision API call with uploaded image
- [ ] **Task 2.2.4**: Display nutrition results in analysis/food-results.tsx
- [ ] **Task 2.2.5**: Test complete flow: Camera → Upload → AI → Results

### **2.3 Insulin Calculation Integration**
- [ ] **Task 2.3.1**: Load user insulin settings from user_service schema
- [ ] **Task 2.3.2**: Use nutrition data to calculate insulin requirements
- [ ] **Task 2.3.3**: Display insulin recommendation in food-results screen
- [ ] **Task 2.3.4**: Allow user to accept/modify insulin dose
- [ ] **Task 2.3.5**: Save insulin calculation to database

---

## 🏗️ PHASE 3: USER DATA & DATABASE INTEGRATION

### **3.1 User Profile & Settings**
- [ ] **Task 3.1.1**: Create user profile loading from user_service.users
- [ ] **Task 3.1.2**: Load diabetes settings (insulin ratios, correction factors)
- [ ] **Task 3.1.3**: Handle first-time user setup in Supabase
- [ ] **Task 3.1.4**: Sync Clerk user data with Supabase user profile
- [ ] **Task 3.1.5**: Test user data persistence and updates

### **3.2 Food Analysis & Logging**
- [ ] **Task 3.2.1**: Save food analysis results to food_analysis schema
- [ ] **Task 3.2.2**: Save food logs to logging_service schema
- [ ] **Task 3.2.3**: Save insulin doses to logging_service schema
- [ ] **Task 3.2.4**: Display food/insulin history in simple cards
- [ ] **Task 3.2.5**: Test complete data persistence workflow

### **3.3 Barcode Scanning Implementation**
- [ ] **Task 3.3.1**: Fix camera/barcode-scanner.tsx functionality
- [ ] **Task 3.3.2**: Test barcode reading and product lookup
- [ ] **Task 3.3.3**: Display barcode product nutrition information
- [ ] **Task 3.3.4**: Integrate barcode results with insulin calculation
- [ ] **Task 3.3.5**: Test barcode → nutrition → insulin workflow

---

## 🏗️ PHASE 4: TESTING & POLISH

### **4.1 End-to-End Testing**
- [ ] **Task 4.1.1**: Test complete food scanning workflow
- [ ] **Task 4.1.2**: Test complete barcode scanning workflow
- [ ] **Task 4.1.3**: Test user authentication and data loading
- [ ] **Task 4.1.4**: Test insulin calculation accuracy
- [ ] **Task 4.1.5**: Test data persistence and retrieval

### **4.2 Error Handling & Robustness**
- [ ] **Task 4.2.1**: Add comprehensive error handling for API failures
- [ ] **Task 4.2.2**: Add loading states for all async operations
- [ ] **Task 4.2.3**: Add offline support for critical functionality
- [ ] **Task 4.2.4**: Add user feedback for all operations
- [ ] **Task 4.2.5**: Add logging for debugging and monitoring

### **4.3 Performance & Optimization**
- [ ] **Task 4.3.1**: Optimize image processing and compression
- [ ] **Task 4.3.2**: Optimize database queries and caching
- [ ] **Task 4.3.3**: Optimize API call patterns
- [ ] **Task 4.3.4**: Add performance monitoring
- [ ] **Task 4.3.5**: Test performance on different devices

---

## 🎯 TECHNICAL ARCHITECTURE OVERVIEW

### **App Structure (Target)**
```
src/app/
├── _layout.tsx                 # Root layout with Clerk auth
├── (auth)/
│   ├── _layout.tsx            # Auth layout
│   └── index.tsx              # Login/signup screen
└── (chat)/
    ├── _layout.tsx            # Authenticated layout
    ├── index.tsx              # Main dashboard (2 buttons)
    ├── camera/
    │   ├── food-capture.tsx   # Camera for food
    │   └── barcode-scanner.tsx # Camera for barcodes
    └── analysis/
        └── food-results.tsx   # Show nutrition + insulin
```

### **Key Services**
```
src/lib/
├── ai/
│   ├── GeminiVisionService.ts     # Google Vision API
│   └── EnhancedFoodAnalysisService.ts # Food analysis
├── database/
│   ├── supabase.ts                # Database client
│   └── clerkSupabase.ts           # Clerk integration
├── insulin/
│   └── InsulinCalculator.ts       # Insulin calculations
└── services/
    ├── FoodService.ts             # Food CRUD operations
    └── InsulinService.ts          # Insulin logging
```

### **Database Schema (Existing)**
```sql
-- User management
user_service.users                 # User profiles
user_service.diabetes_settings     # Insulin ratios

-- Food analysis
food_analysis.food_images          # Uploaded images
food_analysis.food_analysis_results # AI analysis
food_analysis.analyzed_foods       # Individual foods

-- Logging
logging_service.food_logs          # Food entries
logging_service.insulin_doses      # Insulin doses
```

---

## 📊 PROGRESS TRACKING

### **Current Status**
- **Phase 1**: 0/15 tasks (0%) - READY TO START
- **Phase 2**: 0/15 tasks (0%) - PENDING
- **Phase 3**: 0/15 tasks (0%) - PENDING  
- **Phase 4**: 0/15 tasks (0%) - PENDING

### **Success Criteria**
- [ ] App starts without errors
- [ ] User can login and see dashboard
- [ ] Food scanning works: Camera → AI → Nutrition → Insulin
- [ ] Barcode scanning works: Scanner → Product → Nutrition → Insulin
- [ ] User data loads from Supabase
- [ ] All calculations and data save properly

---

## 🚀 IMMEDIATE NEXT STEPS

### **Right Now (Next 30 minutes)**
1. **Fix package.json** - Downgrade incompatible libraries
2. **Fix TypeScript errors** - Resolve all import issues
3. **Test basic app startup** - Make sure it runs without crashing

### **Today (Next 2-3 hours)**
1. **Fix routing issues** - Get navigation working
2. **Test database connection** - Verify Supabase works
3. **Test AI services** - Verify Google Vision API works
4. **Create simple dashboard** - Two buttons for scanning

### **This Week**
1. **Complete food scanning workflow** - End-to-end functionality
2. **Complete barcode scanning workflow** - End-to-end functionality
3. **User data integration** - Profile loading and insulin settings
4. **Basic testing** - Verify all core features work

---

## ⚠️ CRITICAL DEPENDENCIES

### **Required for Phase 1**
- Expo 52 compatible versions of all packages
- Working TypeScript compilation
- Basic navigation between screens
- Supabase and Clerk authentication

### **Required for Phase 2**
- Camera permissions and functionality
- Google Gemini Vision API access
- Supabase storage for images
- Working insulin calculation logic

### **Required for Phase 3**
- User profile database schema
- Food analysis database schema
- Logging service database schema
- Proper data synchronization

---

## 📚 CONTEXT REFERENCES

### **Key Files to Focus On**
1. **package.json** - Library versions and dependencies
2. **src/app/_layout.tsx** - Root navigation setup
3. **src/app/(chat)/index.tsx** - Main dashboard
4. **src/app/(chat)/camera/food-capture.tsx** - Camera interface
5. **src/app/(chat)/analysis/food-results.tsx** - Results display
6. **src/lib/ai/GeminiVisionService.ts** - AI integration
7. **src/lib/insulin/InsulinCalculator.ts** - Insulin calculations

### **Database Schema References**
- **src/scripts/migrations/versions/** - All schema definitions
- **memory-bank/*** - Architecture and context documentation
- **User test data** - Use test user ID: 11111111-1111-1111-1111-111111111111

### **Environment Setup**
- **.env** - API keys for Google Vision, Supabase, Clerk
- **app.json** - Expo configuration
- **tsconfig.json** - TypeScript configuration

---

**EXECUTION READY - START WITH PHASE 1 TASK 1.1.1**