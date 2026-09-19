# Firestore Database Schema

## Overview
Cloud Firestore is a NoSQL document database that stores data in documents organized into collections. This schema is designed for scalability, security, and efficient querying for the AI Expense & Financial Intelligence System.

## Collection Structure

### Users Collection
**Path**: `users/{userId}`

**Document Structure**:
```typescript
{
  name: string,              // User's full name
  email: string,             // User's email address
  currency: string,          // Default currency (e.g., "INR", "USD")
  role: string,              // "user" or "admin"
  createdAt: Timestamp,      // Account creation timestamp
  updatedAt: Timestamp       // Last update timestamp
}
```

**Indexes**:
- None required (primary key is userId)

**Security Rules**:
- Users can read/write their own document
- Admins can read all user documents
- Role can only be changed by admin via backend

---

### Expenses Subcollection
**Path**: `users/{userId}/expenses/{expenseId}`

**Document Structure**:
```typescript
{
  amount: number,                    // Transaction amount (positive for expenses)
  currency: string,                 // Currency code (e.g., "INR")
  category: string,                 // Main category (e.g., "Food", "Transport")
  subcategory: string,              // Subcategory (e.g., "Food Delivery", "Cab")
  merchant: string,                 // Merchant name (e.g., "Swiggy", "Amazon")
  description: string,              // Transaction description
  paymentMethod: string,            // Payment method (e.g., "UPI", "Credit Card")
  transactionDate: Timestamp,        // Date of transaction
  aiCategorized: boolean,            // Whether AI categorized this expense
  aiConfidence: number,              // AI confidence score (0-1)
  isAnomaly: boolean,                // Flagged as unusual transaction
  anomalyScore: number,              // Anomaly detection score (0-1)
  anomalyReason: string,            // Reason for anomaly flag
  createdAt: Timestamp,              // Document creation timestamp
  updatedAt: Timestamp               // Last update timestamp
}
```

**Indexes**:
- Composite index: `transactionDate` (DESC), `category`
- Composite index: `transactionDate` (DESC), `paymentMethod`
- Composite index: `category`, `transactionDate` (DESC)
- Composite index: `merchant`, `transactionDate` (DESC)

**Security Rules**:
- Users can read/write their own expenses
- Queries must include `userId == request.auth.uid`

---

### Budgets Subcollection
**Path**: `users/{userId}/budgets/{budgetId}`

**Document Structure**:
```typescript
{
  category: string,              // Budget category (e.g., "Food", "Transport")
  amount: number,                // Budget amount
  currency: string,              // Currency code
  period: string,                // "monthly", "weekly", "yearly"
  startDate: Timestamp,          // Budget start date
  endDate: Timestamp,            // Budget end date
  spent: number,                 // Amount spent (calculated)
  remaining: number,             // Amount remaining (calculated)
  percentageUsed: number,        // Percentage used (calculated)
  alertThreshold: number,        // Alert threshold (e.g., 0.75 for 75%)
  isActive: boolean,            // Whether budget is active
  createdAt: Timestamp,          // Document creation timestamp
  updatedAt: Timestamp          // Last update timestamp
}
```

**Indexes**:
- Composite index: `isActive`, `category`
- Composite index: `startDate` (DESC), `endDate` (DESC)

**Security Rules**:
- Users can read/write their own budgets
- Backend calculates spent, remaining, percentageUsed

---

### Goals Subcollection
**Path**: `users/{userId}/goals/{goalId}`

**Document Structure**:
```typescript
{
  name: string,                  // Goal name (e.g., "Emergency Fund")
  targetAmount: number,          // Target amount
  currentAmount: number,         // Current saved amount
  currency: string,              // Currency code
  targetDate: Timestamp,        // Target completion date
  category: string,             // Goal category (e.g., "Savings", "Investment")
  status: string,                // "active", "completed", "paused"
  progress: number,              // Progress percentage (calculated)
  remaining: number,             // Amount remaining (calculated)
  monthlyContribution: number,   // Required monthly contribution (calculated)
  createdAt: Timestamp,          // Document creation timestamp
  updatedAt: Timestamp          // Last update timestamp
}
```

**Indexes**:
- Composite index: `status`, `targetDate` (ASC)
- Composite index: `category`, `status`

**Security Rules**:
- Users can read/write their own goals
- Backend calculates progress, remaining, monthlyContribution

---

### Insights Subcollection
**Path**: `users/{userId}/insights/{insightId}`

**Document Structure**:
```typescript
{
  type: string,                  // Insight type (e.g., "spending_increase", "budget_alert")
  title: string,                 // Insight title
  description: string,           // Natural language description
  category: string,              // Related category (if applicable)
  period: string,                // Time period (e.g., "2026-09")
  data: object,                  // Supporting data (metrics, comparisons)
  priority: string,              // "low", "medium", "high"
  isRead: boolean,               // Whether user has read this insight
  generatedAt: Timestamp,        // Generation timestamp
  expiresAt: Timestamp,          // Expiration timestamp
  createdAt: Timestamp,          // Document creation timestamp
}
```

