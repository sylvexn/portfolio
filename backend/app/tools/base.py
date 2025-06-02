from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from dataclasses import dataclass
import time
import logging

logger = logging.getLogger(__name__)

@dataclass
class ToolResult:
    tool_name: str
    result: Any
    execution_time: float
    success: bool = True
    error: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class BaseTool(ABC):
    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description
        
    @abstractmethod
    async def execute(self, input_data: Any, context: Optional[Dict] = None) -> ToolResult:
        pass
    
    def get_info(self) -> Dict[str, str]:
        return {
            "name": self.name,
            "description": self.description
        }
    
    async def _safe_execute(self, input_data: Any, context: Optional[Dict] = None) -> ToolResult:
        start_time = time.time()
        try:
            result = await self.execute(input_data, context)
            result.execution_time = time.time() - start_time
            return result
        except Exception as e:
            execution_time = time.time() - start_time
            logger.error(f"tool {self.name} execution failed: {e}")
            return ToolResult(
                tool_name=self.name,
                result=None,
                execution_time=execution_time,
                success=False,
                error=str(e)
            ) 