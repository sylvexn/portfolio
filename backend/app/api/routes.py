from fastapi import APIRouter, HTTPException, BackgroundTasks, Request
from typing import List, Dict, Any
import logging
import time
from datetime import datetime
import uuid

from .models import ChatRequest, ChatResponse, ToolsResponse, ChatMessage, ToolResult, ModalAction, DetailedChatLog, ChatLogRequest, ChatAnalytics
from ..core.agent import AgentController
from ..core.database import ConversationManager, ChatLogManager

logger = logging.getLogger(__name__)

chat_router = APIRouter()
tools_router = APIRouter()

agent_controller = AgentController()

def generate_log_id() -> str:
    timestamp = str(int(time.time() * 1000))[-6:]
    random = str(uuid.uuid4())[:8]
    return f"{timestamp}{random}"

@chat_router.post("", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest, background_tasks: BackgroundTasks, req: Request):
    start_time = time.time()
    user_message_id = f"user_{uuid.uuid4()}"
    session_id = request.session_id
    
    user_ip = req.client.host if req.client else None
    user_agent = req.headers.get("user-agent")
    
    logger.info(f"[CHAT REQUEST] session: {session_id}")
    logger.info(f"[USER QUERY] message: '{request.message}'")
    logger.info(f"[CONTEXT] length: {len(request.context) if request.context else 0} messages")
    
    try:
        background_tasks.add_task(
            ConversationManager.save_message,
            session_id,
            user_message_id,
            "user",
            request.message
        )
        
        conversation_context = []
        if request.context:
            conversation_context = request.context
        
        logger.info(f"[PROCESSING] starting agent processing for session: {session_id}")
        
        result = await agent_controller.process_message(
            user_message=request.message,
            session_id=session_id,
            context=conversation_context
        )
        
        processing_time = time.time() - start_time
        logger.info(f"[AGENT RESPONSE] processing time: {processing_time:.2f}s")
        logger.info(f"[ASSISTANT RESPONSE] message: '{result['message']}'")
        logger.info(f"[TOOLS EXECUTED] count: {len(result.get('tool_results', []))}")
        
        if result.get("tool_results"):
            for tr in result["tool_results"]:
                logger.info(f"[TOOL] {tr['tool_name']} - execution_time: {tr['execution_time']:.3f}s")
                
                if tr['tool_name'] == 'knowledge_validation':
                    validation_data = tr.get('result', {})
                    logger.info(f"[VALIDATION] items_found: {validation_data.get('knowledge_items_found', 0)}, validated: {validation_data.get('knowledge_items_validated', 0)}")
                    logger.info(f"[VALIDATION] passed: {validation_data.get('validation_passed', False)}, fallback: {validation_data.get('fallback_triggered', False)}")
                
                elif tr['tool_name'] == 'validation_guard':
                    guard_data = tr.get('result', {})
                    logger.info(f"[GUARD] status: {guard_data.get('status', 'unknown')}, reason: {guard_data.get('validation_reason', 'none')}")
                
                elif tr['tool_name'] == 'knowledge_search':
                    search_data = tr.get('result', {})
                    logger.info(f"[KNOWLEDGE] found: {search_data.get('total_results', 0)} items, status: {search_data.get('status', 'unknown')}")
        
        if result.get("modal_actions"):
            logger.info(f"[MODAL ACTIONS] count: {len(result['modal_actions'])}")
            for ma in result["modal_actions"]:
                logger.info(f"[MODAL] action: {ma['action']}, modal_id: {ma['modal_id']}")
        
        assistant_message_id = f"assistant_{uuid.uuid4()}"
        assistant_message = result["message"]
        
        background_tasks.add_task(
            ConversationManager.save_message,
            session_id,
            assistant_message_id,
            "assistant",
            assistant_message,
            {
                "tool_results": result.get("tool_results", []),
                "modal_actions": result.get("modal_actions", []),
                "intent_analysis": result.get("intent_analysis", {})
            }
        )
        
        tool_results = []
        for tr in result.get("tool_results", []):
            tool_results.append(ToolResult(
                tool_name=tr["tool_name"],
                result=tr["result"],
                execution_time=tr["execution_time"]
            ))
        
        modal_actions = []
        for ma in result.get("modal_actions", []):
            modal_actions.append(ModalAction(
                action=ma["action"],
                modal_id=ma["modal_id"]
            ))
        
        response_time = time.time() - start_time
        
        log_id = generate_log_id()
        background_tasks.add_task(
            ChatLogManager.save_chat_log,
            log_id,
            session_id,
            request.message,
            assistant_message,
            result.get("tool_results", []),
            result.get("modal_actions", []),
            result.get("suggestions", []),
            response_time,
            user_ip,
            user_agent
        )
        
        response = ChatResponse(
            message=assistant_message,
            tool_results=tool_results,
            modal_actions=modal_actions,
            suggestions=result.get("suggestions", []),
            session_id=session_id
        )
        
        total_time = time.time() - start_time
        logger.info(f"[CHAT COMPLETE] session: {session_id}, total_time: {total_time:.2f}s, log_id: {log_id}")
        logger.info(f"[SUGGESTIONS] count: {len(result.get('suggestions', []))}")
        
        return response
        
    except Exception as e:
        error_time = time.time() - start_time
        logger.error(f"[CHAT ERROR] session: {session_id}, error: {e}, time: {error_time:.2f}s")
        logger.error(f"[ERROR DETAILS] message: '{request.message}', exception: {type(e).__name__}")
        raise HTTPException(status_code=500, detail="failed to process chat request")

