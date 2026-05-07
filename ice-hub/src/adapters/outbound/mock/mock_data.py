import asyncio
from typing import Dict

from src.ports.outbound import IInteractionRepositoryPort
from src.domain.entities import Interaction, DraftResponse

class MockDatabaseAdapter(IInteractionRepositoryPort):
    def __init__(self):
        """
        Instead of connecting to SQLite/Postgres, we just use standard 
        Python dictionaries to act as our 'tables' in RAM.
        """
        self.interactions_table: Dict[str, Interaction] = {}
        self.drafts_table: Dict[str, DraftResponse] = {}

    async def save_interaction(self, interaction: Interaction) -> None:
        """Saves the raw incoming message."""
        # Simulate a slight database network delay
        await asyncio.sleep(0.1) 
        
        # Save to our in-memory 'table'
        self.interactions_table[interaction.interaction_id] = interaction
        
        # Print to terminal so we can visually confirm it worked during testing
        print(f"🗄️ [MOCK DB] Saved Interaction: {interaction.interaction_id} from {interaction.author_handle}")

    async def save_draft_response(self, draft: DraftResponse) -> None:
        """Saves the AI-generated analysis and reply."""
        await asyncio.sleep(0.1)
        
        self.drafts_table[draft.interaction_id] = draft
        
        print(f"🗄️ [MOCK DB] Saved Draft for {draft.interaction_id}. Intent: {draft.assigned_intent}")
        if draft.generated_reply:
            print(f"   ↳ Drafted Reply: {draft.generated_reply}")