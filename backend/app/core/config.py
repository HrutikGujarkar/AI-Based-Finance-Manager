from pydantic_settings import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # Firebase Configuration
    firebase_project_id: str = os.getenv("FIREBASE_PROJECT_ID", "")
    firebase_api_key: str = os.getenv("FIREBASE_API_KEY", "")
    firebase_auth_domain: str = os.getenv("FIREBASE_AUTH_DOMAIN", "")
    firebase_database_url: str = os.getenv("FIREBASE_DATABASE_URL", "")
    firebase_storage_bucket: str = os.getenv("FIREBASE_STORAGE_BUCKET", "")
    firebase_messaging_sender_id: str = os.getenv("FIREBASE_MESSAGING_SENDER_ID", "")
    firebase_app_id: str = os.getenv("FIREBASE_APP_ID", "")
    
    # Firebase Admin SDK
    firebase_service_account_key_path: str = os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY_PATH", "./service-account-key.json")
    
    # Backend Configuration
    backend_host: str = os.getenv("BACKEND_HOST", "localhost")
    backend_port: int = int(os.getenv("BACKEND_PORT", "8000"))
    backend_cors_origins: str = os.getenv("BACKEND_CORS_ORIGINS", "http://localhost:5173,http://localhost:3000")
    
    # LLM Configuration
    ollama_base_url: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    ollama_model: str = os.getenv("OLLAMA_MODEL", "llama3")
    openai_api_key: Optional[str] = os.getenv("OPENAI_API_KEY")
    openai_model: str = os.getenv("OPENAI_MODEL", "gpt-4")
    
    # Environment
    environment: str = os.getenv("ENVIRONMENT", "development")
    debug: bool = os.getenv("DEBUG", "true").lower() == "true"
    
    # Firebase Emulator Configuration
    firebase_emulator_host: str = os.getenv("FIREBASE_EMULATOR_HOST", "localhost")
    firebase_auth_emulator_port: int = int(os.getenv("FIREBASE_AUTH_EMULATOR_PORT", "9099"))
    firestore_emulator_port: int = int(os.getenv("FIRESTORE_EMULATOR_PORT", "8080"))
    firebase_storage_emulator_port: int = int(os.getenv("FIREBASE_STORAGE_EMULATOR_PORT", "9199"))
    
    @property
    def cors_origins_list(self) -> list:
        return [origin.strip() for origin in self.backend_cors_origins.split(",")]
    
    @property
    def use_emulator(self) -> bool:
        return self.environment == "development"
    
    @property
    def firestore_emulator_host(self) -> str:
        return f"{self.firebase_emulator_host}:{self.firestore_emulator_port}"
    
    @property
    def auth_emulator_host(self) -> str:
        return f"{self.firebase_emulator_host}:{self.firebase_auth_emulator_port}"

settings = Settings()
