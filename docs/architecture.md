# AI Expense & Financial Intelligence System - Architecture

## Overview
A production-grade, full-stack AI-powered financial management application that enables users to track expenses, automatically categorize transactions using machine learning, detect unusual spending patterns, forecast future expenses, manage budgets and financial goals, and receive personalized AI-driven financial insights.

## System Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend                          │
│  (React, TypeScript, Vite, Tailwind CSS, Recharts)         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Firebase Authentication (Client SDK)
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  Firebase Authentication                    │
│              (Email/Password, Google Sign-In)               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Firebase ID Token
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  React Application                          │
│                 (Protected Routes, State)                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTPS REST API (Axios)
                     │ Authorization: Bearer <firebase_id_token>
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                     FastAPI Backend                         │
│            (Python, Pydantic, Firebase Admin SDK)            │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────────┐    ┌──────────────────┐
│ Firebase Admin   │    │  AI/ML Services  │
│      SDK         │    │                  │
└────────┬─────────┘    └────────┬─────────┘
         │                       │
         │                       │
         ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│   Firestore      │    │  ML Models:       │
│   Database       │    │  - Categorizer    │
│                  │    │  - Anomaly Det.   │
│  - users         │    │  - Forecaster     │
│  - expenses      │    │  - Insights Gen.  │
│  - budgets       │    │  - Assistant      │
│  - goals         │    │                  │
│  - insights      │    │  LLM Integration  │
│  - anomalies     │    │  (Ollama/Cloud)   │
│  - forecasts     │    └──────────────────┘
│  - notifications │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Cloud Storage    │
│                  │
│  - CSV files     │
│  - Documents     │
│  - Profile images│
└──────────────────┘
```

## Technology Stack

### Frontend
- **React 18+**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Recharts**: Data visualization
- **Axios**: HTTP client
- **Firebase Client SDK**: Authentication

### Backend
- **Python 3.11+**: Runtime
- **FastAPI**: Web framework
- **Pydantic**: Data validation
- **Firebase Admin SDK**: Firebase backend integration
- **Uvicorn**: ASGI server

### Database & Storage
- **Firebase Cloud Firestore**: NoSQL document database
- **Firebase Cloud Storage**: File storage
- **Firebase Authentication**: User authentication

### AI/ML
- **pandas**: Data manipulation
- **numpy**: Numerical computing
- **scikit-learn**: Machine learning
- **sentence-transformers**: Semantic similarity
- **LLM Integration**: Natural language generation
- **Ollama**: Optional local LLM provider

### Infrastructure
- **Docker**: Containerization
- **Environment Variables**: Configuration management
- **Logging**: Structured logging
- **Firebase Emulator Suite**: Local development

## Security Architecture

### Authentication Flow
1. User authenticates via Firebase Authentication (Email/Password or Google)
2. Firebase Client SDK returns ID token
3. Frontend includes ID token in Authorization header: `Bearer <token>`
4. FastAPI receives request on protected endpoint
5. Firebase Admin SDK verifies token
6. Extract Firebase UID from verified token
7. Authorize request based on UID and role
8. Access Firestore data scoped to authenticated user

### Key Security Principles
- **Never trust UID from frontend**: Always verify Firebase ID token
- **No Firebase Admin credentials in frontend**: Backend-only
- **Firestore Security Rules**: Server-side access control
- **Role-based access control**: User vs Admin roles
- **Input validation**: Backend validation with Pydantic
- **CORS**: Configured for allowed origins
- **Environment variables**: Secrets never in code
- **No secrets in Git**: Service accounts in .gitignore

## Data Flow Architecture

### Expense Creation Flow
```
User Input (React)
↓
Client Validation
↓
Firebase ID Token
↓
POST /api/v1/expenses
↓
FastAPI: Verify Token
↓
FastAPI: Validate Data (Pydantic)
↓
AI Categorization Service
↓
Category + Confidence
↓
Expense Service
↓
Firestore: users/{userId}/expenses/{expenseId}
↓
Response to Frontend
```

### Analytics Flow
```
Dashboard Request
↓
Firebase ID Token
↓
GET /api/v1/analytics/summary
↓
FastAPI: Verify Token
↓
Analytics Service
↓
Firestore Query (user's expenses)
↓
Calculate Statistics (Backend)
↓
Return Verified Data
↓
Frontend Display (Recharts)
```

### AI Insights Flow
```
User Requests Insights
↓
Firebase ID Token
↓
GET /api/v1/ai/insights
↓
FastAPI: Verify Token
↓
Analytics Service (Calculate Stats)
↓
Verified Financial Data
↓
LLM Integration
↓
Natural Language Explanation
↓
Return Insights
```

### AI Assistant Flow
```
User Question
↓
Firebase ID Token
↓
POST /api/v1/ai/assistant
↓
FastAPI: Verify Token
↓
Intent Detection
↓
Determine Query Type
↓
Analytics Service (Query Firestore)
↓
Verified Results
↓
LLM Integration
↓
Natural Language Response
↓
Return Answer
```

## Backend Architecture

### Layered Architecture
```
API Layer (app/api/v1/)
├── auth.py (Authentication endpoints)
├── expenses.py (Expense CRUD)
├── budgets.py (Budget management)
├── goals.py (Financial goals)
├── analytics.py (Analytics endpoints)
├── ai.py (AI features)
└── imports.py (CSV import)

Service Layer (app/services/)
├── expense_service.py (Business logic)
├── analytics_service.py (Calculations)
├── budget_service.py (Budget logic)
└── goal_service.py (Goal logic)

Repository Layer (app/repositories/)
├── expense_repository.py (Firestore operations)
├── budget_repository.py (Budget operations)
├── goal_repository.py (Goal operations)
└── analytics_repository.py (Analytics queries)

AI Layer (app/ai/)
├── categorizer.py (ML categorization)
├── anomaly_detector.py (Anomaly detection)
├── forecaster.py (Expense forecasting)
├── insights.py (Insight generation)
└── assistant.py (AI assistant)

Core Layer (app/core/)
├── config.py (Configuration)
├── firebase.py (Firebase Admin setup)
└── security.py (Auth dependencies)
```

## Frontend Architecture

### Component Structure
```
src/
├── components/
│   ├── common/ (Reusable components)
│   ├── charts/ (Chart components)
│   ├── forms/ (Form components)
│   └── ai/ (AI-related components)
├── pages/
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── Expenses.tsx
│   ├── AddExpense.tsx
│   ├── Budgets.tsx
│   ├── Goals.tsx
│   ├── Analytics.tsx
│   ├── AIInsights.tsx
│   ├── AIAssistant.tsx
│   ├── ImportTransactions.tsx
│   ├── Profile.tsx
│   └── AdminDashboard.tsx
├── layouts/
│   ├── MainLayout.tsx
│   └── AuthLayout.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useExpenses.ts
│   └── useAnalytics.ts
├── services/
│   ├── api.ts (Axios instance)
│   ├── authService.ts
│   ├── expenseService.ts
│   └── aiService.ts
├── types/
│   ├── expense.ts
│   ├── budget.ts
│   ├── goal.ts
│   └── analytics.ts
├── utils/
│   ├── formatters.ts
│   └── validators.ts
├── context/
│   └── AuthContext.tsx
├── firebase/
│   └── firebase.ts (Firebase client config)
└── App.tsx
```

## AI/ML Architecture

### Hybrid AI Approach
The system uses a hybrid approach combining:
1. **Deterministic Backend Code**: Calculations, totals, percentages, database operations
2. **Machine Learning**: Expense categorization, anomaly detection, forecasting
3. **LLMs**: Natural language explanations, insights, conversational interaction

### AI Services
- **Categorizer**: ML classifier for expense categories
- **Anomaly Detector**: Isolation Forest for unusual transactions
- **Forecaster**: Time-series prediction for future spending
- **Insights Generator**: LLM-powered financial insights
- **Assistant**: Conversational AI for financial queries

### Data isolation
- LLMs never directly access Firestore
- Backend controls all data access
- LLMs only receive pre-verified, aggregated statistics
- User data never leaves the authenticated context

## Scalability Considerations

### Firestore
- Automatic scaling
- Subcollection structure for user data isolation
- Composite indexes for complex queries
- Pagination for large datasets

### FastAPI
- Async support for high concurrency
- Connection pooling
- Rate limiting on API endpoints
- Caching for expensive computations

### AI/ML
- Model versioning
- Cached predictions where appropriate
- Batch processing for bulk operations
- Feature of Ollama for local inference

## Development vs Production

### Development
- Firebase Emulator Suite (Auth, Firestore, Storage)
- Local FastAPI server
- Vite dev server
- Hot module replacement
- Local LLM (Ollama) for AI features

### Production
- Real Firebase project
- Cloud-run or containerized FastAPI
- Built React frontend
- Cloud LLM API or self-hosted Ollama
- Monitoring and logging
- Error tracking

## Why This Architecture?

### Firestore
- Serverless, auto-scaling NoSQL database
- Real-time sync capabilities
- Built-in security rules
- Offline support
- Strong Firebase ecosystem integration

### Firebase Authentication
- Enterprise-grade auth
- Multiple providers (Email, Google)
- Secure token-based system
- Admin SDK for verification
- Built-in user management

### FastAPI
- Modern, fast Python framework
- Automatic API documentation
- Type safety with Pydantic
- Async support
- Easy testing

### Isolation Forest
- Effective anomaly detection
- Handles high-dimensional data
- No labeled data required
- Explainable anomaly scores

### LLM Integration
- Natural language understanding
- Contextual insights generation
- Conversational interface
- Flexible query handling

### Backend Calculations Before LLM
- Ensures data accuracy
- Prevents hallucinations
- Maintains security boundaries
- Provides verified statistics
- LLM focuses on explanation, not calculation
