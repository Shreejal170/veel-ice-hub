from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from src.core.config import settings
from sqlalchemy.orm import declarative_base

# The declarative base is the parent class for all our SQL tables
Base = declarative_base()

# Create the async engine connected to our local SQLite file
engine = create_async_engine(settings.database_url, echo=False)

# Create a factory that generates new database sessions
AsyncSessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

async def get_db_session():
    """
    FastAPI dependency that provides a clean database session per request.
    It automatically closes the connection when the request finishes.
    """
    async with AsyncSessionLocal() as session:
        yield session