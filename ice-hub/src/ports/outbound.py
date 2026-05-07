from abc import ABC, abstractmethod
from typing import Optional
from src.domain.entities import Interaction, CreatorProfile, DraftResponse

class ILLMServicePort(ABC):
    """
    Structure for the AI generation service
    """
    @abstractmethod
    async def analyze_and_draft(self, interaction: Interaction, profile: CreatorProfile) -> DraftResponse:
        pass

class IInteractionRepositoryPort(ABC):
    """
    Structure for Persistence Layer
    """
    @abstractmethod
    async def save_interaction(self, interaction: Interaction) -> None:
        pass

    @abstractmethod
    async def save_draft_response(self, draft: DraftResponse) -> None:
        pass