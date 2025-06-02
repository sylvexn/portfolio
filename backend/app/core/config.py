from pydantic_settings import BaseSettings
from typing import List
import json
import os

class Settings(BaseSettings):
    openrouter_api_key: str
    host: str = "127.0.0.1"
    port: int = 3501
    cors_origins: List[str] = ["http://localhost:3500", "https://syl.rest"]
    log_level: str = "INFO"
    log_format: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    log_requests: bool = True
    log_responses: bool = True
    log_tool_execution: bool = True
    log_llm_calls: bool = True
    database_path: str = "./data/conversations.db"
    
    class Config:
        env_file = ".env"
        
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        
        cors_origins_env = os.getenv("CORS_ORIGINS")
        if cors_origins_env:
            try:
                self.cors_origins = json.loads(cors_origins_env)
            except json.JSONDecodeError:
                self.cors_origins = cors_origins_env.split(",")
                
settings = Settings() 