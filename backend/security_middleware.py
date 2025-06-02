from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import time
from collections import defaultdict
import asyncio

class RateLimiter:
    def __init__(self, max_requests: int = 10, time_window: int = 60):
        self.max_requests = max_requests
        self.time_window = time_window
        self.requests = defaultdict(list)
    
    def is_allowed(self, client_id: str) -> bool:
        now = time.time()
        
        self.requests[client_id] = [
            req_time for req_time in self.requests[client_id]
            if now - req_time < self.time_window
        ]
        
        if len(self.requests[client_id]) >= self.max_requests:
            return False
        
        self.requests[client_id].append(now)
        return True

rate_limiter = RateLimiter()

async def rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host if request.client else "unknown"
    
    if not rate_limiter.is_allowed(client_ip):
        raise HTTPException(status_code=429, detail="rate limit exceeded")
    
    response = await call_next(request)
    return response

def validate_input_length(content: str, max_length: int = 1000) -> bool:
    return len(content.strip()) <= max_length

def sanitize_input(text: str) -> str:
    import re
    text = re.sub(r'[<>\"\'&]', '', text)
    return text.strip()[:1000] 