@chat_router.get("/logs")
async def get_chat_logs(session_id: str = None, limit: int = 100):
    logger.info(f"[LOGS REQUEST] session: {session_id}, limit: {limit}")
    
    try:
        logs = ChatLogManager.get_chat_logs(session_id, limit)
        
        detailed_logs = []
        for log in logs:
            detailed_logs.append(DetailedChatLog(
                id=log['id'],
                session_id=log['session_id'],
                user_query=log['user_query'],
                final_response=log['final_response'],
                tools_used=[ToolResult(**tool) for tool in log['tools_used']],
                modal_actions=[ModalAction(**action) for action in log['modal_actions']] if log['modal_actions'] else None,
                suggestions=log['suggestions'],
                response_time=log['response_time'],
                timestamp=log['timestamp'],
                user_ip=log['user_ip'],
                user_agent=log['user_agent']
            ))
        
        logger.info(f"[LOGS RESPONSE] found: {len(detailed_logs)} logs")
        return {
            "logs": detailed_logs,
            "total_count": len(detailed_logs),
            "session_id": session_id
        }
        
    except Exception as e:
        logger.error(f"[LOGS ERROR] error: {e}")
        raise HTTPException(status_code=500, detail="failed to retrieve chat logs")

@chat_router.get("/analytics")
async def get_chat_analytics(days: int = 30):
    logger.info(f"[ANALYTICS REQUEST] days: {days}")
    
    try:
        analytics = ChatLogManager.get_chat_analytics(days)
        
        logger.info(f"[ANALYTICS RESPONSE] queries: {analytics.get('total_queries', 0)}")
        return ChatAnalytics(**analytics)
        
    except Exception as e:
        logger.error(f"[ANALYTICS ERROR] error: {e}")
        raise HTTPException(status_code=500, detail="failed to retrieve chat analytics")

@chat_router.delete("/logs")
async def clear_chat_logs(session_id: str = None):
    logger.info(f"[CLEAR LOGS REQUEST] session: {session_id}")
    
    try:
        ChatLogManager.clear_chat_logs(session_id)
        
        message = f"cleared chat logs for session {session_id}" if session_id else "cleared all chat logs"
        logger.info(f"[CLEAR LOGS COMPLETE] {message}")
        return {"success": True, "message": message}
        
    except Exception as e:
        logger.error(f"[CLEAR LOGS ERROR] error: {e}")
        raise HTTPException(status_code=500, detail="failed to clear chat logs")

@chat_router.get("/history/{session_id}")
async def get_chat_history(session_id: str):
    logger.info(f"[HISTORY REQUEST] session: {session_id}")
    
    try:
        start_time = time.time()
        messages = ConversationManager.get_conversation_history(session_id)
        
        chat_messages = []
        for msg in messages:
            chat_messages.append(ChatMessage(
                id=msg["id"],
                role=msg["role"],
                content=msg["content"],
                timestamp=msg["timestamp"]
            ))
        
        retrieval_time = time.time() - start_time
        logger.info(f"[HISTORY RESPONSE] session: {session_id}, messages: {len(chat_messages)}, time: {retrieval_time:.3f}s")
        
        return {
            "session_id": session_id,
            "messages": chat_messages,
            "total_messages": len(chat_messages)
        }
        
    except Exception as e:
        logger.error(f"[HISTORY ERROR] session: {session_id}, error: {e}")
        raise HTTPException(status_code=500, detail="failed to retrieve chat history")

@chat_router.post("/clear/{session_id}")
async def clear_chat(session_id: str):
    logger.info(f"[CLEAR REQUEST] session: {session_id}")
    
    try:
        start_time = time.time()
        ConversationManager.clear_conversation(session_id)
        clear_time = time.time() - start_time
        
        logger.info(f"[CLEAR COMPLETE] session: {session_id}, time: {clear_time:.3f}s")
        return {"success": True, "message": f"cleared conversation for session {session_id}"}
        
    except Exception as e:
        logger.error(f"[CLEAR ERROR] session: {session_id}, error: {e}")
        raise HTTPException(status_code=500, detail="failed to clear chat")

@tools_router.get("", response_model=ToolsResponse)
async def get_available_tools():
    logger.info("[TOOLS REQUEST] getting available tools")
    
    try:
        start_time = time.time()
        tools = agent_controller.get_available_tools()
        retrieval_time = time.time() - start_time
        
        logger.info(f"[TOOLS RESPONSE] count: {len(tools)}, time: {retrieval_time:.3f}s")
        
        return ToolsResponse(
            tools=tools,
            total_count=len(tools)
        )
        
    except Exception as e:
        logger.error(f"[TOOLS ERROR] error: {e}")
        raise HTTPException(status_code=500, detail="failed to retrieve available tools")

@tools_router.post("/{tool_name}/execute")
async def execute_tool_direct(tool_name: str, input_data: Dict[str, Any]):
    logger.info(f"[TOOL EXECUTE] tool: {tool_name}")
    logger.info(f"[TOOL INPUT] data: {input_data}")
    
    try:
        start_time = time.time()
        result = await agent_controller.execute_tool(
            tool_name=tool_name,
            input_data=input_data,
            context=None,
            session_id=""
        )
        
        execution_time = time.time() - start_time
        logger.info(f"[TOOL RESULT] tool: {tool_name}, success: {result.success}, time: {execution_time:.3f}s")
        
        if not result.success:
            logger.warning(f"[TOOL WARNING] tool: {tool_name}, error: {result.error}")
        
        return {
            "tool_name": result.tool_name,
            "success": result.success,
            "result": result.result,
            "execution_time": result.execution_time,
            "error": result.error
        }
        
    except Exception as e:
        logger.error(f"[TOOL ERROR] tool: {tool_name}, error: {e}")
        raise HTTPException(status_code=500, detail=f"failed to execute tool {tool_name}") 