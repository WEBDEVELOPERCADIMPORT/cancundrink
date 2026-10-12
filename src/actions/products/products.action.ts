import { defineAction } from 'astro:actions';
import { z } from 'zod';
import productsData from '../../data/products/products.data.json';
import { LANGUAGES, type Lang } from '../../i18n/config.i18n';
import type { Product, ProductsByLanguage } from '../../types/product';

const typedProductsData = productsData as unknown as ProductsByLanguage;
const langKeys = Object.keys(LANGUAGES) as [Lang, ...Lang[]];

export const getProductsByCategory = defineAction({
  input: z.object({
    lang: z.enum(langKeys),
    categorySlug: z.string(),
  }),
  handler: async (input): Promise<{ message: string; data: Product[] }> => {
    const { lang, categorySlug } = input;
    const products = typedProductsData[lang] ?? [];

    const filtered = products.filter((p) => {
      const cat = p.categoryslug || p.categorySlug;
      return cat === categorySlug || p.categories?.includes(categorySlug);
    });

    return {
      message: 'Products retrieved successfully',
      data: filtered,
    };
  },
});

export const getProductBySlug = defineAction({
  input: z.object({
    lang: z.enum(langKeys),
    categorySlug: z.string(),
    productSlug: z.string(),
  }),
  handler: async (input): Promise<{ message: string; data: Product | null }> => {
    const { lang, categorySlug, productSlug } = input;
    const products = typedProductsData[lang] ?? [];

    const product =
      products.find((item) => {
        const matchesSlug = item.slug === productSlug;
        const cat = item.categoryslug || item.categorySlug;
        const matchesCategory = categorySlug
          ? cat === categorySlug || item.categories?.includes(categorySlug)
          : true;
        return matchesSlug && matchesCategory;
      }) ?? null;

    return {
      message: product ? 'Product retrieved successfully' : 'Product not found',
      data: product,
    };
  },
});

// Backward compatibility aliases
export const getProductsForCategory = getProductsByCategory;
export const getProdcutBySlug = getProductBySlug;
