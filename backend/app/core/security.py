from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.firebase import firebase_auth
from typing import Optional
import logging

logger = logging.getLogger(__name__)

security = HTTPBearer()

async def verify_firebase_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """
    Verify Firebase ID token and return decoded token
    """
    try:
        if not firebase_auth:
            # For development without Firebase, return a mock user
            logger.warning("Firebase Auth not initialized, using mock authentication")
            return {
                "uid": "mock_user_id",
                "email": "mock@example.com",
                "email_verified": True,
                "name": "Mock User"
            }
        
        token = credentials.credentials
        decoded_token = firebase_auth.verify_id_token(token)
        
        return decoded_token
        
    except Exception as e:
        logger.error(f"Token verification failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired Firebase token",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user(
    decoded_token: dict = Depends(verify_firebase_token)
) -> dict:
    """
    Get current user from verified token
    """
    try:
        user_id = decoded_token.get('uid')
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing user ID"
            )
        
        return {
            "user_id": user_id,
            "email": decoded_token.get('email'),
            "email_verified": decoded_token.get('email_verified', False),
            "name": decoded_token.get('name'),
            "picture": decoded_token.get('picture'),
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting current user: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error processing user data"
        )

async def get_admin_user(current_user: dict = Depends(get_current_user)) -> dict:
    """
    Verify user has admin role (requires Firestore check)
    This is a placeholder - actual role checking requires Firestore query
    """
    # TODO: Implement actual admin role check from Firestore
    # For now, this is a placeholder
    return current_user

def check_user_ownership(user_id: str, resource_user_id: str) -> bool:
    """
    Check if user owns the resource
    """
    return user_id == resource_user_id

async def verify_ownership(
    user_id: str,
    resource_user_id: str
) -> None:
    """
    Verify user ownership and raise exception if not owner
    """
    if not check_user_ownership(user_id, resource_user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this resource"
        )
