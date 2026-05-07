from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from src.core.database import engine, Base

from sqladmin import Admin
from src.adapters.inbound.admin.views import InteractionAdmin, DraftResponseAdmin
from fastapi.middleware.cors import CORSMiddleware

# Hexagonal Architecture Imports
from src.core.config import settings

# API Routers
from src.adapters.inbound.api.routes import router as api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # creating database
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        print("🗄️ Database tables verified/created.")

    yield

app = FastAPI(lifespan=lifespan, title="Veel ICE-Hub API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Register the router to the app
app.include_router(api_router)
admin = Admin(app, engine)

# Add your views to the dashboard
admin.add_view(InteractionAdmin)
admin.add_view(DraftResponseAdmin)

if __name__ == "__main__":
    import uvicorn
    # Optional startup script for raw local tests
    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)