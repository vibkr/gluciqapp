# 🩺 GluciQ - AI-Powered Diabetes Management App

**Smart Food Analysis • Precise Insulin Calculation • Blood Glucose Tracking**

GluciQ is a React Native application that leverages AI to help diabetic patients accurately log food, calculate insulin doses, and track blood glucose levels. Built with a focus on safety, privacy, and clinical accuracy.

---

## 🚀 **Quick Start**

### For Developers
```bash
# Clone and install
git clone <repository-url>
cd gluciq
npm install

# Start development
npm start
```

### For Setup
1. **Database Setup**: See [Supabase Setup Guide](docs/04-INTEGRATIONS/SUPABASE_SETUP_COMPLETE.md)
2. **Authentication**: See [Clerk Integration Guide](docs/04-INTEGRATIONS/CLERK_SUPABASE_INTEGRATION_PLAN.md)
3. **Environment**: Copy `docs/env-example.txt` to `.env`

---

## 📚 **Documentation Navigation**

### 🎯 **Project Overview** (`docs/01-PROJECT/`)
- **[Business Requirements](docs/01-PROJECT/business-requirements.md)** - Core requirements and user stories
- **[Implementation Roadmap](docs/01-PROJECT/implementation-roadmap.md)** - Development timeline and milestones
- **[Metabolic Health PRD](docs/01-PROJECT/metabolic_health_prd.md)** - Product requirements document
- **[Progress Tracker](docs/01-PROJECT/PROGRESS_TRACKER.md)** - Current development status

### 🏗️ **Architecture** (`docs/02-ARCHITECTURE/`)
- **[Technical Architecture](docs/02-ARCHITECTURE/tech-architecture.md)** - System design and technology stack
- **[Improved Architecture Design](docs/02-ARCHITECTURE/improved-architecture-design.md)** - Enhanced architectural patterns
- **[Schema Analysis](docs/02-ARCHITECTURE/schema-analysis.md)** - Database design analysis

### 🗄️ **Database** (`docs/03-DATABASE/`)
- **[CURRENT_SCHEMA.sql](docs/03-DATABASE/CURRENT_SCHEMA.sql)** - 🎯 **SINGLE SOURCE OF TRUTH** - Production-ready database schema
- **[Migration Scripts](scripts/setup/)** - Database migration and setup scripts

### 🔧 **Integrations** (`docs/04-INTEGRATIONS/`)
- **[Supabase Setup Complete](docs/04-INTEGRATIONS/SUPABASE_SETUP_COMPLETE.md)** - Complete database setup guide
- **[Clerk Integration Plan](docs/04-INTEGRATIONS/CLERK_SUPABASE_INTEGRATION_PLAN.md)** - Authentication integration guide
- **[TODO](docs/04-INTEGRATIONS/TODO.md)** - Integration tasks and checkpoints

### 💡 **Solutions** (`docs/05-SOLUTIONS/`)
- **[Food Category Solution](docs/05-SOLUTIONS/FOOD_CATEGORY_SOLUTION.md)** - AI food categorization approach

### 📋 **Active Development** (`memory-bank/`)
- **[Tasks](memory-bank/tasks.md)** - Current sprint tasks and implementation details
- **[Active Context](memory-bank/activeContext.md)** - Current development context
- **[Progress](memory-bank/progress.md)** - Detailed progress tracking
- **[System Patterns](memory-bank/systemPatterns.md)** - Code patterns and conventions

---

## 🛠️ **Technology Stack**

### **Mobile Framework**
- **React Native 0.79** with Expo 53
- **TypeScript** for type safety
- **Expo Router** for navigation

### **Backend & Database**
- **Supabase** - PostgreSQL database with RLS
- **Clerk** - Authentication and user management
- **Supabase Storage** - Image storage for food photos

### **AI & Analysis**
- **Google Gemini Vision API** - Food image analysis
- **OpenFoodFacts API** - Barcode nutrition lookup
- **Custom Insulin Calculator** - Safety-critical dosing algorithms

### **State Management**
- **Zustand** - Global state management
- **React Query** - API state and caching

---

## 🎯 **Core Features**

### ✅ **Implemented**
- 📱 **Camera Food Capture** - Photo capture with metadata
- 🤖 **AI Food Analysis** - Gemini Vision integration
- 🧮 **Insulin Calculations** - Carb counting and dosing
- 🔐 **Secure Authentication** - Clerk + Supabase RLS
- 💾 **Local Storage** - Offline-first approach

