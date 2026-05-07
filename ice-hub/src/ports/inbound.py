from typing import List
from abc import ABC, abstractmethod
from src.domain.entities import Interaction, CreatorProfile, DraftResponse

class IAnalyzeInteractionUseCase(ABC):
    """
    The primary use case for ICE-Hub. 
    External adapters (like a REST API) will call this.
    """
    @abstractmethod
    async def execute(self, interaction: Interaction, profile: CreatorProfile) -> DraftResponse:
        pass

    @abstractmethod
    async def execute_batch(self, interactions: List[Interaction], profile: CreatorProfile) -> List[DraftResponse]:
        pass