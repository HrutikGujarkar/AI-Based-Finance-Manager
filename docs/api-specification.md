# API Specification

## Overview
RESTful API built with FastAPI, secured with Firebase Authentication. All protected endpoints require a valid Firebase ID token in the Authorization header.

## Base URL
- Development: `http://localhost:8000`
- Production: `https://api.yourdomain.com`

## API Version
- Current version: `v1`
- Base path: `/api/v1`

## Authentication

### Firebase ID Token
All protected endpoints require:
```
Authorization: Bearer <firebase_id_token>
```

### Token Verification Flow
1. Frontend obtains ID token from Firebase Authentication
2. Frontend includes token in Authorization header
3. FastAPI verifies token using Firebase Admin SDK
4. Extracts Firebase UID from verified token
5. Authorizes request based on UID and role

### Public Endpoints
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/reset-password` - Password reset
- `GET /api/v1/health` - Health check

### Protected Endpoints
All other endpoints require valid Firebase ID token.

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": { ... }
  }
}
```

### Pagination Response
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

## Endpoints

### Authentication

#### POST /api/v1/auth/register
Register a new user account.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "currency": "INR"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "userId": "firebase_uid",
    "email": "user@example.com",
    "name": "John Doe",
    "currency": "INR",
    "role": "user"
  },
  "message": "User registered successfully"
}
```

**Errors**:
- `400` - Invalid input
- `409` - Email already exists

---

#### POST /api/v1/auth/login
Login with email and password.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "idToken": "firebase_id_token",
    "refreshToken": "firebase_refresh_token",
    "userId": "firebase_uid",
    "email": "user@example.com"
  },
  "message": "Login successful"
}
```

**Errors**:
- `400` - Invalid credentials
- `401` - Authentication failed

---

#### POST /api/v1/auth/google
Login with Google OAuth.

**Request Body**:
```json
{
  "idToken": "google_id_token"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "idToken": "firebase_id_token",
    "refreshToken": "firebase_refresh_token",
    "userId": "firebase_uid",
    "email": "user@example.com",
    "name": "John Doe",
    "isNewUser": false
  },
  "message": "Google login successful"
}
```

---

#### POST /api/v1/auth/reset-password
Request password reset email.

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

#### POST /api/v1/auth/verify-token
Verify Firebase ID token (for frontend token refresh).

**Request Headers**:
```
Authorization: Bearer <firebase_id_token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "uid": "firebase_uid",
    "email": "user@example.com",
    "emailVerified": true,
    "role": "user"
  }
}
```

---

### Users

#### GET /api/v1/users/me
Get current user profile.

**Request Headers**:
```
Authorization: Bearer <firebase_id_token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "userId": "firebase_uid",
    "name": "John Doe",
    "email": "user@example.com",
    "currency": "INR",
    "role": "user",
    "createdAt": "2026-09-19T10:00:00Z",
    "updatedAt": "2026-09-19T10:00:00Z"
  }
}
```

---

#### PUT /api/v1/users/me
Update current user profile.

**Request Headers**:
```
Authorization: Bearer <firebase_id_token>
```

**Request Body**:
```json
{
  "name": "John Updated",
  "currency": "USD"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "userId": "firebase_uid",
    "name": "John Updated",
    "email": "user@example.com",
    "currency": "USD",
    "role": "user",
    "updatedAt": "2026-09-19T11:00:00Z"
  },
  "message": "Profile updated successfully"
}
```

---

### Expenses

#### POST /api/v1/expenses
Create a new expense.

**Request Headers**:
```
Authorization: Bearer <firebase_id_token>
```

