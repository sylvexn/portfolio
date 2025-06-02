from typing import Dict, Any, Optional
from .base import BaseTool, ToolResult

class ShowModalTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="show_modal",
            description="opens a specific portfolio section modal (whoami, resume, skills, projects, contact)"
        )
    
    async def execute(self, input_data: Any, context: Optional[Dict] = None) -> ToolResult:
        modal_id = input_data.get("modal_id") if isinstance(input_data, dict) else str(input_data)
        
        valid_modals = ["whoami", "resume", "skills", "projects", "contact"]
        
        if modal_id not in valid_modals:
            return ToolResult(
                tool_name=self.name,
                result=None,
                execution_time=0,
                success=False,
                error=f"invalid modal id: {modal_id}. valid options: {valid_modals}"
            )
        
        return ToolResult(
            tool_name=self.name,
            result={
                "action": "open_modal",
                "modal_id": modal_id,
                "message": f"opening {modal_id} section"
            },
            execution_time=0,
            success=True
        )

class IntelligentModalSelectorTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="intelligent_modal_selector",
            description="intelligently determines the most appropriate modal section based on contextual analysis of user intent"
        )
    
    async def execute(self, input_data: Any, context: Optional[Dict] = None) -> ToolResult:
        query = input_data.get("query", "").lower() if isinstance(input_data, dict) else str(input_data).lower()
        
        modal_contexts = {
            "resume": {
                "primary_intent": ["work history", "employment", "career progression", "job experience", "professional background"],
                "indicators": ["recent work", "current job", "work at", "employment history", "career", "working at", "job", "position", "role"],
                "temporal_keywords": ["recent", "current", "latest", "now", "currently", "today", "this year", "new job"],
                "description": "professional work history and employment details"
            },
            "projects": {
                "primary_intent": ["things built", "development work", "portfolio items", "coding projects", "applications"],
                "indicators": ["built", "created", "developed", "projects", "portfolio", "app", "website", "code", "github"],
                "temporal_keywords": ["latest project", "recent projects", "new build", "what have you built"],
                "description": "development projects and portfolio work"
            },
            "skills": {
                "primary_intent": ["technical abilities", "programming languages", "tools expertise", "technology stack"],
                "indicators": ["skills", "technologies", "tech stack", "programming", "languages", "frameworks", "tools", "expertise"],
                "temporal_keywords": ["current stack", "using now", "latest tech", "new skills"],
                "description": "technical skills and technology expertise"
            },
            "whoami": {
                "primary_intent": ["personal information", "background story", "who blake is", "introduction"],
                "indicators": ["who", "about", "background", "personal", "bio", "introduction", "story"],
                "temporal_keywords": [],
                "description": "personal background and introduction"
            },
            "contact": {
                "primary_intent": ["getting in touch", "hiring inquiries", "communication"],
                "indicators": ["contact", "email", "hire", "available", "reach", "message", "touch"],
                "temporal_keywords": [],
                "description": "contact information and availability"
            }
        }
        
        best_match = None
        highest_score = 0
        
        for modal_id, context_data in modal_contexts.items():
            score = 0
            matches = []
            
            for indicator in context_data["indicators"]:
                if indicator in query:
                    score += 1
                    matches.append(indicator)
            
            for temporal in context_data["temporal_keywords"]:
                if temporal in query:
                    score += 2
                    matches.append(f"temporal:{temporal}")
            
            for intent in context_data["primary_intent"]:
                words = intent.split()
                if all(word in query for word in words):
                    score += 3
                    matches.append(f"intent:{intent}")
            
            if "work" in query and "recent" in query and modal_id == "resume":
                score += 3
                matches.append("context:recent_work")
            
            if "tech" in query or "stack" in query or "technology" in query:
                if modal_id == "skills":
                    score += 2
                    matches.append("context:technology_focus")
            
            if score > highest_score:
                highest_score = score
                best_match = {
                    "modal_id": modal_id,
                    "score": score,
                    "matches": matches,
                    "description": context_data["description"]
                }
        
        if not best_match:
            best_match = {
                "modal_id": "whoami",
                "score": 0,
                "matches": ["fallback"],
                "description": "default introduction section"
            }
        
        return ToolResult(
            tool_name=self.name,
            result={
                "recommended_modal": best_match["modal_id"],
                "confidence_score": best_match["score"],
                "reasoning": best_match["matches"],
                "description": best_match["description"],
                "analysis": f"based on query '{query}', recommending {best_match['modal_id']} with confidence {best_match['score']}"
            },
            execution_time=0,
            success=True
        )

class SuggestSectionsTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="suggest_sections",
            description="recommends relevant portfolio sections based on user query"
        )
    
    async def execute(self, input_data: Any, context: Optional[Dict] = None) -> ToolResult:
        query = input_data.get("query", "").lower() if isinstance(input_data, dict) else str(input_data).lower()
        
        section_keywords = {
            "whoami": ["about", "background", "personal", "who", "introduction", "bio"],
            "resume": ["work", "experience", "job", "employment", "career", "resume", "cv"],
            "skills": ["skills", "technical", "technologies", "programming", "tools", "expertise"],
            "projects": ["projects", "portfolio", "work", "development", "code", "github"],
            "contact": ["contact", "reach", "email", "message", "get in touch", "communicate"]
        }
        
        suggestions = []
        for section, keywords in section_keywords.items():
            if any(keyword in query for keyword in keywords):
                suggestions.append(section)
        
        if not suggestions:
            suggestions = ["whoami", "projects", "skills"]
        
        return ToolResult(
            tool_name=self.name,
            result={
                "suggested_sections": suggestions[:3],
                "message": f"based on your query, you might be interested in: {', '.join(suggestions[:3])}"
            },
            execution_time=0,
            success=True
        )

class NavigationGuideTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="navigation_guide",
            description="provides overview of site structure and available sections"
        )
    
    async def execute(self, input_data: Any, context: Optional[Dict] = None) -> ToolResult:
        guide = {
            "available_sections": {
                "whoami": "personal introduction and background",
                "resume": "professional experience and work history",
                "skills": "technical expertise and tools",
                "projects": "development work and portfolio pieces",
                "contact": "ways to get in touch"
            },
            "navigation_tips": [
                "click any section name in brackets to open it",
                "use the dock at the bottom for quick navigation",
                "ask me specific questions about blake's background"
            ]
        }
        
        return ToolResult(
            tool_name=self.name,
            result=guide,
            execution_time=0,
            success=True
        ) 