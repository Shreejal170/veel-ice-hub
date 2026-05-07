// ─── API Request & Response Types ────────────────────────────────────────────

export type Platform = 'youtube' | 'instagram' | 'tiktok' | 'twitter';

export interface AnalyzeRequest {
  platform: Platform;
  author_username: string;
  text_content: string;
  creator_id: string;
}

export interface AnalyzeResponse {
  id: string;
  status: 'success' | 'error';
  intent: string;
  suggested_reply: string;
  extracted_tags: string[];
}

// ─── UI State ─────────────────────────────────────────────────────────────────

export type AppState = 'idle' | 'loading' | 'success' | 'error';