**Request Body**:
```json
{
  "amount": 450,
  "currency": "INR",
  "category": "Food",
  "subcategory": "Food Delivery",
  "merchant": "Swiggy",
  "description": "Dinner",
  "paymentMethod": "UPI",
  "transactionDate": "2026-09-19T20:00:00Z"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "expenseId": "expense_document_id",
    "amount": 450,
    "currency": "INR",
    "category": "Food",
    "subcategory": "Food Delivery",
    "merchant": "Swiggy",
    "description": "Dinner",
    "paymentMethod": "UPI",
    "transactionDate": "2026-09-19T20:00:00Z",
    "aiCategorized": false,
    "aiConfidence": 0,
    "isAnomaly": false,
    "createdAt": "2026-09-19T20:00:00Z",
    "updatedAt": "2026-09-19T20:00:00Z"
  },
  "message": "Expense created successfully"
}
```

---

#### GET /api/v1/expenses
Get user's expenses with filtering and pagination.

**Request Headers**:
```
Authorization: Bearer <firebase_id_token>
```

**Query Parameters**:
- `page` (optional, default: 1)
- `limit` (optional, default: 20, max: 100)
- `category` (optional)
- `startDate` (optional, ISO 8601)
- `endDate` (optional, ISO 8601)
- `paymentMethod` (optional)
- `merchant` (optional)
- `sortBy` (optional, default: "transactionDate")
- `sortOrder` (optional, default: "desc")

**Example**: `GET /api/v1/expenses?category=Food&startDate=2026-09-01&endDate=2026-09-30&page=1&limit=20`

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "expenseId": "expense_id_1",
      "amount": 450,
      "currency": "INR",
      "category": "Food",
      "subcategory": "Food Delivery",
      "merchant": "Swiggy",
      "description": "Dinner",
      "paymentMethod": "UPI",
      "transactionDate": "2026-09-19T20:00:00Z",
      "aiCategorized": true,
      "aiConfidence": 0.94,
      "isAnomaly": false,
      "createdAt": "2026-09-19T20:00:00Z",
      "updatedAt": "2026-09-19T20:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

#### GET /api/v1/expenses/{expense_id}
Get a specific expense by ID.

**Request Headers**:
```
Authorization: Bearer <firebase_id_token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "expenseId": "expense_id",
    "amount": 450,
    "currency": "INR",
    "category": "Food",
    "subcategory": "Food Delivery",
    "merchant": "Swiggy",
    "description": "Dinner",
    "paymentMethod": "UPI",
    "transactionDate": "2026-09-19T20:00:00Z",
    "aiCategorized": true,
    "aiConfidence": 0.94,
    "isAnomaly": false,
    "createdAt": "2026-09-19T20:00:00Z",
    "updatedAt": "2026-09-19T20:00:00Z"
  }
}
```