**Indexes**:
- Composite index: `isRead`, `generatedAt` (DESC)
- Composite index: `priority`, `generatedAt` (DESC)
- Composite index: `type`, `generatedAt` (DESC)

**Security Rules**:
- Users can read/write their own insights
- Insights are generated by backend AI services

---

### Anomalies Subcollection
**Path**: `users/{userId}/anomalies/{anomalyId}`

**Document Structure**:
```typescript
{
  expenseId: string,             // Reference to expense document
  amount: number,                // Anomalous amount
  currency: string,              // Currency code
  category: string,              // Expense category
  merchant: string,              // Merchant name
  anomalyScore: number,          // Anomaly detection score (0-1)
  reason: string,                // Natural language explanation
  features: object,              // Feature values used for detection
  isAcknowledged: boolean,       // Whether user acknowledged this anomaly
  isFalsePositive: boolean,      // Whether user marked as false positive
  detectedAt: Timestamp,         // Detection timestamp
  createdAt: Timestamp,          // Document creation timestamp
}
```

**Indexes**:
- Composite index: `isAcknowledged`, `detectedAt` (DESC)
- Composite index: `category`, `detectedAt` (DESC)

**Security Rules**:
- Users can read/write their own anomalies
- Anomalies are generated by backend AI services

---

### Forecasts Subcollection
**Path**: `users/{userId}/forecasts/{forecastId}`

**Document Structure**:
```typescript
{
  period: string,                // Forecast period (e.g., "2026-10")
  predictedAmount: number,       // Predicted spending amount
  currency: string,              // Currency code
  confidence: number,            // Prediction confidence (0-1)
  model: string,                 // Model used (e.g., "linear_regression", "random_forest")
  features: object,              // Features used for prediction
  historicalData: object,        // Historical data reference
  generatedAt: Timestamp,        // Generation timestamp
  actualAmount: number,          // Actual amount (filled after period ends)
  accuracy: number,              // Prediction accuracy (calculated after period ends)
  createdAt: Timestamp,          // Document creation timestamp
  updatedAt: Timestamp          // Last update timestamp
}
```

**Indexes**:
- Composite index: `period` (DESC), `generatedAt` (DESC)
- Composite index: `model`, `generatedAt` (DESC)

**Security Rules**:
- Users can read their own forecasts
- Forecasts are generated by backend AI services

---

### Notifications Subcollection
**Path**: `users/{userId}/notifications/{notificationId}`

**Document Structure**:
```typescript
{
  type: string,                  // Notification type (e.g., "budget_alert", "anomaly_detected")
  title: string,                 // Notification title
  message: string,               // Notification message
  data: object,                  // Additional data
  priority: string,              // "low", "medium", "high"
  isRead: boolean,               // Whether user has read this notification
  actionRequired: boolean,       // Whether action is required
  actionUrl: string,             // URL for action (if applicable)
  expiresAt: Timestamp,          // Expiration timestamp
  createdAt: Timestamp,          // Document creation timestamp
}
```

**Indexes**:
- Composite index: `isRead`, `createdAt` (DESC)
- Composite index: `priority`, `createdAt` (DESC)
- Composite index: `type`, `createdAt` (DESC)

**Security Rules**:
- Users can read/write their own notifications
- Notifications are generated by backend services

---

## Global Collections

### Categories Collection
**Path**: `categories/{categoryId}`

**Document Structure**:
```typescript
{
  name: string,                  // Category name (e.g., "Food")
  icon: string,                   // Icon identifier
  color: string,                 // Color code for UI
  subcategories: array,          // Array of subcategory strings
  isActive: boolean,             // Whether category is active
  createdAt: Timestamp,          // Document creation timestamp
  updatedAt: Timestamp          // Last update timestamp
}
```

**Indexes**:
- Single field index: `isActive`

**Security Rules**:
- All authenticated users can read
- Only admins can write

**Default Categories**:
- Food (Food Delivery, Groceries, Dining Out)
- Transport (Cab, Public Transport, Fuel, Parking)
- Shopping (Clothing, Electronics, Home, Other)
- Bills (Electricity, Water, Internet, Phone, Rent)
- Entertainment (Movies, Games, Streaming, Events)
- Healthcare (Medicine, Doctor, Insurance, Fitness)
- Education (Books, Courses, Tuition)
- Travel (Flights, Hotels, Activities)
- Other (Gifts, Donations, Miscellaneous)

---

### Learning Resources Collection
**Path**: `learning_resources/{resourceId}`

