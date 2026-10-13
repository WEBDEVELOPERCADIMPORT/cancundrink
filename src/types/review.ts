export interface Review {
  id?: number | string;
  name: string;
  comment: string;
  rating: number;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendReviewItemWrapper {
  id: string;
  data: Review;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendReviewsApiResponse {
  status: string;
  message?: string;
  website?: {
    id: string;
    name: string;
    domain: string;
  };
  contentType?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
  };
  filtersApplied?: Record<string, unknown>;
  items?: BackendReviewItemWrapper[];
  data?: BackendReviewItemWrapper[] | BackendReviewItemWrapper;
  meta?: {
    total: number;
    limit: number;
    page: number;
  };
}
