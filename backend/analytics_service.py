from typing import Dict, List, Any
import time
from dataclasses import dataclass
from collections import defaultdict
import json

@dataclass
class AnalyticsEvent:
    event_type: str
    session_id: str
    data: Dict[str, Any]
    timestamp: float

class AnalyticsService:
    def __init__(self):
        self.events = []
        self.session_metrics = defaultdict(dict)
    
    def track_conversation_start(self, session_id: str):
        self.events.append(AnalyticsEvent(
            event_type="conversation_start",
            session_id=session_id,
            data={},
            timestamp=time.time()
        ))
    
    def track_user_query(self, session_id: str, query: str, intent: str):
        self.events.append(AnalyticsEvent(
            event_type="user_query",
            session_id=session_id,
            data={
                "query_length": len(query),
                "detected_intent": intent,
                "query_type": self._classify_query(query)
            },
            timestamp=time.time()
        ))
    
    def track_tool_usage(self, session_id: str, tool_name: str, success: bool, execution_time: float):
        self.events.append(AnalyticsEvent(
            event_type="tool_execution",
            session_id=session_id,
            data={
                "tool_name": tool_name,
                "success": success,
                "execution_time": execution_time
            },
            timestamp=time.time()
        ))
    
    def track_modal_interaction(self, session_id: str, modal_id: str, action: str):
        self.events.append(AnalyticsEvent(
            event_type="modal_interaction",
            session_id=session_id,
            data={
                "modal_id": modal_id,
                "action": action
            },
            timestamp=time.time()
        ))
    
    def _classify_query(self, query: str) -> str:
        query_lower = query.lower()
        if any(word in query_lower for word in ["project", "work", "built"]):
            return "projects"
        elif any(word in query_lower for word in ["skill", "tech", "programming"]):
            return "skills"
        elif any(word in query_lower for word in ["contact", "reach", "email"]):
            return "contact"
        elif any(word in query_lower for word in ["experience", "job", "resume"]):
            return "experience"
        else:
            return "general"
    
    def get_session_summary(self, session_id: str) -> Dict[str, Any]:
        session_events = [e for e in self.events if e.session_id == session_id]
        
        return {
            "total_interactions": len(session_events),
            "tools_used": list(set([
                e.data.get("tool_name") for e in session_events 
                if e.event_type == "tool_execution"
            ])),
            "modals_opened": list(set([
                e.data.get("modal_id") for e in session_events 
                if e.event_type == "modal_interaction"
            ])),
            "session_duration": self._calculate_session_duration(session_events)
        }
    
    def _calculate_session_duration(self, events: List[AnalyticsEvent]) -> float:
        if len(events) < 2:
            return 0
        return events[-1].timestamp - events[0].timestamp

analytics = AnalyticsService() 