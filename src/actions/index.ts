// src/actions/index.ts
import { getPlaces } from './places/getPlaces.action';
import { getReviews } from './reviews/getReviews.action';
import {
  getProductsByCategory,
  getProductBySlug,
  getProductsForCategory,
  getProdcutBySlug,
} from './products/products.action';

export const server = {
  getReviews,
  getPlaces,
  getProductsByCategory,
  getProductBySlug,
  getProductsForCategory,
  getProdcutBySlug,
};