from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Enum as SQLEnum, Boolean
from src.core.database import Base
from src.domain.entities import Platform, IntentCategory

class InteractionRecord(Base):
    __tablename__ = "interactions"
    
    # We use mapped_column for strict SQLAlchemy 2.0 typing
    interaction_id: Mapped[str] = mapped_column(String, primary_key=True)
    source_platform: Mapped[Platform] = mapped_column(SQLEnum(Platform))
    author_handle: Mapped[str] = mapped_column(String)
    raw_content: Mapped[str] = mapped_column(Text)
    engagement_score: Mapped[int] = mapped_column(Integer, default=0)

class DraftResponseRecord(Base):
    __tablename__ = "draft_responses"
    
    interaction_id: Mapped[str] = mapped_column(String, primary_key=True)
    assigned_intent: Mapped[IntentCategory] = mapped_column(SQLEnum(IntentCategory))
    generated_reply: Mapped[str] = mapped_column(Text, nullable=True)
    is_approved: Mapped[bool] = mapped_column(Boolean, default=False)