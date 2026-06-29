// src/actions/index.ts
import { getPlaces } from './places/getPlaces.action';
import { getReviews } from './reviews/getReviews.action';
import { getProductsForCategory } from './products/getProductsforCategory.action';

export const server = {
    getReviews,
    getPlaces,
    getProductsForCategory
};