import type { Review, BackendReviewItemWrapper, BackendReviewsApiResponse } from '../types/review';
import fallbackReviews from '../data/reviews/reviews.data.json';

export const BACKEND_CONFIG = {
  baseUrl:  import.meta.env?.BACKEND_API_URL || '',
  apiKey: import.meta.env?.BACKEND_API_KEY || '',
};

/**
 * Normaliza un elemento de review retornado por la API del backend central.
 */
function normalizeReview(item: BackendReviewItemWrapper): Review {
  const itemData = item.data || ({} as Review);
  return {
    ...itemData,
    id: itemData.id ?? item.id,
    name: itemData.name || '',
    comment: itemData.comment || '',
    rating: typeof itemData.rating === 'number' ? itemData.rating : Number(itemData.rating) || 0,
    date: itemData.date || (item.createdAt ? item.createdAt.split('T')[0] : ''),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

/**
 * Realiza una petición GET al backend central para listar las reviews publicadas,
 * permitiendo filtros dinámicos mediante query params (ej: ?rating=5, ?limit=20).
 */
export async function fetchReviewsFromBackend(
  queryParams: Record<string, string | number | boolean | undefined> = {}
): Promise<Review[]> {
  const url = new URL(`${BACKEND_CONFIG.baseUrl}/reviews`);

  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'x-api-key': BACKEND_CONFIG.apiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`[Reviews API] Request to ${url.toString()} failed with status ${response.status}`);
      return (fallbackReviews.reviews as Review[]) || [];
    }

    const json: BackendReviewsApiResponse = await response.json();
    const rawItems: BackendReviewItemWrapper[] = json.items || (Array.isArray(json.data) ? json.data : []);

    const reviews = rawItems
      .filter((item): item is BackendReviewItemWrapper => Boolean(item && item.data))
      .map(normalizeReview);

    return reviews.length > 0 ? reviews : ((fallbackReviews.reviews as Review[]) || []);
  } catch (error) {
    console.error(`[Reviews API] Error fetching from ${url.toString()}:`, error);
    return (fallbackReviews.reviews as Review[]) || [];
  }
}

/**
 * Obtiene una review específica por su itemId (UUID o ID del item) desde el backend central.
 */
export async function getReviewByIdFromBackend(itemId: string | number): Promise<Review | null> {
  const url = new URL(`${BACKEND_CONFIG.baseUrl}/reviews/${encodeURIComponent(String(itemId))}`);

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'x-api-key': BACKEND_CONFIG.apiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`[Reviews API] Request to ${url.toString()} failed with status ${response.status}`);
      const fallback = (fallbackReviews.reviews as Review[]).find((r) => String(r.id) === String(itemId));
      return fallback ?? null;
    }

    const json: BackendReviewsApiResponse = await response.json();
    const rawItem = (json.data && !Array.isArray(json.data) ? json.data : json.items?.[0]) as
      | BackendReviewItemWrapper
      | undefined;

    if (!rawItem) {
      const fallback = (fallbackReviews.reviews as Review[]).find((r) => String(r.id) === String(itemId));
      return fallback ?? null;
    }

    return normalizeReview(rawItem);
  } catch (error) {
    console.error(`[Reviews API] Error fetching single review ${itemId}:`, error);
    const fallback = (fallbackReviews.reviews as Review[]).find((r) => String(r.id) === String(itemId));
    return fallback ?? null;
  }
}

/**
 * Función principal para obtener las reviews.
 */
export async function getReviews(
  filters?: Record<string, string | number | boolean | undefined>
): Promise<Review[]> {
  return fetchReviewsFromBackend(filters);
}
