import openai
from typing import List, Dict, Any, Optional
import logging
import time
import json
import re
from .config import settings

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.client = openai.OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=settings.openrouter_api_key
        )
        self.models = [
            "anthropic/claude-3.5-sonnet",
            "openai/gpt-4o",
            "anthropic/claude-3-haiku",
            "google/gemma-2-9b-it:free"
        ]
        self.current_model_index = 0
        logger.info(f"[AI SERVICE] initialized with {len(self.models)} models")
        logger.info(f"[AI SERVICE] default model: {self.models[0]}")
    
    def get_system_prompt(self) -> str:
        return """you are blake bowling's helpful portfolio assistant. respond naturally and conversationally while being completely accurate.

**CORE PRINCIPLE: only share information explicitly provided in the knowledge base, but make it sound natural**

**RESPONSE STYLE:**
- write like a knowledgeable friend helping someone learn about blake
- use natural, flowing language - avoid robotic phrases
- don't mention "knowledge base", "provided information", or validation processes
- if you don't have information, simply say you don't know that detail and suggest where to find more

**FORBIDDEN PHRASES (sound robotic):**
- "based on the provided knowledge"
- "i can only confirm" 
- "explicit information"
- "current knowledge base"
- "for a more complete picture"
- "remember, i can only confirm"
- "would require information not present"

**NATURAL ALTERNATIVES:**
- instead of "i can only confirm" → "blake has..." or "from what i know..."
- instead of "not in knowledge base" → "i don't have those details" or "that's not something i know about"
- instead of technical explanations → direct, helpful responses

**WHEN MISSING INFO:**
don't explain why you don't know - just acknowledge you don't have that specific detail and helpfully direct to relevant section:
- "i don't have details about [topic]. you might find more in **explore:[section]**"
- "that's not something i know about blake. **explore:[section]** might have more"

**ACCURACY RULES:**
- only state facts explicitly mentioned in provided context
- never add details, technologies, or specifics not given
- if context doesn't cover the question, acknowledge limitation naturally
- suggest exploration sections when appropriate

**TONE:**
- friendly and helpful
- concise but complete
- sounds like talking to someone who knows blake well
- confident about what you do know, honest about what you don't

make every response feel like natural conversation while being completely accurate to the provided facts."""

    def _validate_knowledge_coverage(self, user_message: str, knowledge_context: List[Dict]) -> bool:
        """validate if we have sufficient knowledge to answer the query"""
        if not knowledge_context:
            logger.warning("[VALIDATION] no knowledge context provided")
            return False
        
        query_lower = user_message.lower()
        knowledge_content = " ".join([item.get('content', '') for item in knowledge_context]).lower()
        
        required_info_found = False
        for item in knowledge_context:
            item_keywords = item.get('keywords', [])
            content = item.get('content', '').lower()
            
            query_words = re.sub(r'[^\w\s]', ' ', query_lower).split()
            query_words = [word for word in query_words if len(word) > 2]
            
            overlap = sum(1 for word in query_words if word in content or any(word in kw.lower() for kw in item_keywords))
            if overlap > 0:
                required_info_found = True
                break
        
        logger.info(f"[VALIDATION] knowledge coverage: {required_info_found}")
        return required_info_found

    def _generate_fallback_response(self, user_message: str) -> str:
        """generate appropriate fallback when no knowledge is available"""
        query_lower = user_message.lower()
        
        section_mapping = {
            'whoami': ['who', 'about', 'background', 'personal', 'bio', 'introduction'],
            'resume': ['work', 'job', 'experience', 'resume', 'career', 'employment'],
            'skills': ['skill', 'technical', 'technology', 'programming', 'expertise'],
            'projects': ['project', 'built', 'created', 'developed', 'portfolio'],
            'contact': ['contact', 'reach', 'email', 'message', 'touch']
        }
        
        suggested_section = 'whoami'
        for section, keywords in section_mapping.items():
            if any(keyword in query_lower for keyword in keywords):
                suggested_section = section
                break
        
        response = f"i don't have those details about blake. **explore:{suggested_section}**"
        logger.info(f"[FALLBACK] generated fallback response directing to: {suggested_section}")
        return response

    async def generate_response(
        self, 
        user_message: str, 
        knowledge_context: List[Dict] = None, 
        tool_results: List[Any] = None,
        conversation_context: List[Dict] = None
    ) -> str:
        start_time = time.time()
        logger.info(f"[LLM REQUEST] starting response generation")
        logger.info(f"[LLM INPUT] user_message: '{user_message}'")
        logger.info(f"[LLM CONTEXT] knowledge_items: {len(knowledge_context) if knowledge_context else 0}")
        
        if not knowledge_context:
            logger.warning("[LLM GUARD] no knowledge context provided, using fallback")
            logger.info(f"[VALIDATION] fallback reason: no knowledge context for query: '{user_message}'")
            return self._generate_fallback_response(user_message)
        
        if not self._validate_knowledge_coverage(user_message, knowledge_context):
            logger.warning("[LLM GUARD] insufficient knowledge coverage, using fallback")
            logger.info(f"[VALIDATION] fallback reason: insufficient coverage for query: '{user_message}'")
            return self._generate_fallback_response(user_message)
        
        context_info = "**INFORMATION ABOUT BLAKE:**\n\n"
        for i, item in enumerate(knowledge_context[:3]):
            content = item.get('content', '')
            context_info += f"{content}\n\n"
            logger.debug(f"[LLM KNOWLEDGE] item_{i}: {content[:100]}...")
        
        context_info += "**IMPORTANT: respond naturally using only the information above. if you don't have specific details the user asks about, simply say you don't know that detail and suggest exploring the relevant section.**"
        
        messages = [
            {"role": "system", "content": self.get_system_prompt()}
        ]
        
        if conversation_context:
            context_messages = conversation_context[-2:]
            logger.info(f"[LLM HISTORY] including {len(context_messages)} previous messages")
            for msg in context_messages:
                if msg.get("role") in ["user", "assistant"]:
                    messages.append({
                        "role": msg["role"],
                        "content": msg.get("content", "")
                    })
        
        user_content = f"{context_info}\n\nUSER QUESTION: {user_message}\n\nREMEMBER: only use facts explicitly stated in the knowledge base context above."
        
        messages.append({
            "role": "user",
            "content": user_content
        })
        
        logger.info(f"[LLM MESSAGES] total_messages: {len(messages)}")
        
        try:
            response = await self._make_request(messages)
            
            if self._validate_response_against_knowledge(response, knowledge_context):
                total_time = time.time() - start_time
                logger.info(f"[LLM COMPLETE] validated response in {total_time:.2f}s")
                logger.info(f"[VALIDATION] response passed all validation checks")
                return response
            else:
                logger.warning("[LLM GUARD] response failed validation, using fallback")
                logger.info(f"[VALIDATION] fallback reason: response failed post-generation validation")
                return self._generate_fallback_response(user_message)
                
        except Exception as e:
            logger.error(f"[LLM ERROR] generation failed: {e}")
            return self._generate_fallback_response(user_message)

    def _validate_response_against_knowledge(self, response: str, knowledge_context: List[Dict]) -> bool:
        """validate that response only contains information from knowledge base"""
        if not response or not knowledge_context:
            return False
        
        response_lower = response.lower()
        all_knowledge_text = " ".join([item.get('content', '') for item in knowledge_context]).lower()
        
        critical_flags = [
            "don't have that information",
            "not available in",
            "explore:",
            "contact blake directly"
        ]
        
        if any(flag in response_lower for flag in critical_flags):
            logger.info("[VALIDATION] response appropriately indicates knowledge limitation")
            return True
        
        suspicious_phrases = [
            "also known for",
            "in addition to",
            "furthermore",
            "additionally",
            "moreover",
            "it's worth noting",
            "beyond what's mentioned"
        ]
        
        if any(phrase in response_lower for phrase in suspicious_phrases):
            logger.warning("[VALIDATION] response contains suspicious expansion phrases")
            return False
        
        logger.info("[VALIDATION] response passed validation checks")
        return True

    def _estimate_tokens(self, messages: List[Dict]) -> int:
        total_chars = sum(len(msg.get("content", "")) for msg in messages)
        return total_chars // 4
    
    async def _make_request(self, messages: List[Dict]) -> str:
        for attempt in range(len(self.models)):
            try:
                current_model = self.models[self.current_model_index]
                logger.info(f"[LLM MODEL] using model: {current_model} (attempt {attempt + 1})")
                
                request_start = time.time()
                
                response = self.client.chat.completions.create(
                    model=current_model,
                    messages=messages,
                    max_tokens=500,
                    temperature=0.3
                )
                
                request_time = time.time() - request_start
                logger.info(f"[LLM API] model: {current_model}, request_time: {request_time:.2f}s")
                
                if hasattr(response, 'usage') and response.usage:
                    usage = response.usage
                    logger.info(f"[LLM TOKENS] prompt: {usage.prompt_tokens}, completion: {usage.completion_tokens}, total: {usage.total_tokens}")
                
                content = response.choices[0].message.content
                if content:
                    logger.info(f"[LLM SUCCESS] model: {current_model}, response_length: {len(content)}")
                    return content.strip()
                
                logger.warning(f"[LLM WARNING] empty response from model: {current_model}")
                raise Exception("empty response from model")
                
            except Exception as e:
                logger.warning(f"[LLM ERROR] model: {current_model}, error: {e}")
                
                if "rate limit" in str(e).lower():
                    logger.warning(f"[LLM RATE_LIMIT] model: {current_model}, switching to next model")
                elif "quota" in str(e).lower():
                    logger.warning(f"[LLM QUOTA] model: {current_model}, quota exceeded")
                else:
                    logger.error(f"[LLM FAILURE] model: {current_model}, unexpected error: {type(e).__name__}")
                
                self.current_model_index = (self.current_model_index + 1) % len(self.models)
                next_model = self.models[self.current_model_index]
                logger.info(f"[LLM FALLBACK] switching to model: {next_model}")
                
                if attempt == len(self.models) - 1:
                    logger.error(f"[LLM EXHAUSTED] all models failed after {len(self.models)} attempts")
                    return "i'm experiencing technical difficulties. please try the [contact] section to reach blake directly."
        
        logger.error("[LLM FAILURE] service completely unavailable")
        return "service temporarily unavailable. please contact blake directly through the [contact] section." 