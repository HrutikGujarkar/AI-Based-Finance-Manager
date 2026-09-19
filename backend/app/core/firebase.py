import firebase_admin
from firebase_admin import credentials, firestore, storage, auth
from app.core.config import settings
import os

# Initialize Firebase Admin SDK
def initialize_firebase():
    """Initialize Firebase Admin SDK with service account or emulator"""
    try:
        if not firebase_admin._apps:
            # Check if using emulator
            if settings.use_emulator:
                # Only initialize the Admin SDK when an emulator is configured.
                # Without emulator variables, development uses mock auth/storage.
                if not os.getenv("FIRESTORE_EMULATOR_HOST"):
                    return False
                firebase_admin.initialize_app()
            else:
                # Production: Use service account key
                if os.path.exists(settings.firebase_service_account_key_path):
                    cred = credentials.Certificate(settings.firebase_service_account_key_path)
                    firebase_admin.initialize_app(cred)
                else:
                    print(f"Warning: Service account key not found at {settings.firebase_service_account_key_path}")
                    return False
        return True
    except Exception as e:
        print(f"Error initializing Firebase: {e}")
        print("Continuing without Firebase (limited functionality)")
        return False

# Initialize Firebase
firebase_initialized = initialize_firebase()

# Get Firebase clients
def get_firestore_client():
    """Get Firestore client"""
    if not firebase_initialized:
        return None
    if settings.use_emulator:
        # Configure emulator for Firestore
        firestore_client = firestore.client()
        firestore_client.emulator_host = settings.firestore_emulator_host
        return firestore_client
    return firestore.client()

def get_storage_client():
    """Get Storage client"""
    if not firebase_initialized:
        return None
    return storage.bucket(settings.firebase_storage_bucket)

def get_auth_client():
    """Get Auth client"""
    if not firebase_initialized:
        return None
    return auth

# Export clients
db = get_firestore_client()
storage_bucket = get_storage_client()
firebase_auth = get_auth_client()
