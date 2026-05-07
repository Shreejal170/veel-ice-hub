from sqladmin import ModelView
from src.adapters.outbound.database.models import InteractionRecord, DraftResponseRecord

class InteractionAdmin(ModelView, model=InteractionRecord):
    # The columns that will show up in the list view
    column_list = [
        InteractionRecord.interaction_id, 
        InteractionRecord.source_platform, 
        InteractionRecord.author_handle,
        InteractionRecord.engagement_score
    ]
    # Make it searchable
    column_searchable_list = [InteractionRecord.author_handle, InteractionRecord.raw_content]
    # Add a cool icon for the sidebar
    icon = "fa-solid fa-envelope"

class DraftResponseAdmin(ModelView, model=DraftResponseRecord):
    column_list = [
        DraftResponseRecord.interaction_id, 
        DraftResponseRecord.assigned_intent, 
        DraftResponseRecord.is_approved
    ]
    column_searchable_list = [DraftResponseRecord.interaction_id]
    icon = "fa-solid fa-robot"