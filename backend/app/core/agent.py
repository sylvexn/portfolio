from typing import Dict, Any, List, Optional, Tuple
import logging
import asyncio
import time
import re
from ..tools.base import BaseTool, ToolResult
from ..tools.navigation_tools import ShowModalTool, SuggestSectionsTool, NavigationGuideTool, IntelligentModalSelectorTool
from ..tools.information_tools import KnowledgeSearchTool, ProjectDetailsTool, SkillAssessmentTool, ExperienceLookupTool  
from ..tools.interaction_tools import ContactFacilitatorTool, ConversationSummarizerTool, FollowUpGeneratorTool
from ..tools.utility_tools import ClarificationTool, ErrorHandlerTool, AnalyticsTool
from .database import ToolExecutionManager
from .ai_service import AIService

logger = logging.getLogger(__name__)

class AgentController:
    def __init__(self):
        self.tools: Dict[str, BaseTool] = {}
        self.ai_service = AIService()
        self._register_tools()
        logger.info(f"[AGENT] controller initialized with {len(self.tools)} tools")
    
    def _register_tools(self):
        tools = [
            ShowModalTool(),
            SuggestSectionsTool(),
            NavigationGuideTool(),
            IntelligentModalSelectorTool(),
            KnowledgeSearchTool(),
            ProjectDetailsTool(),
            SkillAssessmentTool(),
            ExperienceLookupTool(),
            ContactFacilitatorTool(),
            ConversationSummarizerTool(),
            FollowUpGeneratorTool(),
            ClarificationTool(),
            ErrorHandlerTool(),
            AnalyticsTool()
        ]
        
        for tool in tools:
            self.tools[tool.name] = tool
            logger.debug(f"[AGENT] registered tool: {tool.name}")
        
        logger.info(f"[AGENT] tool registration complete: {list(self.tools.keys())}")
    
    def get_available_tools(self) -> List[Dict[str, str]]:
        logger.debug(f"[AGENT] returning {len(self.tools)} available tools")
        return [tool.get_info() for tool in self.tools.values()]
    
    def _validate_knowledge_item(self, knowledge_item: Dict[str, Any], user_query: str) -> bool:
        """validate that a knowledge item is relevant and contains useful information"""
        if not knowledge_item or not isinstance(knowledge_item, dict):
            return False
        
        content = knowledge_item.get('content', '')
        if not content or len(content.strip()) < 10:
            logger.debug("[VALIDATION] knowledge item has insufficient content")
            return False
        
        query_words = re.sub(r'[^\w\s]', ' ', user_query.lower()).split()
        query_words = [word for word in query_words if len(word) > 2]
        
        content_lower = content.lower()
        keywords = knowledge_item.get('keywords', [])
        
        relevance_score = 0
        for word in query_words:
            if word in content_lower:
                relevance_score += 1
            if any(word in kw.lower() for kw in keywords):
                relevance_score += 2
        
        is_relevant = relevance_score > 0
        logger.debug(f"[VALIDATION] knowledge item relevance: {is_relevant} (score: {relevance_score})")
        return is_relevant
    
    def _generate_no_knowledge_response(self, user_message: str) -> str:
        """generate appropriate response when no valid knowledge is found"""
        query_lower = user_message.lower()
        
        section_mapping = {
            'skills': ['skill', 'skills', 'technical', 'technology', 'tech', 'stack', 'programming', 'development', 'coding', 'language', 'framework', 'tools', 'frontend', 'backend', 'database', 'api', 'technologies', 'expertise'],
            'projects': ['project', 'projects', 'built', 'created', 'developed', 'portfolio', 'work', 'app', 'website', 'keepsake', 'dexchat', 'caravancraft', 'made'],
            'resume': ['work', 'job', 'experience', 'resume', 'career', 'professional', 'employment', 'history', 'background'],
            'contact': ['contact', 'reach', 'email', 'message', 'hire', 'available', 'touch', 'connect'],
            'whoami': ['who', 'about', 'personal', 'bio', 'person', 'blake', 'yourself']
        }
        
        suggested_section = 'whoami'
        for section, keywords in section_mapping.items():
            if any(keyword in query_lower for keyword in keywords):
                suggested_section = section
                break
        
        return f"i don't have specific details about that. **explore:{suggested_section}**"
    
    async def analyze_intent(self, user_message: str, context: Optional[List[Dict]] = None) -> Dict[str, Any]:
        start_time = time.time()
        logger.info(f"[INTENT] analyzing message: '{user_message}'")
        
        intent_keywords = {
            "navigation": ["show", "open", "go to", "navigate", "section", "modal"],
            "knowledge_search": ["tell me", "about", "what", "how", "why", "explain"],
            "projects": ["project", "projects", "built", "created", "developed", "keepsake", "portfolio", "dexchat", "caravancraft", "work", "app", "website"],
            "skills": ["skills", "technical", "technologies", "programming", "expertise", "tech", "stack", "language", "framework", "tools", "development", "coding", "frontend", "backend", "database", "api"],
            "experience": ["work", "job", "experience", "resume", "career", "background", "employment", "professional"],
            "contact": ["contact", "reach", "email", "get in touch", "message", "hire", "available"],
            "conversation": ["summary", "recap", "what did we discuss", "conversation"]
        }
        
        message_lower = user_message.lower()
        detected_intents = []
        
        for intent, keywords in intent_keywords.items():
            matched_keywords = [kw for kw in keywords if kw in message_lower]
            if matched_keywords:
                detected_intents.append(intent)
                logger.debug(f"[INTENT] detected '{intent}' via keywords: {matched_keywords}")
        
        primary_intent = detected_intents[0] if detected_intents else "knowledge_search"
        
        modal_pattern = ["whoami", "resume", "skills", "projects", "contact"]
        mentioned_modals = []
        
        modal_keywords = {
            "whoami": ["who", "about", "background", "personal", "bio", "person", "blake", "yourself"],
            "resume": ["work", "job", "experience", "resume", "career", "professional", "employment", "history"],
            "skills": ["skill", "skills", "technical", "technology", "tech", "stack", "programming", "development", "coding", "language", "framework", "tools", "frontend", "backend", "database", "api", "technologies", "expertise"],
            "projects": ["project", "projects", "built", "created", "developed", "portfolio", "work", "app", "website", "keepsake", "dexchat", "caravancraft", "built", "made"],
            "contact": ["contact", "reach", "email", "message", "hire", "available", "touch", "connect"]
        }
        
        for modal, keywords in modal_keywords.items():
            matched_keywords = [kw for kw in keywords if kw in message_lower]
            if matched_keywords:
                mentioned_modals.append(modal)
                logger.debug(f"[INTENT] detected modal '{modal}' via keywords: {matched_keywords}")
        
        if "skills" in detected_intents and "skills" not in mentioned_modals:
            mentioned_modals.append("skills")
            logger.debug("[INTENT] added skills modal due to skills intent")
        
        if "projects" in detected_intents and "projects" not in mentioned_modals:
            mentioned_modals.append("projects")
            logger.debug("[INTENT] added projects modal due to projects intent")
        
        if "experience" in detected_intents and "resume" not in mentioned_modals:
            mentioned_modals.append("resume")
            logger.debug("[INTENT] added resume modal due to experience intent")
        
        if "contact" in detected_intents and "contact" not in mentioned_modals:
            mentioned_modals.append("contact")
            logger.debug("[INTENT] added contact modal due to contact intent")
        
        mentioned_modals = list(dict.fromkeys(mentioned_modals))
        
        if len(mentioned_modals) > 1:
            priority_order = {
                "skills": 5,
                "projects": 4, 
                "resume": 3,
                "whoami": 2,
                "contact": 1
            }
            mentioned_modals = sorted(mentioned_modals, key=lambda x: priority_order.get(x, 0), reverse=True)
            mentioned_modals = mentioned_modals[:1]
        
        analysis_time = time.time() - start_time
        
        result = {
            "primary_intent": primary_intent,
            "detected_intents": detected_intents,
            "mentioned_modals": mentioned_modals,
            "requires_modal": len(mentioned_modals) > 0,
            "confidence": len(detected_intents) / max(len(intent_keywords), 1)
        }
        
        logger.info(f"[INTENT] analysis complete in {analysis_time:.3f}s")
        logger.info(f"[INTENT] primary: {primary_intent}, confidence: {result['confidence']:.2f}")
        logger.info(f"[INTENT] detected: {detected_intents}")
        logger.info(f"[INTENT] modals: {mentioned_modals}")
        
        return result
    
    async def select_tools(self, intent_analysis: Dict[str, Any], user_message: str) -> List[str]:
        start_time = time.time()
        primary_intent = intent_analysis["primary_intent"]
        mentioned_modals = intent_analysis["mentioned_modals"]
        
        logger.info(f"[TOOL_SELECT] selecting tools for intent: {primary_intent}")
        
        tool_mapping = {
            "navigation": ["navigation_guide", "suggest_sections"],
            "knowledge_search": ["knowledge_search"],
            "projects": ["project_details", "knowledge_search"],
            "skills": ["skill_assessment", "knowledge_search"],
            "experience": ["experience_lookup", "knowledge_search"],
            "contact": ["contact_facilitator", "knowledge_search"],
            "conversation": ["conversation_summarizer", "follow_up_generator"]
        }
        
        selected_tools = tool_mapping.get(primary_intent, ["knowledge_search"])
        
        final_tools = selected_tools[:3]
        selection_time = time.time() - start_time
        
        logger.info(f"[TOOL_SELECT] selected {len(final_tools)} tools in {selection_time:.3f}s: {final_tools}")
        
        return final_tools
    
    async def execute_tool(self, tool_name: str, input_data: Any, context: Optional[Dict] = None, session_id: str = "") -> ToolResult:
        start_time = time.time()
        logger.info(f"[TOOL_EXEC] executing tool: {tool_name}")
        logger.debug(f"[TOOL_EXEC] input_data: {input_data}")
        
        if tool_name not in self.tools:
            logger.error(f"[TOOL_EXEC] tool not found: {tool_name}")
            return ToolResult(
                tool_name=tool_name,
                result=None,
                execution_time=0,
                success=False,
                error=f"tool '{tool_name}' not found"
            )
        
        tool = self.tools[tool_name]
        result = await tool._safe_execute(input_data, context)
        
        execution_time = time.time() - start_time
        
        logger.info(f"[TOOL_EXEC] tool: {tool_name}, success: {result.success}, time: {execution_time:.3f}s")
        
        if result.success:
            logger.debug(f"[TOOL_EXEC] result preview: {str(result.result)[:200]}...")
        else:
            logger.warning(f"[TOOL_EXEC] tool failed: {result.error}")
        
        if session_id:
            ToolExecutionManager.log_execution(
                session_id=session_id,
                tool_name=tool_name,
                input_data=input_data,
                output_data=result.result,
                execution_time=result.execution_time,
                success=result.success
            )
            logger.debug(f"[TOOL_EXEC] logged execution to database for session: {session_id}")
        
        return result
    
    async def _get_intelligent_modal_suggestion(self, user_message: str, context: Optional[List[Dict]] = None) -> Optional[str]:
        """use intelligent modal selector to determine the best modal suggestion"""
        try:
            result = await self.execute_tool(
                "intelligent_modal_selector",
                {"query": user_message},
                {"user_message": user_message, "context": context},
                ""
            )
            
            if result.success and result.result:
                modal_id = result.result.get("recommended_modal")
                confidence = result.result.get("confidence_score", 0)
                reasoning = result.result.get("reasoning", [])
                
                logger.info(f"[MODAL_SELECTOR] recommended: {modal_id}, confidence: {confidence}, reasoning: {reasoning}")
                
                if confidence > 0:
                    return modal_id
                    
        except Exception as e:
            logger.error(f"[MODAL_SELECTOR] error: {e}")
            
        return None

    async def _generate_modal_suggestion(self, user_message: str, intent_analysis: Dict[str, Any]) -> str:
        """generate modal suggestion using intelligent analysis"""
        modal_id = await self._get_intelligent_modal_suggestion(user_message)
        
        if modal_id:
            logger.info(f"[MODAL_SUGGESTION] intelligent selector chose: {modal_id}")
            return f" **explore:{modal_id}**"
        
        mentioned_modals = intent_analysis.get("mentioned_modals", [])
        if mentioned_modals:
            modal_id = mentioned_modals[0]
            logger.info(f"[MODAL_SUGGESTION] fallback to intent analysis: {modal_id}")
            return f" **explore:{modal_id}**"
        
        return ""

    async def process_message(self, user_message: str, session_id: str, context: Optional[List[Dict]] = None) -> Dict[str, Any]:
        start_time = time.time()
        logger.info(f"[AGENT_PROCESS] starting message processing for session: {session_id}")
        logger.info(f"[AGENT_PROCESS] message: '{user_message}'")
        
        try:
            intent_analysis = await self.analyze_intent(user_message, context)
            selected_tools = await self.select_tools(intent_analysis, user_message)
            
            logger.info(f"[AGENT_PROCESS] executing {len(selected_tools)} tools")
            
            tool_results = []
            
            for i, tool_name in enumerate(selected_tools):
                logger.info(f"[AGENT_PROCESS] executing tool {i+1}/{len(selected_tools)}: {tool_name}")
                
                result = await self.execute_tool(
                    tool_name,
                    {"query": user_message},
                    {"user_message": user_message, "context": context},
                    session_id
                )
                tool_results.append(result)
            
            successful_tools = [r for r in tool_results if r.success]
            logger.info(f"[AGENT_PROCESS] successful tools: {len(successful_tools)}/{len(tool_results)}")
            
            knowledge_context = []
            for result in tool_results:
                if result.success and result.tool_name == "knowledge_search" and result.result:
                    knowledge_items = result.result.get("results", [])
                    
                    validated_items = []
                    for item in knowledge_items:
                        if self._validate_knowledge_item(item, user_message):
                            validated_items.append(item)
                    
                    if validated_items:
                        knowledge_context.extend(validated_items)
                        logger.info(f"[AGENT_PROCESS] added {len(validated_items)} validated knowledge items from {result.tool_name}")
                    else:
                        logger.warning(f"[AGENT_PROCESS] no valid knowledge items found in {result.tool_name} results")
            
            if not knowledge_context:
                logger.warning("[AGENT_GUARD] no valid knowledge context found for user query")
                return {
                    "message": self._generate_no_knowledge_response(user_message),
                    "tool_results": [
                        {
                            "tool_name": "validation_guard",
                            "result": {
                                "status": "no_knowledge_found",
                                "query": user_message,
                                "attempted_tools": [r.tool_name for r in tool_results],
                                "validation_reason": "no relevant knowledge items passed validation"
                            },
                            "execution_time": 0
                        }
                    ],
                    "modal_actions": [],
                    "suggestions": ["explore blake's portfolio sections", "ask about specific topics"],
                    "intent_analysis": intent_analysis
                }
            
            logger.info(f"[AGENT_PROCESS] generating AI response with {len(knowledge_context)} validated knowledge items")
            
            validation_metadata = {
                "knowledge_items_found": sum(len(r.result.get("results", [])) for r in tool_results if r.success and r.tool_name == "knowledge_search"),
                "knowledge_items_validated": len(knowledge_context),
                "validation_passed": True,
                "fallback_triggered": False
            }
            
            ai_response = await self.ai_service.generate_response(
                user_message=user_message,
                knowledge_context=knowledge_context,
                tool_results=tool_results,
                conversation_context=context
            )
            
            modal_suggestion = await self._generate_modal_suggestion(user_message, intent_analysis)
            if modal_suggestion:
                ai_response += modal_suggestion
                logger.info(f"[AGENT_PROCESS] added modal suggestion: {modal_suggestion}")
            
            suggestions = []
            if tool_results:
                follow_up_result = next(
                    (r for r in tool_results if r.tool_name == "follow_up_generator"), 
                    None
                )
                if follow_up_result and follow_up_result.success:
                    suggestions = follow_up_result.result.get("suggestions", [])
                    logger.info(f"[AGENT_PROCESS] generated {len(suggestions)} suggestions")
            
            total_time = time.time() - start_time
            
            result = {
                "message": ai_response,
                "tool_results": [
                    {
                        "tool_name": r.tool_name,
                        "result": r.result,
                        "execution_time": r.execution_time
                    } for r in tool_results if r.success
                ] + [
                    {
                        "tool_name": "knowledge_validation",
                        "result": validation_metadata,
                        "execution_time": 0
                    }
                ],
                "modal_actions": [],
                "suggestions": suggestions,
                "intent_analysis": intent_analysis
            }
            
            logger.info(f"[AGENT_PROCESS] processing complete in {total_time:.2f}s")
            logger.info(f"[AGENT_PROCESS] final response length: {len(ai_response)}")
            
            return result
            
        except Exception as e:
            error_time = time.time() - start_time
            logger.error(f"[AGENT_ERROR] processing failed in {error_time:.2f}s: {e}")
            logger.error(f"[AGENT_ERROR] session: {session_id}, message: '{user_message}'")
            logger.error(f"[AGENT_ERROR] exception type: {type(e).__name__}")
            
            return {
                "message": "i encountered an error processing your request. please try again or contact blake directly.",
                "tool_results": [],
                "modal_actions": [],
                "suggestions": ["try rephrasing your question", "contact blake directly"],
                "error": str(e)
            } 