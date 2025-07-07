# GluciQ - AI-Powered Diabetes Management Platform
## Project Brief & Foundation

### Project Vision
Transform diabetes management through AI-powered food recognition and evidence-based insulin calculation, making daily glucose control more precise, convenient, and effective for insulin-dependent individuals.

### Core Mission Statement
"Empower people with diabetes to make informed decisions about insulin dosing through intelligent food analysis, creating a seamless bridge between nutrition science and personalized diabetes care."

### Target Audience
- **Primary**: Adults with Type 1 diabetes who require insulin therapy
- **Secondary**: Type 2 diabetes patients on insulin regimens  
- **Tertiary**: Healthcare providers supporting diabetes management
- **Extended**: Caregivers and family members of diabetes patients

### Business Context & Market Opportunity

#### Market Size & Impact
- **46 million people** in the US have diabetes requiring insulin therapy
- **$327 billion** annual healthcare cost of diabetes in the US
- **85% of diabetes patients** struggle with accurate carb counting
- **Current solutions** are either too general (MyFitnessPal) or too complex (medical devices)

#### Competitive Positioning
This project creates a specialized diabetes-focused alternative to general calorie tracking apps like Cal AI, addressing the specific medical needs of insulin-dependent individuals through:
- **Medical-grade accuracy** in nutritional analysis with diabetes-specific metrics
- **Evidence-based insulin calculation** algorithms grounded in peer-reviewed research
- **Integration with glucose monitoring** workflows and pattern recognition
- **Regulatory-compliant health data** handling with HIPAA considerations
- **Provider portal capabilities** for healthcare team collaboration

### Success Definition & Metrics

#### Primary Success Metrics
- **Clinical Outcomes**: Users achieve better glucose control (improved HbA1c, time-in-range) through more accurate insulin dosing based on food analysis
- **User Engagement**: Daily active usage, meal logging frequency, retention rates
- **Accuracy**: >90% food recognition accuracy with <3 second analysis time
- **Safety**: Reduction in insulin dosing errors and dangerous situations

#### Secondary Success Metrics
- **Time Savings**: Reduced time and cognitive load for meal-related diabetes management decisions
- **Healthcare Integration**: Provider adoption and data sharing usage
- **Learning Effectiveness**: Improvement in user diabetes knowledge and self-management skills
- **Technical Performance**: 99.9% uptime for core calculation services

### Project Scope & Boundaries

#### Core Features (In Scope)
- **AI Food Recognition**: Camera-based food identification using Gemini Vision API with fallback to OpenAI Vision
- **Nutritional Analysis**: Comprehensive macro/micronutrient breakdown with diabetes-specific scoring (GlucoBalance Score)
- **Insulin Calculation**: Evidence-based bolus calculation with safety limits, personalization, and correction doses
- **Glucose Tracking**: Pre/post meal glucose logging with pattern analysis and trend visualization
- **Data Visualization**: Trends, insights, and healthcare provider reports with export capabilities
- **Offline Capability**: Core calculations work without internet connection for reliability
- **Cross-platform**: React Native app for iOS and Android with native performance

#### Advanced Features (Phase 2)
- **Barcode Scanning**: Package food identification and nutrition lookup via Open Food Facts API
- **Recipe Analysis**: Multi-ingredient meal analysis and portion estimation with AI assistance
- **Provider Portal**: Healthcare team dashboard and patient data sharing with HIPAA compliance
- **Meal Planning**: AI-assisted meal suggestions based on glucose patterns and preferences
- **Integration APIs**: Apple Health, Google Fit, and CGM device connectivity
- **Advanced Analytics**: Machine learning for personalized glucose prediction and meal recommendations

#### Out of Scope (Initial Release)
- Direct CGM device integration (API-based only initially)
- Prescription management or medication tracking beyond insulin
- Insurance claim integration or billing functionality
- Medical device certification (FDA approval) - wellness app classification
- Telemedicine or consultation features
- Social features or community aspects

### Technical Architecture Overview

#### Microservices Architecture
The system is built on a comprehensive microservices architecture with 6 distinct service schemas:

