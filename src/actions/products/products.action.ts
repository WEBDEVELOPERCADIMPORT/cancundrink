import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { LANGUAGES, type Lang } from '../../i18n/config.i18n';
import type { Product } from '../../types/product';
import {
  getProductsByCategoryFromBackend,
  getProductBySlugFromBackend,
  getProductByIdFromBackend,
} from '../../services/products.service';

const langKeys = Object.keys(LANGUAGES) as [Lang, ...Lang[]];

export const getProductsByCategory = defineAction({
  input: z.object({
    lang: z.enum(langKeys),
    categorySlug: z.string(),
  }),
  handler: async (input): Promise<{ message: string; data: Product[] }> => {
    const { lang, categorySlug } = input;
    const filtered = await getProductsByCategoryFromBackend(lang, categorySlug);

    return {
      message: 'Products retrieved successfully',
      data: filtered,
    };
  },
});

export const getProductBySlug = defineAction({
  input: z.object({
    lang: z.enum(langKeys),
    categorySlug: z.string().optional(),
    productSlug: z.string().optional(),
    id: z.union([z.number(), z.string()]).optional(),
  }),
  handler: async (input): Promise<{ message: string; data: Product | null }> => {
    const { lang, categorySlug, productSlug, id } = input;

    let product: Product | null = null;

    if (id !== undefined && id !== null) {
      product = await getProductByIdFromBackend(lang, id);
    } else if (productSlug) {
      product = await getProductBySlugFromBackend(lang, productSlug, categorySlug);
    }

    return {
      message: product ? 'Product retrieved successfully' : 'Product not found',
      data: product,
    };
  },
});

export const getProductById = defineAction({
  input: z.object({
    lang: z.enum(langKeys),
    id: z.union([z.number(), z.string()]),
  }),
  handler: async (input): Promise<{ message: string; data: Product | null }> => {
    const { lang, id } = input;
    const product = await getProductByIdFromBackend(lang, id);

    return {
      message: product ? 'Product retrieved successfully' : 'Product not found',
      data: product,
    };
  },
});

// Backward compatibility aliases
export const getProductsForCategory = getProductsByCategory;
export const getProdcutBySlug = getProductBySlug;
