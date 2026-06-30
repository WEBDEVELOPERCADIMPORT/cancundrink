import { defineAction } from "astro:actions";
import { z } from "zod";
import content from "../../data/products/products.json";

interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  categories: string[];
  image: string;
}

export const getProductBySlug = defineAction({
  input: z.object({
    slug: z.string(),
    category: z.string().optional(),
  }),
  handler: async (input): Promise<{ message: string; data: Product | null }> => {
    const { slug, category } = input;

    const product =
      content.products.find((item) => {
        const matchesSlug = item.slug === slug;
        const matchesCategory = category ? item.categories.includes(category) : true;
        return matchesSlug && matchesCategory;
      }) ?? null;

    return {
      message: "Product retrieved successfully",
      data: product,
    };
  },
});

// Alias kept for compatibility with existing naming requests.
export const getProdcutBySlug = getProductBySlug;
