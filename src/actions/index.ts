// src/actions/index.ts
import { getPlaces } from './places/getPlaces.action';
import { getReviews } from './reviews/getReviews.action';

export const server = {
    getReviews,
    getPlaces
};