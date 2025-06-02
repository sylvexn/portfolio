import time
import json
import hashlib
from typing import Any, Optional, Dict
from dataclasses import dataclass

@dataclass
class CacheEntry:
    value: Any
    expiry: float
    created_at: float

class CacheService:
    def __init__(self, default_ttl: int = 300):
        self.cache: Dict[str, CacheEntry] = {}
        self.default_ttl = default_ttl
    
    def _generate_key(self, prefix: str, *args) -> str:
        key_data = f"{prefix}:{':'.join(str(arg) for arg in args)}"
        return hashlib.md5(key_data.encode()).hexdigest()
    
    def get(self, key: str) -> Optional[Any]:
        if key not in self.cache:
            return None
        
        entry = self.cache[key]
        if time.time() > entry.expiry:
            del self.cache[key]
            return None
        
        return entry.value
    
    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        ttl = ttl or self.default_ttl
        expiry = time.time() + ttl
        
        self.cache[key] = CacheEntry(
            value=value,
            expiry=expiry,
            created_at=time.time()
        )
    
    def cache_knowledge_search(self, query: str, results: Any, ttl: int = 600) -> None:
        key = self._generate_key("knowledge", query.lower().strip())
        self.set(key, results, ttl)
    
    def get_cached_knowledge_search(self, query: str) -> Optional[Any]:
        key = self._generate_key("knowledge", query.lower().strip())
        return self.get(key)
    
    def cache_ai_response(self, context_hash: str, response: str, ttl: int = 1800) -> None:
        key = self._generate_key("ai_response", context_hash)
        self.set(key, response, ttl)
    
    def get_cached_ai_response(self, context_hash: str) -> Optional[str]:
        key = self._generate_key("ai_response", context_hash)
        return self.get(key)
    
    def create_context_hash(self, user_message: str, knowledge_context: list) -> str:
        context_data = {
            "message": user_message,
            "knowledge": [item.get("content", "")[:100] for item in knowledge_context[:3]]
        }
        return hashlib.md5(json.dumps(context_data, sort_keys=True).encode()).hexdigest()
    
    def clear_expired(self) -> int:
        now = time.time()
        expired_keys = [
            key for key, entry in self.cache.items()
            if now > entry.expiry
        ]
        
        for key in expired_keys:
            del self.cache[key]
        
        return len(expired_keys)
    
    def stats(self) -> Dict[str, Any]:
        now = time.time()
        valid_entries = sum(1 for entry in self.cache.values() if now <= entry.expiry)
        
        return {
            "total_entries": len(self.cache),
            "valid_entries": valid_entries,
            "expired_entries": len(self.cache) - valid_entries,
            "cache_size_mb": self._estimate_size_mb()
        }
    
    def _estimate_size_mb(self) -> float:
        total_size = sum(len(str(entry.value)) for entry in self.cache.values())
        return total_size / (1024 * 1024)

cache = CacheService() 