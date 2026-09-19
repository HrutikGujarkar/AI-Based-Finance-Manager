# AI Expense & Financial Intelligence System

A production-grade, full-stack AI-powered financial management application that enables users to track expenses, automatically categorize transactions using machine learning, detect unusual spending patterns, forecast future expenses, manage budgets and financial goals, and receive personalized AI-driven financial insights.

## 🎯 Project Overview

This is **NOT** a simple CRUD application or basic chatbot. It's a real-world full-stack AI application demonstrating:

- **Full-stack Development**: React + TypeScript frontend, FastAPI backend
- **Firebase Integration**: Authentication, Firestore, Cloud Storage
- **AI/ML Capabilities**: Expense categorization, anomaly detection, forecasting
- **LLM Integration**: AI insights and financial assistant
- **Data Analytics**: Comprehensive financial analytics and dashboards
- **Security**: Firebase Authentication, Firestore security rules, token verification

## 🏗️ Architecture

### High-Level Architecture
```
React Frontend
    ↓
Firebase Authentication (Client SDK)
    ↓
FastAPI Backend (with Firebase Admin SDK)
    ↓
Firestore Database + Cloud Storage
    ↓
AI/ML Services (Categorization, Anomaly Detection, Forecasting, LLM)
```

### Technology Stack

**Frontend**:
- React 18+ with TypeScript
- Vite (build tool)
- Tailwind CSS
- React Router
- Recharts (data visualization)
- Axios (HTTP client)
- Firebase Client SDK

**Backend**:
- Python 3.11+
- FastAPI
- Pydantic (validation)
- Firebase Admin SDK
- Uvicorn (ASGI server)

**Database & Storage**:
- Firebase Cloud Firestore (NoSQL database)
- Firebase Cloud Storage (file storage)
- Firebase Authentication (user auth)

**AI/ML**:
- pandas, numpy (data processing)
- scikit-learn (machine learning)
- sentence-transformers (semantic similarity)
- LLM Integration (Ollama/Cloud API)

**Infrastructure**:
- Docker (containerization)
- Firebase Emulator Suite (local development)
- Environment variables (configuration)

## 📚 Documentation

Comprehensive documentation has been created in the `/docs` directory:

### 1. [Architecture](docs/architecture.md)
Complete system architecture including:
- High-level architecture diagram
- Technology stack details
- Security architecture
- Data flow patterns
- Backend layered architecture
- Frontend component structure
- AI/ML architecture
- Scalability considerations

### 2. [Firestore Schema](docs/firestore-schema.md)
Detailed database schema including:
- Users collection structure
- Expenses subcollection with all fields
- Budgets subcollection
- Goals subcollection
- Insights, Anomalies, Forecasts, Notifications subcollections
- Global collections (Categories, Learning Resources, Admin Logs)
- Query patterns and indexing strategy
- Data consistency and retention policies

### 3. [API Specification](docs/api-specification.md)
Complete REST API documentation including:
- Authentication endpoints
- User management
- Expense CRUD operations
- Budget and Goal management
- Analytics endpoints
- AI features (categorization, insights, assistant, anomalies, forecasts)
- CSV import
- Admin endpoints
- Request/response examples
- Error codes and rate limiting

### 4. [AI Architecture](docs/ai-architecture.md)
Comprehensive AI/ML design including:
- Design principles (separation of concerns, data security, accuracy first)
- Expense categorizer (ML classifier, rule-based fallback)
- Anomaly detector (Isolation Forest, statistical methods)
- Expense forecaster (Linear Regression, Random Forest, ARIMA)
- AI insights generator (LLM integration)
- AI financial assistant (intent detection, query planning)
- LLM integration (Ollama, Cloud APIs)
- Model lifecycle (training, deployment, monitoring, retraining)
- Ethics and privacy considerations

### 5. [Security Rules](docs/security-rules.md)
Firestore security rules including:
- Security principles
- Complete security rules implementation
- Detailed rule explanations for each collection
- Query security requirements
- Testing strategies
- Deployment instructions
- Best practices and common patterns
- Monitoring and compliance

### 6. [Development Plan](docs/development-plan.md)
20-phase development roadmap including:
- Phase-by-phase implementation plan
- Detailed tasks for each phase
- Deliverables and estimated time
- Dependencies between phases
- Project structure after completion
- Total estimated time (120-220 hours)

## 🚀 Development Phases

The project will be implemented in 20 phases:

1. ✅ **Architecture + Documentation** (COMPLETED)
2. **Firebase Project Configuration**
3. **Firebase Authentication**
4. **Firestore Database Structure + Security Rules**
5. **FastAPI + Firebase Admin SDK**
6. **Expense CRUD**
7. **Budgets + Financial Goals**
8. **Analytics APIs**
9. **React Frontend**
10. **Dashboard**
11. **AI Expense Categorization**
12. **Anomaly Detection**
13. **Expense Forecasting**
14. **AI Financial Insights**
15. **AI Financial Assistant**
16. **CSV Import + Cloud Storage**
17. **Admin Dashboard**
18. **Testing**
19. **Firebase Emulator Testing**
20. **Production Deployment Preparation**

## 🔑 Key Features

### Core Features
- **Expense Management**: Create, read, update, delete expenses
- **Budget Management**: Set budgets per category, track utilization
- **Financial Goals**: Create savings goals, track progress
- **Analytics**: Comprehensive spending analytics with charts

### AI Features
- **Automatic Categorization**: ML-based expense categorization
- **Anomaly Detection**: Identify unusual spending patterns
- **Expense Forecasting**: Predict future spending
- **AI Insights**: Natural language financial insights
- **AI Assistant**: Conversational interface for financial queries

