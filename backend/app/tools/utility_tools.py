from typing import Dict, Any, List
import logging
from .base import BaseTool

logger = logging.getLogger(__name__)

class ClarificationTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="clarification",
            description="handles ambiguous queries with clarifying questions"
        )
    
    async def execute(self, input_data: Dict[str, Any], context: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        try:
            query = input_data.get("query", "")
            
            clarifying_questions = [
                "could you be more specific about what you're looking for?",
                "are you interested in technical details or general information?",
                "would you like to know about blake's experience, projects, or skills?",
                "is there a particular aspect you'd like me to focus on?"
            ]
            
            suggestions = [
                "try asking about specific technologies or projects",
                "specify if you want technical or personal information",
                "use keywords like 'skills', 'projects', 'experience', or 'contact'"
            ]
            
            return {
                "status": "needs_clarification",
                "original_query": query,
                "clarifying_questions": clarifying_questions,
                "suggestions": suggestions,
                "modal_suggestion": "whoami"
            }
            
        except Exception as e:
            logger.error(f"clarification tool error: {e}")
            return {
                "status": "error",
                "error": str(e)
            }

class ErrorHandlerTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="error_handler",
            description="graceful fallback for unsupported requests"
        )
    
    async def execute(self, input_data: Dict[str, Any], context: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        try:
            error_type = input_data.get("error_type", "unknown")
            original_query = input_data.get("query", "")
            
            fallback_responses = {
                "unsupported_request": {
                    "message": "i can help you learn about blake's background, skills, projects, and contact information. what would you like to know?",
                    "modal_suggestion": "whoami"
                },
                "no_information": {
                    "message": "i don't have that specific information in blake's portfolio. try asking about his experience, projects, or technical skills.",
                    "modal_suggestion": "resume"
                },
                "technical_error": {
                    "message": "something went wrong processing your request. please try asking about blake's skills, projects, or experience.",
                    "modal_suggestion": "skills"
                },
                "unknown": {
                    "message": "i'm here to help you learn about blake bowling's portfolio. you can ask about his background, skills, projects, or contact information.",
                    "modal_suggestion": "whoami"
                }
            }
            
            response = fallback_responses.get(error_type, fallback_responses["unknown"])
            
            return {
                "status": "handled",
                "error_type": error_type,
                "original_query": original_query,
                "fallback_message": response["message"],
                "modal_suggestion": response["modal_suggestion"],
                "available_sections": ["whoami", "resume", "skills", "projects", "contact"]
            }
            
        except Exception as e:
            logger.error(f"error handler tool error: {e}")
            return {
                "status": "critical_error",
                "error": str(e),
                "fallback_message": "i'm having trouble processing requests right now. please try again later.",
                "modal_suggestion": "contact"
            }

class AnalyticsTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="analytics",
            description="tracks interaction patterns and popular queries"
        )
    
    async def execute(self, input_data: Dict[str, Any], context: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        try:
            action = input_data.get("action", "track")
            session_id = input_data.get("session_id", "")
            
            if action == "track_query":
                query = input_data.get("query", "")
                intent = input_data.get("intent", "unknown")
                tools_used = input_data.get("tools_used", [])
                
                return {
                    "status": "tracked",
                    "session_id": session_id,
                    "query": query,
                    "intent": intent,
                    "tools_used": tools_used,
                    "timestamp": input_data.get("timestamp")
                }
            
            elif action == "track_modal":
                modal_id = input_data.get("modal_id", "")
                
                return {
                    "status": "tracked",
                    "session_id": session_id,
                    "modal_opened": modal_id,
                    "timestamp": input_data.get("timestamp")
                }
            
            elif action == "get_stats":
                return {
                    "status": "stats_available",
                    "popular_queries": [
                        "tell me about blake's background",
                        "what technologies does blake use",
                        "show me blake's projects"
                    ],
                    "popular_modals": ["skills", "projects", "whoami"],
                    "session_count": "tracked_in_database"
                }
            
            return {
                "status": "no_action",
                "available_actions": ["track_query", "track_modal", "get_stats"]
            }
            
        except Exception as e:
            logger.error(f"analytics tool error: {e}")
            return {
                "status": "error",
                "error": str(e)
            } 