**Errors**:
- `404` - Expense not found
- `403` - Access denied (not user's expense)

---

#### PUT /api/v1/expenses/{expense_id}
Update an existing expense.

**Request Headers**:
```
Authorization: Bearer <firebase_id_token>
```

**Request Body**:
```json
{
  "amount": 500,
  "category": "Food",
  "subcategory": "Dining Out",
  "merchant": "Restaurant",
  "description": "Updated dinner",
  "paymentMethod": "Credit Card"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "expenseId": "expense_id",
    "amount": 500,
    "currency": "INR",
    "category": "Food",
    "subcategory": "Dining Out",
    "merchant": "Restaurant",
    "description": "Updated dinner",
    "paymentMethod": "Credit Card",
    "transactionDate": "2026-09-19T20:00:00Z",
    "aiCategorized": false,
    "aiConfidence": 0,
    "isAnomaly": false,
    "updatedAt": "2026-09-19T21:00:00Z"
  },
  "message": "Expense updated successfully"
}
```

**Errors**:
- `404` - Expense not found
- `403` - Access denied

---

#### DELETE /api/v1/expenses/{expense_id}
Delete an expense.

**Request Headers**:
```
Authorization: Bearer <firebase_id_token>
```

**Response**:
```json
{
  "success": true,
  "message": "Expense deleted successfully"
}
```

**Errors**:
- `404` - Expense not found
- `403` - Access denied

---

### Budgets

#### POST /api/v1/budgets
Create a new budget.

**Request Headers**:
```
Authorization: Bearer <firebase_id_token>
```

**Request Body**:
```json
{
  "category": "Food",
  "amount": 8000,
  "currency": "INR",
  "period": "monthly",
  "startDate": "2026-09-01T00:00:00Z",
  "endDate": "2026-09-30T23:59:59Z",
  "alertThreshold": 0.75
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "budgetId": "budget_id",
    "category": "Food",
    "amount": 8000,
    "currency": "INR",
    "period": "monthly",
    "startDate": "2026-09-01T00:00:00Z",
    "endDate": "2026-09-30T23:59:59Z",
    "spent": 0,
    "remaining": 8000,
    "percentageUsed": 0,
    "alertThreshold": 0.75,
    "isActive": true,
    "createdAt": "2026-09-19T10:00:00Z",
    "updatedAt": "2026-09-19T10:00:00Z"
  },
  "message": "Budget created successfully"
}
```

---

#### GET /api/v1/budgets
Get user's budgets.

**Request Headers**:
```
Authorization: Bearer <firebase_id_token>
```

**Query Parameters**:
- `isActive` (optional, boolean)
- `category` (optional)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "budgetId": "budget_id",
      "category": "Food",
      "amount": 8000,
      "currency": "INR",
      "period": "monthly",
      "startDate": "2026-09-01T00:00:00Z",
      "endDate": "2026-09-30T23:59:59Z",
      "spent": 3500,
      "remaining": 4500,
      "percentageUsed": 43.75,
      "alertThreshold": 0.75,
      "isActive": true,
      "createdAt": "2026-09-19T10:00:00Z",
      "updatedAt": "2026-09-19T10:00:00Z"
    }
  ]
}
```

---

#### GET /api/v1/budgets/{budget_id}
Get a specific budget.

**Request Headers**:
```
Authorization: Bearer <firebase_id_token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "budgetId": "budget_id",
    "category": "Food",
    "amount": 8000,
    "currency": "INR",
    "period": "monthly",
    "startDate": "2026-09-01T00:00:00Z",
    "endDate": "2026-09-30T23:59:59Z",
    "spent": 3500,
    "remaining": 4500,
    "percentageUsed": 43.75,
    "alertThreshold": 0.75,
    "isActive": true,
    "createdAt": "2026-09-19T10:00:00Z",
    "updatedAt": "2026-09-19T10:00:00Z"
  }
}
```

---

#### PUT /api/v1/budgets/{budget_id}
Update a budget.

**Request Headers**:
```
Authorization: Bearer <firebase_id_token>
```

**Request Body**:
```json
{
  "amount": 10000,
  "alertThreshold": 0.80
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "budgetId": "budget_id",
    "amount": 10000,
    "spent": 3500,
    "remaining": 6500,
    "percentageUsed": 35,
    "alertThreshold": 0.80,
    "updatedAt": "2026-09-19T11:00:00Z"
  },
  "message": "Budget updated successfully"
}
```

---

#### DELETE /api/v1/budgets/{budget_id}
Delete a budget.

**Request Headers**:
```
Authorization: Bearer <firebase_id_token>
```

**Response**:
```json
{
  "success": true,
  "message": "Budget deleted successfully"
}
```

---

### Goals

#### POST /api/v1/goals
Create a new financial goal.

**Request Headers**:
```
Authorization: Bearer <firebase_id_token>
```

**Request Body**:
```json
{
  "name": "Emergency Fund",
  "targetAmount": 100000,
  "currency": "INR",
  "targetDate": "2027-03-01T00:00:00Z",
  "category": "Savings"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "goalId": "goal_id",
    "name": "Emergency Fund",
    "targetAmount": 100000,
    "currentAmount": 0,
    "currency": "INR",
    "targetDate": "2027-03-01T00:00:00Z",
    "category": "Savings",
    "status": "active",
    "progress": 0,
    "remaining": 100000,
    "monthlyContribution": 14285.71,
    "createdAt": "2026-09-19T10:00:00Z",
    "updatedAt": "2026-09-19T10:00:00Z"
  },
  "message": "Goal created successfully"
}
```

---

#### GET /api/v1/goals
Get user's goals.

**Request Headers**:
```
Authorization: Bearer <firebase_id_token>
```

**Query Parameters**:
- `status` (optional: "active", "completed", "paused")
- `category` (optional)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "goalId": "goal_id",
      "name": "Emergency Fund",
      "targetAmount": 100000,
      "currentAmount": 35000,
      "currency": "INR",
      "targetDate": "2027-03-01T00:00:00Z",
      "category": "Savings",
      "status": "active",
      "progress": 35,
      "remaining": 65000,
      "monthlyContribution": 14285.71,
      "createdAt": "2026-09-19T10:00:00Z",
      "updatedAt": "2026-09-19T10:00:00Z"
    }
  ]
}
```