### 🚧 **In Development** 
- 📊 **Blood Glucose Tracking** - Trend analysis and insights
- 📈 **Advanced Analytics** - Meal pattern recognition
- 👥 **Healthcare Provider Access** - Secure data sharing
- 🔄 **Data Synchronization** - Multi-device sync

### 🔮 **Planned**
- 📚 **Meal Planning** - AI-powered meal suggestions
- 🏥 **Clinical Integration** - EHR connectivity
- 📱 **Wearable Integration** - CGM and smartwatch support

---

## 🛡️ **Security & Compliance**

### **Data Protection**
- **HIPAA Compliant** - Healthcare data encryption
- **Row Level Security** - Database-level access control
- **Audit Logging** - Complete access trail
- **PII/PHI Encryption** - Sensitive data protection

### **Authentication**
- **Multi-Factor Authentication** - Enhanced security
- **JWT-based Authorization** - Secure token management
- **Role-Based Access Control** - Provider/patient permissions

---

## 📊 **Development Status**

```
📋 Planning Phase:     ████████████████████ 100% ✅
🏗️  Infrastructure:    ████████████████████ 100% ✅
🎨 UI/UX Foundation:   ████████████████░░░░  80% 🚧
🤖 AI Integration:     ████████████████░░░░  80% 🚧
💉 Insulin Calculator: ████████████░░░░░░░░  60% 🚧
📊 Analytics:          ████░░░░░░░░░░░░░░░░  20% 🔮
🏥 Clinical Features:  ░░░░░░░░░░░░░░░░░░░░   0% 🔮
```

**Current Sprint**: AI Food Analysis Enhancement
**Next Milestone**: Beta Release v1.0

---

## 🚀 **Quick Development Tasks**

### **Setup Database**
```bash
cd scripts/setup
node setup-database.js
```

### **Run Tests**
```bash
npm test
cd scripts/setup && node test-integration.js
```

### **Deploy to Expo**
```bash
npm run build:production
eas build --platform all
```

---

## 📁 **Project Structure**

```
gluciq/
├── 📱 src/                     # React Native application code
│   ├── app/                    # Expo Router screens
│   ├── components/             # Reusable UI components
│   ├── lib/                    # Core libraries and services
│   ├── stores/                 # Zustand state management
│   └── types/                  # TypeScript definitions
├── 📚 docs/                    # Organized documentation
│   ├── 01-PROJECT/             # Business and project docs
│   ├── 02-ARCHITECTURE/        # Technical architecture
│   ├── 03-DATABASE/            # Database schemas
│   ├── 04-INTEGRATIONS/        # Third-party integrations
│   └── 05-SOLUTIONS/           # Solution documents
├── 🏗️ scripts/                 # Utility and setup scripts
│   ├── setup/                  # Database and environment setup
│   └── utils/                  # Development utilities
├── 💾 memory-bank/             # Active development context
│   ├── tasks.md                # Current sprint tasks
│   ├── progress.md             # Development progress
│   └── activeContext.md        # Current context
└── 🎨 assets/                  # Images, fonts, and media
```

---

## 🔗 **Important Links**

### **Development**
- 🌐 **[Supabase Dashboard](https://supabase.com/dashboard/project/pmiqqxrsfounxzcofzyp)**
- 🔐 **[Clerk Dashboard](https://dashboard.clerk.com/)**
- 📱 **[Expo Dashboard](https://expo.dev/)**

### **Documentation**
- 📖 **[Supabase Docs](https://supabase.com/docs)**
- 🔑 **[Clerk Docs](https://clerk.com/docs)**
- 📱 **[Expo Docs](https://docs.expo.dev/)**
- 🤖 **[Gemini API Docs](https://ai.google.dev/docs)**

### **APIs**
- 🍎 **[OpenFoodFacts API](https://world.openfoodfacts.org/data)**
- 💳 **[RevenueCat Docs](https://docs.revenuecat.com/)**

---

## 🆘 **Getting Help**

### **Common Issues**
1. **Database Connection**: Check [Supabase Setup](docs/04-INTEGRATIONS/SUPABASE_SETUP_COMPLETE.md)
2. **Authentication Errors**: Review [Clerk Integration](docs/04-INTEGRATIONS/CLERK_SUPABASE_INTEGRATION_PLAN.md)
3. **Build Failures**: Verify environment variables in `docs/env-example.txt`

### **Support Channels**
- 📧 **Technical Issues**: Check documentation first, then create GitHub issue
- 💬 **Development Questions**: Review memory-bank context
- 🏥 **Clinical Questions**: Consult healthcare provider documentation

---

## 📄 **License**

This project is proprietary software for diabetes management. Unauthorized distribution is prohibited.

---

**💡 Built with ❤️ for the diabetes community**