**User Service** (`user_service` schema)
- User profiles and authentication integration with Clerk
- Diabetes settings and insulin ratios with time-based variations
- Healthcare provider relationships and caregiver access
- Subscription management and billing integration
- User preferences, notifications, and privacy settings

**Food Service** (`food_service` schema)
- Master food database with comprehensive nutrition from USDA FoodData Central
- Glycemic index and diabetes-specific metrics
- User favorite foods and custom food entries
- Cultural food associations and dietary preferences

**Food Analysis Service** (`food_analysis` schema)
- AI image processing and food recognition with confidence scoring
- Barcode scanning and package food identification
- Analysis result storage and user feedback integration
- Multi-food detection and portion estimation

**Logging Service** (`logging_service` schema)
- Meal logging with comprehensive context (time, location, activity)
- Glucose readings with pattern analysis and trend calculations
- Insulin dose tracking and effectiveness monitoring
- Daily summaries and automated insights generation

**Formula Service** (`formula_service` schema)
- Insulin calculation formulas and templates with safety validation
- Personalized calculation parameters and ratio adjustments
- Batch calculation processing for meal planning
- Formula audit trails and medical compliance

**Meal Planning Service** (`meal_planning` schema)
- Meal plans and recipe management with nutritional goals
- Shopping list generation and ingredient optimization
- AI-powered meal recommendations based on glucose patterns
- Integration with food analysis for planned vs. actual tracking

#### Technology Stack
- **Frontend**: React Native with Expo SDK 50+, TypeScript, Legend State for state management
- **Backend**: Supabase (PostgreSQL) with Row Level Security and real-time subscriptions
- **Authentication**: Clerk with healthcare-grade security and HIPAA compliance
- **AI Services**: Google Gemini Vision (primary), OpenAI Vision (fallback), barcode APIs
- **Database**: PostgreSQL with comprehensive microservices schema (40+ tables, 15+ enums)
- **Migration System**: Professional versioned migration management with semantic versioning

### Key Stakeholder Requirements

#### User Requirements
- **Simplicity**: Fast food logging with minimal user input required (<30 seconds per meal)
- **Accuracy**: Medical-grade precision in insulin dose calculations with safety validation
- **Safety**: Built-in safeguards against dangerous dose suggestions with clear warnings
- **Privacy**: Complete control over health data sharing and storage with granular permissions
- **Reliability**: Core functionality works offline, syncs when connected, 99.9% uptime

#### Healthcare Provider Requirements
- **Compliance**: HIPAA-compliant data handling and sharing capabilities
- **Integration**: Easy data export and sharing with medical providers in standard formats
- **Transparency**: Clear audit trails and calculation rationale for medical review
- **Flexibility**: Customizable parameters and calculation methods per provider protocols
- **Evidence-Based**: All algorithms grounded in peer-reviewed medical research

#### Technical Requirements
- **Performance**: <3 second food recognition, real-time sync, optimized battery usage
- **Scalability**: Architecture supports growth to 100k+ users with microservices design
- **Reliability**: 99.9% uptime for core calculation services with automated failover
- **Security**: End-to-end encryption for all medical data, secure API key management
- **Maintainability**: Clean code, comprehensive documentation, automated testing

### Risk Assessment & Mitigation

#### High Risk Items
- **Medical Accuracy**: Insulin miscalculation could cause serious harm (hypoglycemia/hyperglycemia)
  - *Mitigation*: Multiple validation layers, safety limits, clear disclaimers, medical review
- **AI Service Costs**: Vision API usage could become expensive at scale
  - *Mitigation*: Intelligent caching, multiple provider fallbacks, cost monitoring alerts
- **Regulatory Compliance**: Health data regulations are complex and evolving
  - *Mitigation*: Legal consultation, conservative compliance approach, regular audits

#### Medium Risk Items
- **User Adoption**: Complex medical apps face adoption challenges
  - *Mitigation*: Extensive user testing, progressive onboarding, provider endorsement
- **Technical Complexity**: Microservices architecture increases development complexity
  - *Mitigation*: Comprehensive testing, staged rollouts, monitoring systems