---

#### PUT /api/v1/goals/{goal_id}
Update a goal.

**Request Headers**:
```
Authorization: Bearer <firebase_id_token>
```

**Request Body**:
```json
{
  "currentAmount": 40000,
  "status": "active"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "goalId": "goal_id",
    "currentAmount": 40000,
    "progress": 40,
    "remaining": 60000,
    "monthlyContribution": 12000,
    "updatedAt": "2026-09-19T11:00:00Z"
  },
  "message": "Goal updated successfully"
}
```

---

#### DELETE /api/v1/goals/{goal_id}
Delete a goal.

**Request Headers**:
```
Authorization: Bearer <firebase_id_token>
```

**Response**:
```json
{
  "success": true,
  "message": "Goal deleted successfully"
}
```

---

### Analytics

#### GET /api/v1/analytics/summary
Get spending summary analytics.

**Request Headers**:
```
Authorization: Bearer <firebase_id_token>
```

**Query Parameters**:
- `period` (optional: "week", "month", "year", default: "month")
- `startDate` (optional, ISO 8601)
- `endDate` (optional, ISO 8601)

**Response**:
```json
{
  "success": true,
  "data": {
    "period": "month",
    "startDate": "2026-09-01T00:00:00Z",
    "endDate": "2026-09-30T23:59:59Z",
    "totalSpent": 24850,
    "currency": "INR",
    "transactionCount": 45,
    "averageTransaction": 552.22,
    "averageDaily": 828.33,
    "monthOverMonthChange": 8.4,
    "largestTransaction": {
      "amount": 2500,
      "merchant": "Amazon",
      "category": "Shopping",
      "date": "2026-09-15T10:00:00Z"
    },
    "budgetUtilization": {
      "totalBudget": 35000,
      "totalSpent": 24850,
      "percentageUsed": 71
    }
  }
}
```

---

#### GET /api/v1/analytics/categories
Get category breakdown analytics.

**Request Headers**:
```
Authorization: Bearer <firebase_id_token>
```

**Query Parameters**:
- `period` (optional, default: "month")
- `startDate` (optional)
- `endDate` (optional)

**Response**:
```json
{
  "success": true,
  "data": {
    "period": "month",
    "categories": [
      {
        "category": "Food",
        "amount": 8500,
        "percentage": 34.2,
        "transactionCount": 18
      },
      {
        "category": "Transport",
        "amount": 4500,
        "percentage": 18.1,
        "transactionCount": 12
      },
      {
        "category": "Shopping",
        "amount": 6200,
        "percentage": 24.9,
        "transactionCount": 8
      }
    ]
  }
}
```

---

#### GET /api/v1/analytics/trends
Get spending trends over time.

**Request Headers**:
```
Authorization: Bearer <firebase_id_token>
```

**Query Parameters**:
- `period` (optional: "week", "month", "year", default: "month")
- `groupBy` (optional: "day", "week", "month", default: "day")

**Response**:
```json
{
  "success": true,
  "data": {
    "period": "month",
    "groupBy": "day",
    "trends": [
      {
        "date": "2026-09-01",
        "amount": 1250,
        "transactionCount": 3
      },
      {
        "date": "2026-09-02",
        "amount": 890,
        "transactionCount": 2
      }
    ]
  }
}
```

---

#### GET /api/v1/analytics/merchants
Get top merchants analytics.

