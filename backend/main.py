from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import os
import logging
import time
from dotenv import load_dotenv

from app.core.config import Settings
from app.core.database import init_database
from app.api.routes import chat_router, tools_router

load_dotenv()
settings = Settings()

logging.basicConfig(
    level=getattr(logging, settings.log_level),
    format=settings.log_format
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("[STARTUP] starting portfolio chatbot backend service...")
    logger.info(f"[STARTUP] log level: {settings.log_level}")
    logger.info(f"[STARTUP] host: {settings.host}, port: {settings.port}")
    logger.info(f"[STARTUP] cors origins: {settings.cors_origins}")
    
    try:
        init_database()
        logger.info("[STARTUP] database initialized successfully")
    except Exception as e:
        logger.error(f"[STARTUP] database initialization failed: {e}")
        raise
    
    logger.info("[STARTUP] backend service started successfully")
    yield
    logger.info("[SHUTDOWN] shutting down backend service...")

app = FastAPI(
    title="portfolio chatbot backend",
    description="agentic ai backend for blake bowling's portfolio",
    version="1.0.0",
    lifespan=lifespan
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    client_ip = request.client.host if request.client else "unknown"
    method = request.method
    url = str(request.url)
    
    logger.info(f"[REQUEST] {method} {url} from {client_ip}")
    
    response = await call_next(request)
    
    process_time = time.time() - start_time
    status_code = response.status_code
    
    if status_code >= 400:
        logger.warning(f"[RESPONSE] {method} {url} -> {status_code} in {process_time:.3f}s")
    else:
        logger.info(f"[RESPONSE] {method} {url} -> {status_code} in {process_time:.3f}s")
    
    response.headers["X-Process-Time"] = str(process_time)
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.info(f"[MIDDLEWARE] CORS configured for origins: {settings.cors_origins}")

app.include_router(chat_router, prefix="/chat", tags=["chat"])
app.include_router(tools_router, prefix="/tools", tags=["tools"])

logger.info("[ROUTES] chat and tools routers registered")

@app.get("/health")
async def health_check():
    logger.debug("[HEALTH] health check requested")
    return {
        "status": "healthy", 
        "service": "portfolio-chatbot-backend",
        "version": "1.0.0",
        "timestamp": time.time()
    }

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    client_ip = request.client.host if request.client else "unknown"
    method = request.method
    url = str(request.url)
    
    logger.error(f"[GLOBAL_ERROR] {method} {url} from {client_ip}")
    logger.error(f"[GLOBAL_ERROR] exception: {type(exc).__name__}: {exc}")
    
    if hasattr(exc, '__traceback__'):
        import traceback
        logger.error(f"[GLOBAL_ERROR] traceback: {traceback.format_exc()}")
    
    return JSONResponse(
        status_code=500,
        content={
            "detail": "internal server error",
            "error_type": type(exc).__name__,
            "timestamp": time.time()
        }
    )

if __name__ == "__main__":
    import uvicorn
    
    logger.info(f"[STARTUP] starting uvicorn server on {settings.host}:{settings.port}")
    logger.info(f"[STARTUP] reload mode: True")
    
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=True,
        log_level=settings.log_level.lower()
    ) 