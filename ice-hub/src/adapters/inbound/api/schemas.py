from pydantic import BaseModel, Field
from typing import List, Optional
from src.domain.entities import Platform, IntentCategory

# What the Veel Frontend sends to us
class AnalyzeInteractionRequest(BaseModel):
    platform: Platform
    author_username: str
    text_content: str = Field(..., min_length=1, max_length=5000)
    creator_id: str

class BatchInteractionRequest(BaseModel):
    interactions: List[AnalyzeInteractionRequest]
    
# What we send back to the Veel Frontend
class AnalyzeInteractionResponse(BaseModel):
    id: str
    status: str
    intent: IntentCategory
    suggested_reply: Optional[str] = None
    extracted_tags: List[str] = []

class BatchDraftResponse(BaseModel):
    results: List[AnalyzeInteractionResponse]
    