**Request Headers**:
```
Authorization: Bearer <firebase_id_token>
```

**Query Parameters**:
- `period` (optional, default: "month")
- `limit` (optional, default: 10)

**Response**:
```json
{
  "success": true,
  "data": {
    "period": "month",
    "merchants": [
      {
        "merchant": "Swiggy",
        "amount": 3500,
        "transactionCount": 8,
        "category": "Food"
      },
      {
        "merchant": "Amazon",
        "amount": 4200,
        "transactionCount": 5,
        "category": "Shopping"
      }
    ]
  }
}
```

---

#### GET /api/v1/analytics/payment-methods
Get payment method breakdown.

**Request Headers**:
```
Authorization: Bearer <firebase_id_token>
```

**Query Parameters**:
- `period` (optional, default: "month")

**Response**:
```json
{
  "success": true,
  "data": {
    "period": "month",
    "paymentMethods": [
      {
        "paymentMethod": "UPI",
        "amount": 12500,
        "percentage": 50.3,
        "transactionCount": 25
      },
      {
        "paymentMethod": "Credit Card",
        "amount": 8500,
        "percentage": 34.2,
        "transactionCount": 12
      }
    ]
  }
}
```

---

### AI Features

#### POST /api/v1/ai/categorize
Categorize an expense using AI.

**Request Headers**:
```
Authorization: Bearer <firebase_id_token>
```

**Request Body**:
```json
{
  "description": "Swiggy dinner",
  "merchant": "Swiggy",
  "amount": 450
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "category": "Food",
    "subcategory": "Food Delivery",
    "confidence": 0.94,
    "model": "ml_classifier_v1"
  }
}
```

---

#### POST /api/v1/ai/insights
Generate AI financial insights.

**Request Headers**:
```
Authorization: Bearer <firebase_id_token>
```

**Query Parameters**:
- `period` (optional, default: "month")

**Response**:
```json
{
  "success": true,
  "data": {
    "insights": [
      {
        "type": "spending_increase",
        "title": "Food spending increased",
        "description": "Your food spending increased by 18% compared with last month.",
        "category": "Food",
        "priority": "medium",
        "data": {
          "currentMonth": 8500,
          "previousMonth": 7200,
          "change": 18.1
        }
      },
      {
        "type": "budget_alert",
        "title": "Approaching budget limit",
        "description": "You are at 92% of your shopping budget for this month.",
        "category": "Shopping",
        "priority": "high",
        "data": {
          "budget": 4000,
          "spent": 3680,
          "percentageUsed": 92
        }
      }
    ]
  }
}
```

---

#### POST /api/v1/ai/assistant
Ask AI assistant a financial question.

**Request Headers**:
```
Authorization: Bearer <firebase_id_token>
```

**Request Body**:
```json
{
  "question": "How much did I spend on food last month?"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "answer": "You spent ₹8,500 on food last month across 18 transactions. This represents 34.2% of your total spending.",
    "queryType": "category_spending",
    "data": {
      "category": "Food",
      "amount": 8500,
      "transactionCount": 18,
      "percentage": 34.2
    }
  }
}
```

---

#### GET /api/v1/ai/anomalies
Get detected anomalies.

**Request Headers**:
```
Authorization: Bearer <firebase_id_token>
```

**Query Parameters**:
- `acknowledged` (optional, boolean)
- `limit` (optional, default: 20)

**Response**:
```json
{
  "success": true,
  "data": {
    "anomalies": [
      {
        "anomalyId": "anomaly_id",
        "expenseId": "expense_id",
        "amount": 8500,
        "category": "Food",
        "merchant": "Restaurant",
        "anomalyScore": 0.87,
        "reason": "This transaction is significantly higher than your historical food spending.",
        "isAcknowledged": false,
        "detectedAt": "2026-09-19T20:00:00Z"
      }
    ]
  }
}
```

---

#### POST /api/v1/ai/anomalies/{anomaly_id}/acknowledge
Acknowledge an anomaly.

**Request Headers**:
```
Authorization: Bearer <firebase_id_token>
```

