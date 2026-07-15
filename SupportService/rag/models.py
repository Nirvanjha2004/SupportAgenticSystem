from pydantic import BaseModel, Field
from typing import List, Optional

class Source(BaseModel):
    index: int = Field(..., description="Source number used in citations")
    title: str
    source_type: str
    url: Optional[str] = None
    timestamp: Optional[str] = None

class CitedAnswer(BaseModel):
    answer: str = Field(..., description="The final answer to the user's question")
    citations: List[int] = Field(default_factory=list, description="Source indices cited in the answer")
    confidence: str = Field(..., description="high, medium, or low based on context quality")
    follow_up_suggestion: Optional[str] = Field(
        None, 
        description="Suggested follow-up question or clarification if answer is incomplete"
    )