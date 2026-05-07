import type { AnalyzeRequest, AnalyzeResponse } from './types';

const API_BASE = 'http://127.0.0.1:8000';

export async function analyzeInteraction(
  payload: AnalyzeRequest
): Promise<AnalyzeResponse> {
  const response = await fetch(`${API_BASE}/api/v1/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`API error ${response.status}: ${errorText}`);
  }
  return response.json() as Promise<AnalyzeResponse>;
}

/**
 * Send all interactions in a single batch request.
 * Endpoint: POST /api/v1/analyze/batch
 * Payload:  { interactions: AnalyzeRequest[] }
 * Response: { results: AnalyzeResponse[] }
 */
export async function analyzeBatch(
  interactions: AnalyzeRequest[]
): Promise<AnalyzeResponse[]> {
  const response = await fetch(`${API_BASE}/api/v1/analyze/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ interactions }),
  });
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Batch API error ${response.status}: ${errorText}`);
  }
  const data = await response.json();
  // Accept either { results: [...] } or a plain array
  return Array.isArray(data) ? data : (data.results ?? []);
}