**Request Body**:
```json
{
  "isFalsePositive": false
}
```

**Response**:
```json
{
  "success": true,
  "message": "Anomaly acknowledged successfully"
}
```

---

#### GET /api/v1/ai/forecasts
Get expense forecasts.

**Request Headers**:
```
Authorization: Bearer <firebase_id_token>
```

**Query Parameters**:
- `period` (optional, format: "YYYY-MM")

**Response**:
```json
{
  "success": true,
  "data": {
    "forecasts": [
      {
        "forecastId": "forecast_id",
        "period": "2026-10",
        "predictedAmount": 26100,
        "currency": "INR",
        "confidence": 0.78,
        "model": "random_forest_v1",
        "generatedAt": "2026-09-19T10:00:00Z"
      }
    ]
  }
}
```

---

### Import

#### POST /api/v1/import/csv
Import transactions from CSV file.

**Request Headers**:
```
Authorization: Bearer <firebase_id_token>
Content-Type: multipart/form-data
```

**Request Body**:
- `file`: CSV file
- `aiCategorize` (optional, boolean, default: true)

**Response**:
```json
{
  "success": true,
  "data": {
    "importId": "import_id",
    "totalRows": 100,
    "importedRows": 95,
    "duplicateRows": 3,
    "invalidRows": 2,
    "aiCategorizedRows": 95,
    "fileUrl": "gs://bucket/path/to/file.csv",
    "importedAt": "2026-09-19T10:00:00Z"
  },
  "message": "CSV import completed successfully"
}
```

---

#### GET /api/v1/import/history
Get import history.

**Request Headers**:
```
Authorization: Bearer <firebase_id_token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "imports": [
      {
        "importId": "import_id",
        "totalRows": 100,
        "importedRows": 95,
        "duplicateRows": 3,
        "invalidRows": 2,
        "fileUrl": "gs://bucket/path/to/file.csv",
        "importedAt": "2026-09-19T10:00:00Z"
      }
    ]
  }
}
```

---

### Admin (Admin Only)

#### GET /api/v1/admin/users
Get all users (admin only).

**Request Headers**:
```
Authorization: Bearer <firebase_id_token>
```

**Query Parameters**:
- `page` (optional)
- `limit` (optional)

**Response**:
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "userId": "user_id",
        "name": "John Doe",
        "email": "user@example.com",
        "role": "user",
        "createdAt": "2026-09-19T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  }
}
```

---

#### PUT /api/v1/admin/users/{user_id}/role
Update user role (admin only).

**Request Headers**:
```
Authorization: Bearer <firebase_id_token>
```

**Request Body**:
```json
{
  "role": "admin"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "userId": "user_id",
    "role": "admin"
  },
  "message": "User role updated successfully"
}
```

---

#### GET /api/v1/admin/analytics
Get system-wide analytics (admin only).

**Request Headers**:
```
Authorization: Bearer <firebase_id_token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "activeUsers": 120,
    "totalTransactions": 50000,
    "totalSpendingVolume": 25000000,
    "aiCategorizationCount": 45000,
    "anomalyDetectionCount": 500,
    "csvImports": 300,
    "systemErrors": 5
  }
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `INVALID_TOKEN` | Invalid or expired Firebase ID token |
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `VALIDATION_ERROR` | Input validation failed |
| `DUPLICATE_ENTRY` | Resource already exists |
| `INTERNAL_ERROR` | Internal server error |
| `SERVICE_UNAVAILABLE` | Service temporarily unavailable |
| `RATE_LIMIT_EXCEEDED` | Too many requests |

## Rate Limiting

- Standard endpoints: 100 requests per minute
- AI endpoints: 20 requests per minute
- Import endpoints: 5 requests per hour

## CORS

Allowed origins in development:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (React dev server)

Production origins configured in environment variables.

## Webhooks (Future)

### Budget Alert Webhook
Triggered when budget usage exceeds threshold.

### Anomaly Detection Webhook
Triggered when new anomaly is detected.

### Goal Completion Webhook
Triggered when goal is completed.