### Advanced Features
- **CSV Import**: Bulk import transactions from CSV files
- **Cloud Storage**: Store files in Firebase Cloud Storage
- **Admin Dashboard**: System-wide analytics and user management
- **Real-time Updates**: Firestore real-time sync capabilities

## 🔒 Security Architecture

### Authentication Flow
1. User authenticates via Firebase Authentication
2. Firebase Client SDK returns ID token
3. Frontend includes ID token in Authorization header
4. FastAPI verifies token using Firebase Admin SDK
5. Extracts Firebase UID and authorizes request
6. Access Firestore data scoped to authenticated user

### Security Layers
- **Firebase Authentication**: User authentication
- **Firebase ID Token Verification**: Backend token validation
- **Firestore Security Rules**: Database-level access control
- **Role-Based Access Control**: User vs Admin roles
- **Input Validation**: Pydantic schema validation
- **CORS**: Configured for allowed origins
- **Environment Variables**: Secrets never in code

## 🤖 AI Engineering Principles

### Hybrid AI Approach
- **Deterministic Code**: Calculations, totals, percentages, database operations
- **Machine Learning**: Expense categorization, anomaly detection, forecasting
- **LLMs**: Natural language explanations, insights, conversational interaction

### Data Isolation
- LLMs never directly access Firestore
- Backend controls all data access
- LLMs only receive pre-verified, aggregated statistics
- User data never leaves authenticated context

### Why This Architecture?
- **Firestore**: Serverless, auto-scaling, real-time sync, security rules
- **Firebase Authentication**: Enterprise-grade auth, multiple providers
- **FastAPI**: Modern, fast, automatic documentation, type safety
- **Isolation Forest**: Effective anomaly detection, no labeled data required
- **LLM Integration**: Natural language understanding, contextual insights
- **Backend Calculations Before LLM**: Ensures accuracy, prevents hallucinations

## 📊 Firestore Schema Summary

### User-Specific Collections
- `users/{userId}/expenses/{expenseId}` - User expenses
- `users/{userId}/budgets/{budgetId}` - User budgets
- `users/{userId}/goals/{goalId}` - User financial goals
- `users/{userId}/insights/{insightId}` - AI-generated insights
- `users/{userId}/anomalies/{anomalyId}` - Detected anomalies
- `users/{userId}/forecasts/{forecastId}` - Expense forecasts
- `users/{userId}/notifications/{notificationId}` - User notifications

### Global Collections
- `categories/{categoryId}` - Available expense categories
- `learning_resources/{resourceId}` - Financial education resources
- `admin_logs/{logId}` - Admin action logs

## 🛠️ Getting Started (Next Steps)

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- Firebase CLI
- Google account (for Firebase)
- Ollama (optional, for local LLM)

### Phase 2: Firebase Project Configuration
The next phase involves:
1. Creating a Firebase project
2. Enabling Authentication, Firestore, and Cloud Storage
3. Configuring Firebase Emulator Suite
4. Generating service account key
5. Setting up environment variables

### Local Development
Once Phase 2 is complete:
1. Start Firebase Emulator: `firebase emulators:start`
2. Start FastAPI backend: `cd backend && uvicorn app.main:app --reload`
3. Start React frontend: `cd frontend && npm run dev`

## 📈 Project Status

**Current Phase**: PHASE 5 - FastAPI + Firebase Admin SDK (🔄 ~40% Complete)

**Completed**:
- ✅ PHASE 1: Architecture + Documentation
- ✅ PHASE 2: Firebase Project Configuration (Firebase project created, config files ready)
- ✅ PHASE 3: Firebase Authentication (Frontend complete, auth pages working)
- 🔄 PHASE 5: FastAPI + Firebase Admin SDK (Backend structure, core components implemented)

**Current Progress**:
- ✅ React + TypeScript + Vite frontend initialized
- ✅ Firebase client SDK configured with actual credentials
- ✅ Authentication context implemented
- ✅ Login, Register, Reset Password pages created
- ✅ AuthLayout component created
- ✅ React Router configured with protected routes
- ✅ Tailwind CSS integrated
- ✅ FastAPI backend structure created
- ✅ Firebase Admin SDK integration
- ✅ Configuration management (config.py)
- ✅ Security middleware (token verification)
- ✅ CORS configuration
- ✅ Health check endpoint

**Immediate Next Steps**:
1. Complete Firebase Console setup (Authentication, Firestore, Storage)
2. Generate service account key
3. Complete Phase 5 backend (models, repositories, services, API endpoints)
4. Test authentication with real Firebase project

**Next Phase**: PHASE 6 - Expense CRUD

## 🎓 Learning Outcomes

This project demonstrates:
- Full-stack development with React and FastAPI
- Firebase integration (Auth, Firestore, Storage)
- AI/ML implementation (categorization, anomaly detection, forecasting)
- LLM integration for natural language features
- REST API design and implementation
- Database design with NoSQL
- Security best practices
- Docker containerization
- Testing strategies

Suitable for:
- GitHub portfolio
- Resume project
- Technical interview
- AI/ML interview
- Full-stack interview
- System design discussion

## 📝 License

This project is for educational and portfolio purposes.

## 🤝 Contributing

This is a personal project for portfolio development. Follow the development plan in `/docs/development-plan.md` for implementation guidance.

---

**Note**: This is a comprehensive, production-style application. Do not attempt to build everything at once. Follow the phased development plan in `/docs/development-plan.md` for systematic implementation.
