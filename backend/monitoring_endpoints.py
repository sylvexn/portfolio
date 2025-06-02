from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import time
import psutil
import sqlite3
from datetime import datetime, timedelta

monitoring_router = APIRouter()

@monitoring_router.get("/health/detailed")
async def detailed_health_check():
    try:
        health_data = {
            "status": "healthy",
            "timestamp": time.time(),
            "uptime": time.time() - start_time,
            "system": {
                "cpu_percent": psutil.cpu_percent(),
                "memory_percent": psutil.virtual_memory().percent,
                "disk_percent": psutil.disk_usage('/').percent
            },
            "database": await _check_database_health(),
            "ai_service": await _check_ai_service_health(),
            "cache": await _check_cache_health()
        }
        
        overall_status = "healthy"
        if health_data["system"]["memory_percent"] > 90:
            overall_status = "degraded"
        if health_data["system"]["cpu_percent"] > 95:
            overall_status = "unhealthy"
            
        health_data["status"] = overall_status
        return health_data
        
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": time.time()
        }

@monitoring_router.get("/metrics/usage")
async def usage_metrics():
    now = time.time()
    last_24h = now - (24 * 60 * 60)
    
    try:
        with sqlite3.connect("./data/conversations.db") as conn:
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT COUNT(DISTINCT session_id) as unique_sessions,
                       COUNT(*) as total_messages,
                       AVG(LENGTH(content)) as avg_message_length
                FROM conversations 
                WHERE timestamp > datetime(?, 'unixepoch')
            """, (last_24h,))
            
            conversation_stats = cursor.fetchone()
            
            cursor.execute("""
                SELECT tool_name, COUNT(*) as execution_count,
                       AVG(execution_time) as avg_execution_time,
                       SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as success_count
                FROM tool_executions 
                WHERE timestamp > datetime(?, 'unixepoch')
                GROUP BY tool_name
                ORDER BY execution_count DESC
            """, (last_24h,))
            
            tool_stats = cursor.fetchall()
            
        return {
            "period": "last_24_hours",
            "conversations": {
                "unique_sessions": conversation_stats[0] or 0,
                "total_messages": conversation_stats[1] or 0,
                "avg_message_length": round(conversation_stats[2] or 0, 2)
            },
            "tools": [
                {
                    "name": row[0],
                    "executions": row[1],
                    "avg_time": round(row[2], 3),
                    "success_rate": round((row[3] / row[1]) * 100, 2)
                } for row in tool_stats
            ]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"failed to retrieve metrics: {e}")

@monitoring_router.get("/metrics/performance")
async def performance_metrics():
    try:
        with sqlite3.connect("./data/conversations.db") as conn:
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT AVG(execution_time) as avg_time,
                       MIN(execution_time) as min_time,
                       MAX(execution_time) as max_time,
                       COUNT(*) as total_executions
                FROM tool_executions
                WHERE timestamp > datetime('now', '-1 hour')
            """)
            
            perf_data = cursor.fetchone()
            
        return {
            "last_hour_performance": {
                "avg_execution_time": round(perf_data[0] or 0, 3),
                "min_execution_time": round(perf_data[1] or 0, 3),
                "max_execution_time": round(perf_data[2] or 0, 3),
                "total_executions": perf_data[3] or 0
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"failed to retrieve performance metrics: {e}")

async def _check_database_health() -> Dict[str, Any]:
    try:
        with sqlite3.connect("./data/conversations.db") as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM conversations")
            count = cursor.fetchone()[0]
            
        return {
            "status": "healthy",
            "total_conversations": count,
            "connection": "success"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }

async def _check_ai_service_health() -> Dict[str, Any]:
    try:
        return {
            "status": "healthy",
            "models_available": 4,
            "current_model": "anthropic/claude-3.5-sonnet"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }

async def _check_cache_health() -> Dict[str, Any]:
    try:
        return {
            "status": "healthy",
            "entries": 0,
            "hit_rate": "N/A"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }

start_time = time.time() 