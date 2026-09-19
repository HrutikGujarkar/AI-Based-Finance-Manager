# Firestore Security Rules

## Overview
Firestore security rules control access to your database at the document level. These rules ensure that users can only access their own data and that admin operations are properly protected.

## Security Principles

1. **User Isolation**: Users can only access their own data
2. **Authentication Required**: All write operations require authentication
3. **Role-Based Access**: Admin-only resources require admin role
4. **Validation**: Data validation on write operations
5. **Least Privilege**: Minimum required access for each operation

## Base Rules

### Basic Structure
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isValidUserData() {
      return request.resource.data.size() > 0 &&
             request.resource.data.name is string &&
             request.resource.data.email is string &&
             request.resource.data.currency is string &&
             request.resource.data.role in ['user', 'admin'];
    }
    
    function isValidExpenseData() {
      return request.resource.data.size() > 0 &&
             request.resource.data.amount is number &&
             request.resource.data.amount > 0 &&
             request.resource.data.currency is string &&
             request.resource.data.category is string &&
             request.resource.data.transactionDate is timestamp;
    }
    
    function isValidBudgetData() {
      return request.resource.data.size() > 0 &&
             request.resource.data.amount is number &&
             request.resource.data.amount > 0 &&
             request.resource.data.currency is string &&
             request.resource.data.category is string &&
             request.resource.data.period is string &&
             request.resource.data.startDate is timestamp &&
             request.resource.data.endDate is timestamp;
    }
    
    function isValidGoalData() {
      return request.resource.data.size() > 0 &&
             request.resource.data.name is string &&
             request.resource.data.targetAmount is number &&
             request.resource.data.targetAmount > 0 &&
             request.resource.data.currency is string &&
             request.resource.data.targetDate is timestamp;
    }
    
    // Collection rules
    match /users/{userId} {
      // User document rules
      allow read: if isOwner(userId) || isAdmin();
      allow write: if isOwner(userId) && 
                       isValidUserData() &&
                       !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role']);
      
      // Expenses subcollection
      match /expenses/{expenseId} {
        allow read: if isOwner(userId);
        allow create: if isOwner(userId) && isValidExpenseData();
        allow update: if isOwner(userId) && isValidExpenseData();
        allow delete: if isOwner(userId);
      }
      
      // Budgets subcollection
      match /budgets/{budgetId} {
        allow read: if isOwner(userId);
        allow create: if isOwner(userId) && isValidBudgetData();
        allow update: if isOwner(userId) && isValidBudgetData();
        allow delete: if isOwner(userId);
      }
      
      // Goals subcollection
      match /goals/{goalId} {
        allow read: if isOwner(userId);
        allow create: if isOwner(userId) && isValidGoalData();
        allow update: if isOwner(userId) && isValidGoalData();
        allow delete: if isOwner(userId);
      }
      
      // Insights subcollection
      match /insights/{insightId} {
        allow read: if isOwner(userId);
        allow create: if false; // Created by backend only
        allow update: if isOwner(userId) && 
                         request.resource.data.diff(resource.data).affectedKeys().hasOnly(['isRead']);
        allow delete: if isOwner(userId);
      }
      
      // Anomalies subcollection
      match /anomalies/{anomalyId} {
        allow read: if isOwner(userId);
        allow create: if false; // Created by backend only
        allow update: if isOwner(userId) && 
                         request.resource.data.diff(resource.data).affectedKeys().hasOnly(['isAcknowledged', 'isFalsePositive']);
        allow delete: if isOwner(userId);
      }
      
      // Forecasts subcollection
      match /forecasts/{forecastId} {
        allow read: if isOwner(userId);
        allow create: if false; // Created by backend only
        allow update: if false; // Updated by backend only
        allow delete: if false; // Managed by retention policy
      }
      
      // Notifications subcollection
      match /notifications/{notificationId} {
        allow read: if isOwner(userId);
        allow create: if false; // Created by backend only
        allow update: if isOwner(userId) && 
                         request.resource.data.diff(resource.data).affectedKeys().hasOnly(['isRead']);
        allow delete: if isOwner(userId);
      }
    }
    
    // Global collections
    
    // Categories collection
    match /categories/{categoryId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // Learning resources collection
    match /learning_resources/{resourceId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // Admin logs collection
    match /admin_logs/{logId} {
      allow read: if isAdmin();
      allow create: if false; // Created by backend only
      allow update: if false;
      allow delete: if isAdmin();
    }
  }
}
```

## Detailed Rule Explanations

### User Documents

**Read Access**:
- Users can read their own document
- Admins can read all user documents

**Write Access**:
- Users can write their own document
- Cannot modify their own `role` field (admin-only)
- Data validation required

**Example**:
```javascript
match /users/{userId} {
  allow read: if isOwner(userId) || isAdmin();
  allow write: if isOwner(userId) && 
                   isValidUserData() &&
                   !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role']);
}
```

### Expenses Subcollection

**Read Access**:
- Users can read their own expenses
- Query must include `userId == request.auth.uid`

**Write Access**:
- Users can create, update, delete their own expenses
- Data validation required (amount > 0, required fields)

**Example**:
```javascript
match /expenses/{expenseId} {
  allow read: if isOwner(userId);
  allow create: if isOwner(userId) && isValidExpenseData();
  allow update: if isOwner(userId) && isValidExpenseData();
  allow delete: if isOwner(userId);
}
```

### Budgets Subcollection

**Read Access**:
- Users can read their own budgets

**Write Access**:
- Users can create, update, delete their own budgets
- Data validation required

**Calculated Fields Protection**:
- Backend handles `spent`, `remaining`, `percentageUsed`
- Security rules don't enforce this (backend responsibility)

**Example**:
```javascript
match /budgets/{budgetId} {
  allow read: if isOwner(userId);
  allow create: if isOwner(userId) && isValidBudgetData();
  allow update: if isOwner(userId) && isValidBudgetData();
  allow delete: if isOwner(userId);
}
```

### Goals Subcollection

**Read Access**:
- Users can read their own goals

**Write Access**:
- Users can create, update, delete their own goals
- Data validation required

**Example**:
```javascript
match /goals/{goalId} {
  allow read: if isOwner(userId);
  allow create: if isOwner(userId) && isValidGoalData();
  allow update: if isOwner(userId) && isValidGoalData();
  allow delete: if isOwner(userId);
}
```

### Insights Subcollection

**Read Access**:
- Users can read their own insights

**Create Access**:
- Backend only (frontend cannot create insights)

**Update Access**:
- Users can only update `isRead` field
- Cannot modify insight content

**Delete Access**:
- Users can delete their own insights

**Example**:
```javascript
match /insights/{insightId} {
  allow read: if isOwner(userId);
  allow create: if false; // Created by backend only
  allow update: if isOwner(userId) && 
                   request.resource.data.diff(resource.data).affectedKeys().hasOnly(['isRead']);
  allow delete: if isOwner(userId);
}
```

### Anomalies Subcollection

**Read Access**:
- Users can read their own anomalies

**Create Access**:
- Backend only (frontend cannot create anomalies)

**Update Access**:
- Users can only update `isAcknowledged` and `isFalsePositive` fields
- Cannot modify anomaly score or reason

**Delete Access**:
- Users can delete their own anomalies

**Example**:
```javascript
match /anomalies/{anomalyId} {
  allow read: if isOwner(userId);
  allow create: if false; // Created by backend only
  allow update: if isOwner(userId) && 
                   request.resource.data.diff(resource.data).affectedKeys().hasOnly(['isAcknowledged', 'isFalsePositive']);
  allow delete: if isOwner(userId);
}
```

### Forecasts Subcollection

**Read Access**:
- Users can read their own forecasts

**Write Access**:
- Backend only (created and updated by backend)
- Deleted by retention policy (Cloud Functions)

**Example**:
```javascript
match /forecasts/{forecastId} {
  allow read: if isOwner(userId);
  allow create: if false; // Created by backend only
  allow update: if false; // Updated by backend only
  allow delete: if false; // Managed by retention policy
}
```

### Notifications Subcollection

**Read Access**:
- Users can read their own notifications

**Create Access**:
- Backend only (frontend cannot create notifications)

**Update Access**:
- Users can only update `isRead` field

**Delete Access**:
- Users can delete their own notifications

**Example**:
```javascript
match /notifications/{notificationId} {
  allow read: if isOwner(userId);
  allow create: if false; // Created by backend only
  allow update: if isOwner(userId) && 
                   request.resource.data.diff(resource.data).affectedKeys().hasOnly(['isRead']);
  allow delete: if isOwner(userId);
}
```

### Global Collections

#### Categories Collection
- **Read**: All authenticated users
- **Write**: Admins only

#### Learning Resources Collection
- **Read**: All authenticated users
- **Write**: Admins only

#### Admin Logs Collection
- **Read**: Admins only
- **Create**: Backend only
- **Delete**: Admins only

**Example**:
```javascript
match /categories/{categoryId} {
  allow read: if isAuthenticated();
  allow write: if isAdmin();
}

