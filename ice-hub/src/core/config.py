from pydantic import SecretStr, PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Literal

class Settings(BaseSettings):
    """
    Strict validation for environment variables.
    The app will crash on startup if any required fields are missing or invalid.
    """
    # Environment
    environment: Literal["development", "staging", "production"] = "development"
    debug: bool = False

    # External APIs
    deepseek_api_key: SecretStr  # SecretStr hides the value from accidental console prints

    # Database
    database_url: str = "sqlite:///./dev.db" # Default fallback for local dev

    # Tells Pydantic to read from the .env file in the root directory
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8",
        extra="ignore" # Ignore extra variables in .env we don't care about
    )

# Instantiate a global settings object to be imported across the app
settings = Settings()