from fastapi import APIRouter, Depends, HTTPException
import uuid

# Import our DTOs
from src.adapters.inbound.api.schemas import (
    AnalyzeInteractionRequest, 
    AnalyzeInteractionResponse,
    BatchInteractionRequest,
    BatchDraftResponse
)

# Import our Domain Entities and Use Case
from src.domain.entities import Interaction, CreatorProfile
from src.ports.inbound import IAnalyzeInteractionUseCase

# In a real app, this dependency comes from main.py as we discussed
from src.core.dependencies import get_analyzer_service 


router = APIRouter(prefix="/api/v1", tags=["Analysis"])

@router.post("/analyze", response_model=AnalyzeInteractionResponse)
async def analyze_message(
    request_data: AnalyzeInteractionRequest,
    # FastAPI automatically injects your core business logic here
    analyzer_service: IAnalyzeInteractionUseCase = Depends(get_analyzer_service)
):
    try:
        # 1. Translate the inbound DTO into a strict Domain Entity
        interaction = Interaction(
            interaction_id=f"evt_{uuid.uuid4().hex[:8]}",
            source_platform=request_data.platform,
            author_handle=request_data.author_username,
            raw_content=request_data.text_content,
            engagement_score=0 # Default for a brand new message
        )
        
        # Fake a profile for now (Later, fetch this from the DB using request_data.creator_id)
        profile = CreatorProfile(
            profile_id=request_data.creator_id,
            creator_name="Alex",
            preferred_tone="Professional and appreciative"
        )

        # 2. Hand it to the core application brain
        draft_result = await analyzer_service.execute(interaction, profile)

        # 3. Translate the internal result back to an outbound DTO
        return AnalyzeInteractionResponse(
            id=draft_result.interaction_id,
            status="success",
            intent=draft_result.assigned_intent,
            suggested_reply=draft_result.generated_reply,
            extracted_tags=draft_result.extracted_entities
        )

    except ValueError as e:
        # Catch our strict Pydantic Domain validation errors
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.post("/analyze/batch", response_model=BatchDraftResponse)
async def analyze_batch_messages(
    request_data: BatchInteractionRequest,
    analyzer_service: IAnalyzeInteractionUseCase = Depends(get_analyzer_service)
):
    try:
        interactions = []
        creator_id = None
        
        # Parse requests to domain entities
        for req in request_data.interactions:
            if not creator_id:
                creator_id = req.creator_id
                
            interactions.append(Interaction(
                interaction_id=f"evt_{uuid.uuid4().hex[:8]}",
                source_platform=req.platform,
                author_handle=req.author_username,
                raw_content=req.text_content,
                engagement_score=0
            ))
            
        if not interactions:
            return BatchDraftResponse(results=[])

        # Fake a profile for now
        profile = CreatorProfile(
            profile_id=creator_id,
            creator_name="Alex",
            preferred_tone="Professional and appreciative"
        )

        # 2. Hand it to the core application brain for batch processing
        draft_results = await analyzer_service.execute_batch(interactions, profile)

        # 3. Translate domain objects mapping back to outbound DTOs
        responses = [
            AnalyzeInteractionResponse(
                id=draft.interaction_id,
                status="success",
                intent=draft.assigned_intent,
                suggested_reply=draft.generated_reply,
                extracted_tags=draft.extracted_entities
            ) for draft in draft_results
        ]
        
        return BatchDraftResponse(results=responses)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")