match /learning_resources/{resourceId} {
  allow read: if isAuthenticated();
  allow write: if isAdmin();
}

match /admin_logs/{logId} {
  allow read: if isAdmin();
  allow create: if false; // Created by backend only
  allow update: if false;
  allow delete: if isAdmin();
}
```

## Query Security

### Required Query Constraints
For user-specific collections, queries must include:
```javascript
// Expenses query must include userId
db.collection('users').doc(userId).collection('expenses')

// Firestore automatically enforces this due to collection structure
```

### Index Requirements
Queries with multiple where clauses require composite indexes:
```javascript
// Requires composite index on (category, transactionDate)
db.collection('users').doc(userId)
  .collection('expenses')
  .where('category', '==', 'Food')
  .where('transactionDate', '>=', startDate)
  .orderBy('transactionDate')
```

## Testing Security Rules

### Firebase Emulator
Test rules locally using Firebase Emulator:
```bash
firebase emulators:start
```

### Unit Testing
Use Firebase Security Rules testing:
```javascript
const assert = require('assert');
const firebase = require('@firebase/testing');

describe('Firestore Security Rules', () => {
  it('should allow user to read their own expenses', async () => {
    const db = firebase.initializeTestApp({
      auth: { uid: 'user123' }
    }).firestore();
    
    const expense = await db.collection('users')
      .doc('user123')
      .collection('expenses')
      .doc('expense1')
      .get();
    
    assert.equal(expense.exists, true);
  });
  
  it('should not allow user to read another user\'s expenses', async () => {
    const db = firebase.initializeTestApp({
      auth: { uid: 'user123' }
    }).firestore();
    
    await assert.rejects(async () => {
      await db.collection('users')
        .doc('user456')
        .collection('expenses')
        .doc('expense1')
        .get();
    });
  });
});
```

## Deployment

### Deploy Rules
```bash
firebase deploy --only firestore:rules
```

### Check Rules
```bash
firebase firestore:rules check
```

## Best Practices

1. **Principle of Least Privilege**: Grant minimum required access
2. **Validate All Data**: Use validation functions for all writes
3. **Protect Sensitive Fields**: Prevent modification of role, calculated fields
4. **Backend-Only Operations**: Critical operations should be backend-only
5. **Regular Audits**: Review rules periodically
6. **Test Thoroughly**: Test rules with emulator before deployment
7. **Monitor Access**: Use Firebase Console to monitor rule violations

## Common Security Patterns

### Pattern 1: Owner-Only Access
```javascript
allow read, write: if isOwner(userId);
```

### Pattern 2: Admin-Only Access
```javascript
allow read, write: if isAdmin();
```

### Pattern 3: Read-Only for Users
```javascript
allow read: if isOwner(userId);
allow write: if false;
```

### Pattern 4: Limited Field Updates
```javascript
allow update: if isOwner(userId) && 
                 request.resource.data.diff(resource.data)
                   .affectedKeys()
                   .hasOnly(['allowedField1', 'allowedField2']);
