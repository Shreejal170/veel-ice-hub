import asyncio
from typing import List
from src.domain.entities import Interaction, CreatorProfile, DraftResponse, IntentCategory
from src.ports.inbound import IAnalyzeInteractionUseCase
from src.ports.outbound import ILLMServicePort, IInteractionRepositoryPort

class InteractionAnalyzerService(IAnalyzeInteractionUseCase):
    def __init__(
        self, 
        llm_service: ILLMServicePort, 
        repository: IInteractionRepositoryPort
    ):
        self.llm_service = llm_service
        self.repository = repository

    async def execute(self, interaction: Interaction, profile: CreatorProfile) -> DraftResponse:
        # 1. Log the raw interaction
        await self.repository.save_interaction(interaction)

        # 2. Gemini Security Firewall & AI assistant Phase
        draft_response = await self.llm_service.analyze_and_draft(interaction, profile)
        
        # 3. Save and return the final AI result
        await self.repository.save_draft_response(draft_response)
        return draft_response

    async def execute_batch(self, interactions: List[Interaction], profile: CreatorProfile) -> List[DraftResponse]:
        tasks = [self.execute(i, profile) for i in interactions]
        
        # Run all tasks concurrently without artificial semaphore limit.
        # return_exceptions=True prevents one failed API call from crashing the entire batch.
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        successful_responses = []
        for result in results:
            if isinstance(result, Exception):
                print(f"Batch processing error: {result}")
            else:
                successful_responses.append(result)
                
        return successful_responses