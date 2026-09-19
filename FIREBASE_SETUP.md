# Firebase Console Setup Guide

## 🔥 Firebase Authentication Setup

### Step 1: Enable Authentication in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `ai-finance-manager-e072f`
3. Navigate to **Build** → **Authentication**
4. Click **Get Started**
5. Enable **Email/Password** sign-in:
   - Click Email/Password
   - Enable it
   - Click Save
6. Enable **Google** sign-in (optional):
   - Click Google
   - Enable it
   - Add your domain for production (localhost works for development)
   - Click Save

### Step 2: Enable Firestore Database

1. Navigate to **Build** → **Firestore Database**
2. Click **Create database**
3. Choose location (closest to your users):
   - For India: `asia-south1`
   - For US: `us-central1`
   - For Europe: `europe-west1`
4. Choose **Start in production mode**
5. Click **Create**
6. Wait for database creation

### Step 3: Enable Cloud Storage

1. Navigate to **Build** → **Storage**
2. Click **Get Started**
3. Choose the same location as Firestore
4. Choose **Start in production mode**
5. Set security rules (use the rules provided in `storage.rules`)
6. Click **Done**

### Step 4: Generate Service Account Key

1. Navigate to **Project Settings** → **Service accounts**
2. Click **Generate new private key**
3. Select a service account (or create new)
4. Click **Generate**
5. Save the JSON file as `service-account-key.json` in the project root
6. **DO NOT** commit this file to Git (already in .gitignore)

### Step 5: Update .env File

Copy `.env.example` to `.env` and fill in your actual Firebase configuration values that you already have.

### Step 6: Test Authentication

#### Frontend Test
```bash
cd frontend
npm run dev
```
- Visit http://localhost:5173/register
- Create a new account with email/password
- Login with your credentials
- You should be redirected to the dashboard

#### Backend Test
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```
- Visit http://localhost:8000/docs
- Test the API endpoints

## 🔧 Firebase Emulator Setup (Optional for Local Development)

### Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools
```

### Initialize Firebase
```bash
firebase login
firebase init
```

### Start Emulators
```bash
firebase emulators:start
```

### Access Emulator UI
- Emulator UI: http://localhost:4000
- Auth emulator: http://localhost:9099
- Firestore emulator: http://localhost:8080
- Storage emulator: http://localhost:9199

## ✅ Verification Checklist

- [ ] Email/Password Authentication enabled
- [ ] Google Sign-In enabled (optional)
- [ ] Firestore Database created
- [ ] Cloud Storage created
- [ ] Service account key generated
- [ ] .env file configured
- [ ] Frontend can register/login
- [ ] Backend API is accessible
- [ ] Firebase ID tokens are being sent to backend

## 🚨 Troubleshooting

### "Email already in use" error
- The email is already registered in Firebase
- Try logging in instead of registering
- Or use a different email

### "Invalid login credentials" error
- Check email and password
- Make sure Authentication is enabled
- Check Firebase Console for user list

### "Firebase not initialized" error
- Check Firebase configuration in frontend
- Verify Firebase project ID matches
- Check console for Firebase initialization errors

### Backend token verification fails
- Verify service account key is correct
- Check Firebase Admin SDK is initialized
- Ensure Firebase project is properly configured

## 📱 Testing with Real Firebase

Once Firebase is set up:

1. **Register User**:
   - Go to http://localhost:5173/register
   - Enter email and password
   - Click "Sign up"
   - User will be created in Firebase Authentication

2. **Login User**:
   - Go to http://localhost:5173/login
   - Enter email and password
   - Click "Sign in"
   - User will be authenticated and redirected to dashboard

3. **Verify Token**:
   - After login, check localStorage for 'firebaseToken'
   - Token should be sent with API requests
   - Backend should verify the token

## 🎯 Next Steps After Firebase Setup

1. **Test Full Authentication Flow**
2. **Implement Firestore Operations** (expenses will be stored in Firestore)
3. **Enable Cloud Storage** (for file uploads)
4. **Test Backend with Real Firebase**
5. **Deploy Security Rules**

## 💡 Development vs Production

### Development (Current)
- Firebase project created
- Frontend configured with Firebase credentials
- Backend using mock authentication
- Mock data for demo purposes

### Production (After Setup)
- All Firebase services enabled
- Real Firebase Authentication
- Firestore for data storage
- Cloud Storage for files
- Service account key for backend
- Real-time data sync

## 🔐 Security Notes

- **Never commit service account key** to Git
- **Never commit .env file** to Git
- **Use environment variables** for sensitive data
- **Enable Firebase security rules** in production
- **Regularly rotate service account keys**

Following this guide will enable full Firebase functionality for your AI Finance Manager application!
