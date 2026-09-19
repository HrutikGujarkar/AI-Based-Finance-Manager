# PHASE 2: Firebase Project Configuration - Setup Guide

## Overview
This guide walks you through setting up the Firebase project, enabling required services, and configuring Firebase Emulator Suite for local development.

## Prerequisites
- Google account
- Firebase CLI installed (✅ Already installed - v15.30.2)
- Node.js 18+ (for frontend later)

## Step 1: Create Firebase Project

### Manual Setup Required
Since Firebase project creation requires authentication with your Google account, you need to do this manually:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `ai-finance-manager` (or your preferred name)
4. Accept Firebase terms
5. Choose Google Analytics option (recommended: Enable for production)
6. Select Google Analytics account (or create new)
7. Click "Create project"
8. Wait for project creation (may take 1-2 minutes)

## Step 2: Enable Firebase Authentication

1. In Firebase Console, go to your project
2. Navigate to **Build** → **Authentication**
3. Click **Get Started**
4. Enable **Email/Password** sign-in method:
   - Click Email/Password
   - Enable it
   - Click Save
5. Enable **Google** sign-in method (optional but recommended):
   - Click Google
   - Enable it
   - Add your domain for production (localhost works for development)
   - Click Save

## Step 3: Enable Cloud Firestore

1. Navigate to **Build** → **Firestore Database**
2. Click **Create database**
3. Choose location (select closest to your users):
   - For India: `asia-south1`
   - For US: `us-central1`
   - For Europe: `europe-west1`
4. Choose **Start in production mode** (recommended)
5. Click **Create**
6. Wait for database creation

## Step 4: Enable Cloud Storage

1. Navigate to **Build** → **Storage**
2. Click **Get Started**
3. Choose the same location as Firestore
4. Choose **Start in production mode**
5. Set security rules (use the rules provided in `storage.rules`)
6. Click **Done**

## Step 5: Get Firebase Configuration

1. Navigate to **Project Settings** (gear icon)
2. Go to **General** tab
3. Scroll down to "Your apps" section
4. Click **Web app** (</> icon)
5. Enter app name: `AI Finance Manager`
6. Don't enable Firebase Hosting for now
7. Click **Register app**
8. Copy the `firebaseConfig` object - you'll need this for the frontend

**Example config format**:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "ai-finance-manager.firebaseapp.com",
  projectId: "ai-finance-manager",
  storageBucket: "ai-finance-manager.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## Step 6: Generate Service Account Key (Backend)

**⚠️ IMPORTANT**: Service account keys should never be committed to Git!

1. Navigate to **Project Settings** → **Service accounts**
2. Click **Generate new private key**
3. Select a service account (or create new)
4. Click **Generate**
5. Save the JSON file as `service-account-key.json` in the project root
6. **DO NOT** commit this file to Git (already in .gitignore)
7. Keep it secure and never share it

## Step 7: Update .env File

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Fill in your Firebase configuration values:
```bash
# Firebase Project Configuration
FIREBASE_PROJECT_ID=your-actual-project-id
FIREBASE_API_KEY=your-actual-api-key
FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
FIREBASE_APP_ID=your-actual-app-id

# Firebase Admin SDK (Backend Only)
FIREBASE_SERVICE_ACCOUNT_KEY_PATH=./service-account-key.json

# Backend Configuration
BACKEND_HOST=localhost
BACKEND_PORT=8000
BACKEND_CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# LLM Configuration (Optional)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3

# Environment
ENVIRONMENT=development
DEBUG=true
```

## Step 8: Initialize Firebase Emulator Suite

1. Initialize Firebase in your project:
```bash
firebase login
firebase init
```

2. When prompted:
   - **Which Firebase features?**: Select Firestore, Storage, Authentication, Emulators
   - **Use an existing project?**: Select your newly created project
   - **What file should be used for Firestore Rules?**: `firestore.rules` (already exists)
   - **What file should be used for Firestore Indexes?**: `firestore.indexes.json` (already exists)
   - **What file should be used for Storage Rules?**: `storage.rules` (already exists)
   - **Configure Emulators?**: Yes
   - **Which emulators?**: Auth, Firestore, Storage
   - **Port configuration?**: Use defaults (already in firebase.json)

3. The configuration files have already been created, so initialization should detect them.

## Step 9: Deploy Security Rules to Emulator

1. Start the Firebase Emulator Suite:
```bash
firebase emulators:start
```

2. In a new terminal, deploy rules to emulator:
```bash
firebase firestore:rules --only emulators
firebase storage:rules --only emulators
```

3. The emulator UI will be available at: http://localhost:4000

## Step 10: Deploy Indexes

1. Deploy Firestore indexes:
```bash
firebase firestore:indexes --only emulators
```

2. Or deploy to production (after testing):
```bash
firebase deploy --only firestore:indexes
```

## Step 11: Verify Setup

### Check Firebase Configuration
```bash
firebase projects:list
firebase use --add  # Add your project
```

### Test Emulator
```bash
firebase emulators:start
```

Visit http://localhost:4000 to see the emulator UI.

### Test Service Account
Create a test script to verify the service account works:
```python
# test_firebase.py
import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("service-account-key.json")
firebase_admin.initialize_app(cred)

db = firestore.client()
print("Firebase Admin SDK initialized successfully!")
```

## Step 12: Update Firebase Project ID

Update `.firebaserc` with your actual project ID:
```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

## Firebase Console Setup Checklist

- [ ] Firebase project created
- [ ] Authentication enabled (Email/Password)
- [ ] Google Sign-In enabled (optional)
- [ ] Cloud Firestore created
- [ ] Cloud Storage created
- [ ] Firebase configuration copied
- [ ] Service account key generated
- [ ] .env file updated with config
- [ ] Firebase Emulator initialized
- [ ] Security rules deployed to emulator
- [ ] Indexes deployed
- [ ] Service account tested

## Files Created/Modified in This Phase

✅ `.env.example` - Environment variables template
✅ `firebase.json` - Firebase configuration
✅ `.firebaserc` - Firebase project configuration
✅ `firestore.rules` - Firestore security rules
✅ `storage.rules` - Storage security rules
✅ `firestore.indexes.json` - Firestore indexes
✅ `.gitignore` - Git ignore rules

## Next Steps

After completing this phase:
1. Verify all emulators are working
2. Test service account connection
3. Proceed to **PHASE 3: Firebase Authentication**

## Troubleshooting

### Firebase Login Issues
```bash
firebase logout
firebase login
```

### Emulator Port Conflicts
Check if ports are in use:
```bash
# Windows
netstat -ano | findstr :8080

# Linux/Mac
lsof -i :8080
```

Change ports in `firebase.json` if needed.

### Service Account Permission Issues
Ensure the service account has:
- Cloud Firestore Admin
- Cloud Storage Admin
- Firebase Authentication Admin

## Important Notes

1. **Never commit service account key** to Git
2. **Never share service account key** publicly
3. **Use emulator for development** before deploying to production
4. **Keep .env file** secure and don't commit it
5. **Regularly rotate** service account keys in production

## Production vs Development

### Development (Current Phase)
- Use Firebase Emulator Suite
- Use localhost for testing
- Service account key for local development
- Development environment variables

### Production (Later Phase)
- Use real Firebase project
- Deploy to production
- Use environment-specific service account
- Production environment variables
- Enable Google Analytics
- Set up monitoring and alerts

## Documentation References

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/rules)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite)
