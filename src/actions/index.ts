// src/actions/index.ts
import { getPlaces } from './places/getPlaces.action';
import { getReviews, getReviewById } from './reviews/getReviews.action';
import {
  getProductsByCategory,
  getProductBySlug,
  getProductById,
  getProductsForCategory,
  getProdcutBySlug,
} from './products/products.action';

export const server = {
  getReviews,
  getReviewById,
  getPlaces,
  getProductsByCategory,
  getProductBySlug,
  getProductById,
  getProductsForCategory,
  getProdcutBySlug,
};