```

### Pattern 5: Conditional Updates
```javascript
allow update: if isOwner(userId) && 
                 request.resource.data.status == 'approved';
```

## Monitoring

### Rule Violations
Monitor rule violations in Firebase Console:
- Firestore → Rules → Review violations
- Set up alerts for frequent violations

### Performance
Monitor rule evaluation performance:
- Complex rules can slow down queries
- Optimize helper functions
- Avoid deep nesting

## Additional Security Measures

### Backend Validation
Security rules are not a replacement for backend validation:
- Always validate data in FastAPI with Pydantic
- Verify Firebase ID tokens on backend
- Implement business logic validation
- Rate limiting on API endpoints

### API Security
- Use HTTPS in production
- Implement CORS properly
- Rate limit API endpoints
- Log all admin operations

### Data Encryption
- Firestore encrypts data at rest automatically
- Data in transit encrypted via TLS
- No additional encryption needed

## Emergency Access

### Service Account
Use Firebase Admin SDK with service account for:
- Bulk operations
- Data migrations
- Emergency fixes
- Admin operations

**Warning**: Service account has full access. Use carefully.

### Emulator for Testing
Use Firebase Emulator for:
- Testing security rules
- Development without affecting production
- Safe experimentation

## Compliance

### Data Privacy
- Users can only access their own data
- Admin access logged in admin_logs
- Data retention policies enforced

### Audit Trail
- All admin operations logged
- User access via Firebase Authentication logs
- Security rule violations monitored

## Conclusion

These security rules ensure:
1. User data isolation
2. Proper authentication
3. Role-based access control
4. Data validation
5. Backend-only critical operations

Combine these rules with:
- Backend token verification
- Pydantic validation
- Proper error handling
- Monitoring and logging

For production deployment:
1. Test thoroughly with emulator
2. Deploy to staging first
3. Monitor for violations
4. Review logs regularly
5. Update rules as needed