**Document Structure**:
```typescript
{
  title: string,                 // Resource title
  description: string,           // Resource description
  url: string,                   // Resource URL
  type: string,                  // "article", "video", "tool"
  category: string,              // Related category
  tags: array,                   // Array of tags
  isActive: boolean,             // Whether resource is active
  createdAt: Timestamp,          // Document creation timestamp
  updatedAt: Timestamp          // Last update timestamp
}
```

**Indexes**:
- Composite index: `isActive`, `category`
- Composite index: `isActive`, `type`

**Security Rules**:
- All authenticated users can read
- Only admins can write

---

### Admin Logs Collection
**Path**: `admin_logs/{logId}`

**Document Structure**:
```typescript
{
  action: string,                // Action performed (e.g., "user_role_changed")
  adminId: string,               // Admin user ID
  targetUserId: string,          // Target user ID (if applicable)
  details: object,               // Action details
  ipAddress: string,             // IP address
  userAgent: string,             // User agent
  timestamp: Timestamp,          // Action timestamp
}
```

**Indexes**:
- Composite index: `adminId`, `timestamp` (DESC)
- Composite index: `action`, `timestamp` (DESC)

**Security Rules**:
- Only admins can read
- Only backend can write

---

## Data Relationships

### Parent-Child Relationships
```
users/{userId}
├── expenses/{expenseId}
├── budgets/{budgetId}
├── goals/{goalId}
├── insights/{insightId}
├── anomalies/{anomalyId}
├── forecasts/{forecastId}
└── notifications/{notificationId}
```

### Cross-Collection References
- `expenses/{expenseId}` → `categories/{categoryId}` (via category field)
- `anomalies/{anomalyId}` → `expenses/{expenseId}` (via expenseId field)
- `insights/{insightId}` → `categories/{categoryId}` (via category field)

## Query Patterns

### Common Queries

**Get user's recent expenses**:
```javascript
db.collection('users').doc(userId)
  .collection('expenses')
  .orderBy('transactionDate', 'desc')
  .limit(50)
```

**Get expenses by date range**:
```javascript
db.collection('users').doc(userId)
  .collection('expenses')
  .where('transactionDate', '>=', startDate)
  .where('transactionDate', '<=', endDate)
  .orderBy('transactionDate', 'desc')
```

**Get expenses by category**:
```javascript
db.collection('users').doc(userId)
  .collection('expenses')
  .where('category', '==', category)
  .orderBy('transactionDate', 'desc')
```

**Get active budgets**:
```javascript
db.collection('users').doc(userId)
  .collection('budgets')
  .where('isActive', '==', true)
  .orderBy('startDate', 'desc')
```

**Get active goals**:
```javascript
db.collection('users').doc(userId)
  .collection('goals')
  .where('status', '==', 'active')
  .orderBy('targetDate', 'asc')
```

**Get unread insights**:
```javascript
db.collection('users').doc(userId)
  .collection('insights')
  .where('isRead', '==', false)
  .orderBy('generatedAt', 'desc')
```

**Get unacknowledged anomalies**:
```javascript
db.collection('users').doc(userId)
  .collection('anomalies')
  .where('isAcknowledged', '==', false)
  .orderBy('detectedAt', 'desc')
```

## Data Consistency

### Calculated Fields
The following fields are calculated by the backend and should not be updated directly by the frontend:
- `budgets.spent`
- `budgets.remaining`
- `budgets.percentageUsed`
- `goals.progress`
- `goals.remaining`
- `goals.monthlyContribution`
- `forecasts.actualAmount`
- `forecasts.accuracy`

### Update Patterns
- Atomic updates for calculated fields
- Batch writes for bulk operations
- Transactions for multi-document operations

## Indexing Strategy

### Single Field Indexes
Auto-created by Firestore for:
- All document fields (single field queries)

### Composite Indexes
Manually created for:
- Complex queries with multiple where clauses
- Queries with where + orderBy
- Queries with range filters

### Index Management
- Create indexes in Firebase Console
- Use `firebase firestore:indexes` command
- Monitor index usage and performance

## Data Retention

### Retention Policies
- **Expenses**: Keep indefinitely (user's financial history)
- **Insights**: Keep for 90 days
- **Anomalies**: Keep for 180 days
- **Notifications**: Keep for 30 days
- **Forecasts**: Keep for 365 days

### Cleanup Strategy
- Scheduled Cloud Functions to delete expired documents
- User can manually delete insights, anomalies, notifications
- Expenses and goals are permanent unless user deletes account

## Security Summary

### Access Control
- All user-specific collections: Users can only access their own data
- Global collections: Read-only for users, write-only for admins
- Admin operations: Only via backend with admin role verification

### Validation
- Backend validation for all writes
- Firestore security rules as additional layer
- Pydantic schemas for API validation

### Encryption
- Firestore automatically encrypts data at rest
- Data in transit encrypted via TLS
- Firebase handles encryption automatically
