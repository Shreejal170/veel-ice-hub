from datetime import datetime, timezone
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field, model_validator, field_validator

# ---------------------------------------------------------
# Enums for Strict Type Safety
# ---------------------------------------------------------
class Platform(str, Enum):
    YOUTUBE = "youtube"
    GMAIL = "gmail"
    TWITTER = "twitter"
    DISCORD = "discord"
    INSTAGRAM = "instagram"
    TIKTOK = "tiktok"

class IntentCategory(str, Enum):
    SPAM = "Spam"
    FAN_SUPPORT = "Fan_Support"
    SPONSORSHIP = "Sponsorship"
    TECH_ISSUE = "Tech_Issue"
    TROLL = "Troll"
    SECURITY_THREAT = "Security_Threat" # to check the prompt injection
    UNKNOWN = "Unknown"

# ---------------------------------------------------------
# Core Entities
# ---------------------------------------------------------
class CreatorProfile(BaseModel):
    """Represents the creator's configuration and preferences."""
    profile_id: str
    creator_name: str
    preferred_tone: str = Field(
        default="Professional but enthusiastic",
        description="The persona the LLM should adopt when drafting replies."
    )
    auto_discard_spam: bool = Field(
        default=True, 
        description="If True, spam is dropped before reaching the dashboard."
    )

class Interaction(BaseModel):
    """Represents an incoming message from the audience."""
    interaction_id: str
    source_platform: Platform
    author_handle: str
    raw_content: str = Field(..., min_length=1, description="The actual message text.")
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    engagement_score: int = Field(default=0, ge=0) # Must be greater than or equal to 0

    @field_validator('raw_content')
    @classmethod
    def sanitize_content(cls, v: str) -> str:
        """Basic sanitization: Strip out zero-width characters or excess whitespace."""
        return " ".join(v.split())

    @model_validator(mode='after')
    def enforce_content_rules(self):
        """Business Rule: Highly upvoted/engaged comments shouldn't be empty noise."""
        if self.engagement_score > 50 and len(self.raw_content) < 5:
            raise ValueError("Interactions with high engagement must contain substantive text.")
        return self

class DraftResponse(BaseModel):
    """Represents the final analyzed and drafted response."""
    interaction_id: str
    assigned_intent: IntentCategory
    extracted_entities: List[str] = Field(
        default_factory=list, 
        description="e.g., Brand names, product mentions."
    )
    generated_reply: Optional[str] = Field(
        default=None, 
        description="The AI-drafted reply. Null if spam."
    )
    is_approved: bool = Field(default=False)

    @model_validator(mode='after')
    def enforce_reply_logic(self):
        """
        Business Rule: If it's a sponsorship or tech issue, we MUST have a drafted reply.
        If it's spam, a troll, or a security threat we should NOT have a drafted reply.
        """
        needs_reply = self.assigned_intent in [IntentCategory.SPONSORSHIP, IntentCategory.TECH_ISSUE]
        is_junk = self.assigned_intent in [IntentCategory.SPAM, IntentCategory.TROLL, IntentCategory.SECURITY_THREAT]

        if needs_reply and not self.generated_reply:
            raise ValueError(f"A drafted reply is required for intent: {self.assigned_intent}")
        
        if is_junk and self.generated_reply:
            raise ValueError(f"Do not waste compute generating replies for: {self.assigned_intent}")
            
        return self
    

if __name__ == '__main__':
    try:
        obj = DraftResponse(interaction_id="str", 
                        assigned_intent="Sponsorship", 
                        extracted_entities=['nth', 'nothing'], 
                        generated_reply="")
    except Exception as e:
        print(e)