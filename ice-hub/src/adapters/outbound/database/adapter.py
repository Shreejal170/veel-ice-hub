import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from src.ports.outbound import IInteractionRepositoryPort
from src.domain.entities import Interaction, DraftResponse
from src.adapters.outbound.database.models import InteractionRecord, DraftResponseRecord

class SQLAlchemyDatabaseAdapter(IInteractionRepositoryPort):
    def __init__(self, session: AsyncSession):
        self.session = session
        # Lock to ensure only one async task touches the DB session at a time
        self._lock = asyncio.Lock()

    async def save_interaction(self, interaction: Interaction) -> None:
        async with self._lock:
            # Translate Domain Entity -> SQL Record
            record = InteractionRecord(
                interaction_id=interaction.interaction_id,
                source_platform=interaction.source_platform,
                author_handle=interaction.author_handle,
                raw_content=interaction.raw_content,
                engagement_score=interaction.engagement_score
            )
            self.session.add(record)
            await self.session.commit()
            print(f"💾 [SQLITE] Saved Interaction: {interaction.interaction_id}")

    async def save_draft_response(self, draft: DraftResponse) -> None:
        async with self._lock:
            # Translate Domain Entity -> SQL Record
            record = DraftResponseRecord(
                interaction_id=draft.interaction_id,
                assigned_intent=draft.assigned_intent,
                generated_reply=draft.generated_reply,
                is_approved=draft.is_approved
            )
            self.session.add(record)
            await self.session.commit()
            print(f"💾 [SQLITE] Saved Draft: {draft.interaction_id}")