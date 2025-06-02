from typing import Dict, Any, Optional, List
from .base import BaseTool, ToolResult
from ..data.knowledge_base import search_knowledge

class ContactFacilitatorTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="contact_facilitator",
            description="provides intelligent contact method suggestions and guidance"
        )
    
    async def execute(self, input_data: Any, context: Optional[Dict] = None) -> ToolResult:
        query = input_data.get("query", "").lower() if isinstance(input_data, dict) else str(input_data).lower()
        
        contact_preferences = {
            "professional": {
                "methods": ["linkedin", "email"],
                "keywords": ["job", "work", "business", "professional", "hire", "opportunity"]
            },
            "technical": {
                "methods": ["github", "email"],
                "keywords": ["code", "technical", "project", "development", "collaboration"]
            },
            "casual": {
                "methods": ["twitter", "signal", "email"],
                "keywords": ["chat", "talk", "casual", "social", "connect"]
            },
            "urgent": {
                "methods": ["email", "signal"],
                "keywords": ["urgent", "asap", "quick", "immediate"]
            }
        }
        
        suggested_methods = []
        contact_type = "general"
        
        for category, data in contact_preferences.items():
            if any(keyword in query for keyword in data["keywords"]):
                suggested_methods.extend(data["methods"])
                contact_type = category
                break
        
        if not suggested_methods:
            suggested_methods = ["email", "linkedin", "github"]
        
        contact_info = search_knowledge("contact")
        contact_details = next((chunk for chunk in contact_info if chunk.id == "contact-details"), None)
        
        return ToolResult(
            tool_name=self.name,
            result={
                "contact_type": contact_type,
                "suggested_methods": list(set(suggested_methods)),
                "contact_details": contact_details.content if contact_details else None,
                "recommendation": f"for {contact_type} inquiries, i recommend using {', '.join(suggested_methods[:2])}"
            },
            execution_time=0,
            success=True
        )

class ConversationSummarizerTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="conversation_summarizer",
            description="creates session recap and extracts key discussion points"
        )
    
    async def execute(self, input_data: Any, context: Optional[Dict] = None) -> ToolResult:
        messages = input_data.get("messages", []) if isinstance(input_data, dict) else []
        
        if not messages:
            return ToolResult(
                tool_name=self.name,
                result={
                    "summary": "no conversation history available",
                    "key_topics": [],
                    "sections_discussed": []
                },
                execution_time=0,
                success=True
            )
        
        user_messages = [msg for msg in messages if msg.get("role") == "user"]
        
        key_topics = []
        sections_discussed = []
        
        topic_keywords = {
            "projects": ["project", "keepsake", "portfolio", "dexchat", "caravancraft"],
            "skills": ["skill", "technology", "programming", "frontend", "backend"],
            "experience": ["work", "job", "experience", "navigate360", "affinitiv"],
            "personal": ["about", "background", "who", "personal", "interests"],
            "contact": ["contact", "reach", "email", "linkedin", "github"]
        }
        
        for message in user_messages:
            content = message.get("content", "").lower()
            for topic, keywords in topic_keywords.items():
                if any(keyword in content for keyword in keywords):
                    if topic not in key_topics:
                        key_topics.append(topic)
                        sections_discussed.append(topic)
        
        conversation_length = len(messages)
        user_engagement = len(user_messages)
        
        return ToolResult(
            tool_name=self.name,
            result={
                "summary": f"conversation included {conversation_length} total messages with {user_engagement} user interactions",
                "key_topics": key_topics,
                "sections_discussed": sections_discussed,
                "engagement_level": "high" if user_engagement > 5 else "medium" if user_engagement > 2 else "low"
            },
            execution_time=0,
            success=True
        )

class FollowUpGeneratorTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="follow_up_generator",
            description="generates relevant next questions and suggestions based on conversation context"
        )
    
    async def execute(self, input_data: Any, context: Optional[Dict] = None) -> ToolResult:
        last_topic = input_data.get("last_topic", "") if isinstance(input_data, dict) else str(input_data)
        discussed_topics = input_data.get("discussed_topics", []) if isinstance(input_data, dict) else []
        
        follow_up_suggestions = {
            "projects": [
                "would you like to see the code for any of these projects?",
                "which project interests you most?",
                "ask about the technical challenges in building these projects"
            ],
            "skills": [
                "want to know how blake learned these technologies?",
                "interested in seeing these skills in action through projects?",
                "curious about blake's preferred development stack?"
            ],
            "experience": [
                "would you like to know more about blake's career transition?",
                "interested in how his support background helps with development?",
                "want to see his resume or work samples?"
            ],
            "personal": [
                "curious about blake's development journey?",
                "want to know about his interest in agentic ai?",
                "interested in learning about his rapid learning approach?"
            ],
            "contact": [
                "ready to reach out to blake?",
                "need help choosing the best contact method?",
                "want to know more before getting in touch?"
            ]
        }
        
        all_topics = ["projects", "skills", "experience", "personal", "contact"]
        undiscussed_topics = [topic for topic in all_topics if topic not in discussed_topics]
        
        suggestions = []
        
        if last_topic in follow_up_suggestions:
            suggestions.extend(follow_up_suggestions[last_topic][:2])
        
        if undiscussed_topics:
            next_topic = undiscussed_topics[0]
            suggestions.append(f"explore blake's {next_topic}")
        
        if not suggestions:
            suggestions = [
                "ask about anything else you'd like to know",
                "explore a different section of the portfolio",
                "get in touch with blake directly"
            ]
        
        return ToolResult(
            tool_name=self.name,
            result={
                "suggestions": suggestions[:3],
                "undiscussed_topics": undiscussed_topics,
                "recommended_next_step": suggestions[0] if suggestions else "continue exploring"
            },
            execution_time=0,
            success=True
        ) 