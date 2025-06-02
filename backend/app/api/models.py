from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class ChatMessage(BaseModel):
    id: str
    role: str
    content: str
    timestamp: datetime

class ChatRequest(BaseModel):
    message: str
    session_id: str
    context: Optional[List[Dict[str, Any]]] = None
    preferences: Optional[Dict[str, Any]] = None

class ToolResult(BaseModel):
    tool_name: str
    result: Any
    execution_time: float

class ModalAction(BaseModel):
    action: str
    modal_id: str

class ChatResponse(BaseModel):
    message: str
    tool_results: Optional[List[ToolResult]] = None
    modal_actions: Optional[List[ModalAction]] = None
    suggestions: Optional[List[str]] = None
    context: Optional[List[ChatMessage]] = None
    session_id: str

class DetailedChatLog(BaseModel):
    id: str
    session_id: str
    user_query: str
    final_response: str
    tools_used: List[ToolResult]
    modal_actions: Optional[List[ModalAction]] = None
    suggestions: Optional[List[str]] = None
    response_time: float
    timestamp: datetime
    user_ip: Optional[str] = None
    user_agent: Optional[str] = None

class ChatLogRequest(BaseModel):
    log_id: str
    session_id: str
    user_query: str
    final_response: str
    tools_used: Optional[List[ToolResult]] = None
    modal_actions: Optional[List[ModalAction]] = None
    suggestions: Optional[List[str]] = None
    response_time: float

class ChatAnalytics(BaseModel):
    total_queries: int
    avg_response_time: float
    unique_sessions: int
    first_query: Optional[str] = None
    last_query: Optional[str] = None
    popular_queries: List[Dict[str, Any]]

class ToolInfo(BaseModel):
    name: str
    description: str

class ToolsResponse(BaseModel):
    tools: List[ToolInfo]
    total_count: int 