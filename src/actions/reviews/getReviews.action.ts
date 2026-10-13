import { defineAction } from 'astro:actions';
import { z } from 'zod';
import type { Review } from '../../types/review';
import {
    fetchReviewsFromBackend,
    getReviewByIdFromBackend,
} from '../../services/reviews.service';

export const getReviews = defineAction({
    input: z
        .object({
            id: z.union([z.number(), z.string()]).optional(),
            itemId: z.string().optional(),
            rating: z.union([z.number(), z.string()]).optional(),
            limit: z.union([z.number(), z.string()]).optional(),
            page: z.union([z.number(), z.string()]).optional(),
        })
        .passthrough()
        .optional(),
    handler: async (input): Promise<{ message: string; data: Review[] }> => {
        const filters = (input || {}) as Record<string, string | number | boolean | undefined>;
        const data = await fetchReviewsFromBackend(filters);
        return {
            message: 'Reviews retrieved successfully',
            data,
        };
    },
});

export const getReviewById = defineAction({
    input: z.object({
        id: z.union([z.number(), z.string()]),
    }),
    handler: async (input): Promise<{ message: string; data: Review | null }> => {
        const { id } = input;
        const review = await getReviewByIdFromBackend(id);
        return {
            message: review ? 'Review retrieved successfully' : 'Review not found',
            data: review,
        };
    },
});