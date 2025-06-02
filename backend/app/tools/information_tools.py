from typing import Dict, Any, Optional, List
import logging
from .base import BaseTool, ToolResult
from ..data.knowledge_base import search_knowledge, KnowledgeChunk

logger = logging.getLogger(__name__)

class KnowledgeSearchTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="knowledge_search",
            description="searches blake's knowledge base for relevant information"
        )
        self.minimum_relevance_threshold = 2
    
    async def execute(self, input_data: Any, context: Optional[Dict] = None) -> ToolResult:
        query = input_data.get("query", "") if isinstance(input_data, dict) else str(input_data)
        
        if not query.strip():
            logger.warning("[KNOWLEDGE_SEARCH] empty query provided")
            return ToolResult(
                tool_name=self.name,
                result=None,
                execution_time=0,
                success=False,
                error="empty query provided"
            )
        
        logger.info(f"[KNOWLEDGE_SEARCH] searching for: '{query}'")
        relevant_chunks = search_knowledge(query)
        
        if not relevant_chunks:
            logger.warning(f"[KNOWLEDGE_SEARCH] no knowledge found for query: '{query}'")
            return ToolResult(
                tool_name=self.name,
                result={
                    "query": query,
                    "results": [],
                    "total_results": 0,
                    "status": "no_relevant_knowledge_found"
                },
                execution_time=0,
                success=False,
                error="no relevant knowledge found"
            )
        
        filtered_chunks = [
            chunk for chunk in relevant_chunks 
            if chunk.relevance >= self.minimum_relevance_threshold
        ]
        
        if not filtered_chunks:
            logger.warning(f"[KNOWLEDGE_SEARCH] no high-quality knowledge found for query: '{query}' (found {len(relevant_chunks)} low-relevance items)")
            return ToolResult(
                tool_name=self.name,
                result={
                    "query": query,
                    "results": [],
                    "total_results": 0,
                    "status": "low_relevance_knowledge_only"
                },
                execution_time=0,
                success=False,
                error="only low-relevance knowledge found"
            )
        
        results = [
            {
                "id": chunk.id,
                "category": chunk.category,
                "content": chunk.content,
                "relevance": chunk.relevance,
                "keywords": chunk.keywords
            } for chunk in filtered_chunks[:3]
        ]
        
        logger.info(f"[KNOWLEDGE_SEARCH] returning {len(results)} high-quality knowledge items")
        
        return ToolResult(
            tool_name=self.name,
            result={
                "query": query,
                "results": results,
                "total_results": len(results),
                "status": "success"
            },
            execution_time=0,
            success=True
        )

class ProjectDetailsTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="project_details",
            description="provides detailed information about blake's projects"
        )
    
    async def execute(self, input_data: Any, context: Optional[Dict] = None) -> ToolResult:
        query = input_data.get("query", "").lower() if isinstance(input_data, dict) else str(input_data).lower()
        
        project_keywords = {
            "keepsake": ["keepsake", "image hosting", "sharex"],
            "portfolio": ["portfolio", "site", "current site", "syl.rest"],
            "caravancraft": ["caravancraft", "minecraft", "smp", "server"],
            "dexchat": ["dexchat", "pokemon", "chatbot", "agentic"]
        }
        
        relevant_projects = []
        for project, keywords in project_keywords.items():
            if any(keyword in query for keyword in keywords):
                relevant_projects.append(project)
        
        if not relevant_projects:
            relevant_projects = list(project_keywords.keys())
        
        project_query = " ".join(relevant_projects)
        results = search_knowledge(project_query)
        project_results = [chunk for chunk in results if chunk.category == "projects"]
        
        return ToolResult(
            tool_name=self.name,
            result={
                "requested_projects": relevant_projects,
                "project_details": [
                    {
                        "id": chunk.id,
                        "content": chunk.content,
                        "keywords": chunk.keywords
                    } for chunk in project_results
                ]
            },
            execution_time=0,
            success=True
        )

class SkillAssessmentTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="skill_assessment",
            description="provides context-aware skill matching and explanations"
        )
    
    async def execute(self, input_data: Any, context: Optional[Dict] = None) -> ToolResult:
        query = input_data.get("query", "").lower() if isinstance(input_data, dict) else str(input_data).lower()
        
        skill_categories = {
            "frontend": ["frontend", "react", "javascript", "typescript", "html", "css", "ui"],
            "backend": ["backend", "python", "node", "database", "api", "server"],
            "devops": ["devops", "docker", "linux", "nginx", "tools", "deployment"],
            "misc": ["unity", "game", "ai", "generative", "mcp", "obs"]
        }
        
        relevant_categories = []
        for category, keywords in skill_categories.items():
            if any(keyword in query for keyword in keywords):
                relevant_categories.append(category)
        
        if not relevant_categories:
            relevant_categories = list(skill_categories.keys())
        
        skills_query = "skills " + " ".join(relevant_categories)
        results = search_knowledge(skills_query)
        skill_results = [chunk for chunk in results if chunk.category == "skills"]
        
        return ToolResult(
            tool_name=self.name,
            result={
                "requested_categories": relevant_categories,
                "skill_details": [
                    {
                        "id": chunk.id,
                        "content": chunk.content,
                        "category": chunk.category
                    } for chunk in skill_results
                ]
            },
            execution_time=0,
            success=True
        )

class ExperienceLookupTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="experience_lookup",
            description="retrieves work history and background information"
        )
    
    async def execute(self, input_data: Any, context: Optional[Dict] = None) -> ToolResult:
        query = input_data.get("query", "").lower() if isinstance(input_data, dict) else str(input_data).lower()
        
        company_keywords = {
            "navigate360": ["navigate360", "current", "2024"],
            "affinitiv": ["affinitiv", "autoloop", "2023"],
            "logicom": ["logicom", "internet", "fiber", "2021", "2022"],
            "unisys": ["unisys", "contract", "2020"]
        }
        
        relevant_companies = []
        for company, keywords in company_keywords.items():
            if any(keyword in query for keyword in keywords):
                relevant_companies.append(company)
        
        work_query = "work experience resume job"
        results = search_knowledge(work_query)
        work_results = [chunk for chunk in results if chunk.category in ["work", "personal"]]
        
        return ToolResult(
            tool_name=self.name,
            result={
                "experience_summary": [
                    {
                        "id": chunk.id,
                        "content": chunk.content,
                        "category": chunk.category
                    } for chunk in work_results
                ],
                "relevant_companies": relevant_companies
            },
            execution_time=0,
            success=True
        ) 