from fastapi import Request, Depends
from sqlalchemy.ext.asyncio import AsyncSession 
from src.core.database import get_db_session
from src.core.config import settings

# Adapters
from src.adapters.outbound.llm.deepseek_ai import DeepSeekAdapter
from src.adapters.outbound.database.adapter import SQLAlchemyDatabaseAdapter

# Services
from src.services.analyzer import InteractionAnalyzerService

# --- The Dependency Injector ---
def get_analyzer_service(
    request: Request,
    session: AsyncSession = Depends(get_db_session)
) -> InteractionAnalyzerService:
    """
    The Dependency Injector that wires up the Hexagonal Architecture.
    """
    
    # 1. REAL DeepSeek LLM Adapter
    llm_adapter = DeepSeekAdapter(
        api_key=settings.deepseek_api_key.get_secret_value() 
    ) 
    
    # 2. Database Adapter
    db_adapter = SQLAlchemyDatabaseAdapter(session=session)
    
    return InteractionAnalyzerService(
        llm_service=llm_adapter,
        repository=db_adapter
    )