- **Data Privacy**: Healthcare data breaches have severe consequences
  - *Mitigation*: End-to-end encryption, regular security audits, compliance monitoring

#### Low Risk Items
- **Competition**: Established players could enter the market
  - *Mitigation*: Focus on diabetes-specific features, build strong user community
- **Technology Changes**: AI services or platforms could change
  - *Mitigation*: Multiple provider strategy, abstraction layers, migration planning

### Technology Philosophy & Principles

#### Core Development Principles
- **Safety First**: All features designed with patient safety as primary concern
- **Evidence-Based**: Algorithms grounded in peer-reviewed medical research
- **Privacy-Focused**: User controls all aspects of data sharing and storage
- **Local-First**: Critical calculations work offline for reliability
- **Transparent**: Clear explanations of how calculations are performed
- **Accessible**: Full support for users with disabilities and diverse needs

#### Development Standards
- **Medical-Grade Quality**: Extensive testing, validation, and error handling
- **Type Safety**: TypeScript with strict mode, comprehensive type definitions
- **Performance**: Optimized for battery life and network efficiency
- **Maintainability**: Clean code, comprehensive documentation, automated testing
- **Scalability**: Architecture designed for growth and service separation

### Current Project Status

#### Completed Phases
- **Phase 1**: Schema migration and foundation architecture complete
- **Database**: Unified microservices schema with 40+ tables deployed via professional migration system
- **Migration System**: Semantic versioned migration management (V2.0.0 through V2.6.0)
- **Core Services**: Basic service architecture established with proper schema isolation
- **Foundation**: React Native app structure with Expo, TypeScript, and Legend State

#### Current Implementation Status
- **Schema**: Complete microservices schema with 6 service schemas deployed
- **Tables**: 40+ tables with comprehensive relationships and constraints
- **Enums**: 15+ type-safe enums for medical data consistency
- **Migration System**: Professional versioned migration system implemented
- **Authentication**: Clerk integration prepared for healthcare-grade security
- **AI Services**: Google Gemini Vision and OpenAI Vision APIs configured

#### Next Phase Priorities
1. **API Implementation**: Build out REST API endpoints for each microservice
2. **AI Service Integration**: Implement food recognition pipeline with fallback strategies
3. **Core UI Development**: Build camera interface, analysis results, and insulin calculator
4. **Offline Functionality**: Implement local storage and sync capabilities
5. **Safety Systems**: Build insulin calculation validation and safety checks

### Regulatory & Compliance Considerations

#### Healthcare Data Protection
- **HIPAA Compliance**: Full protection of personal health information with BAA requirements
- **User Control**: Complete data ownership and granular sharing permissions
- **Encryption**: End-to-end encryption (AES-256-GCM) for all medical data
- **Audit Logging**: Complete tracking of data access and modifications with timestamps

#### Medical App Classification
- **FDA Guidance**: Compliance with mobile medical app regulations as wellness tool
- **Clinical Validation**: Evidence-based algorithms with research backing and citations
- **Risk Classification**: Appropriate classification as wellness vs. medical device
- **Quality Management**: ISO 13485 quality management system considerations
- **Disclaimers**: Clear communication of app limitations and medical supervision requirements

### Project Success Factors

#### Technical Success Factors
- **Microservices Architecture**: Proper service isolation and scalability
- **AI Integration**: Reliable food recognition with multiple provider fallbacks
- **Safety Systems**: Comprehensive validation and error handling for medical calculations
- **Performance**: Sub-3-second response times with offline capability
- **Migration System**: Professional database management and versioning

#### Business Success Factors
- **User Experience**: Intuitive interface reducing cognitive load for diabetes management
- **Clinical Outcomes**: Measurable improvement in glucose control and quality of life
- **Provider Adoption**: Healthcare team integration and data sharing capabilities
- **Regulatory Compliance**: HIPAA compliance and appropriate medical app classification
- **Scalability**: Architecture supporting growth to 100k+ users

This project represents a significant opportunity to improve diabetes management through technology while maintaining the highest standards of medical accuracy, patient safety, and regulatory compliance. The comprehensive microservices architecture and professional migration system provide a solid foundation for building a transformative diabetes management platform. 