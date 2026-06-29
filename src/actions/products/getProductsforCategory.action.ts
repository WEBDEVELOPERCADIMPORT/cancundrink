import { defineAction } from "astro:actions"
import content from "../../data/products/products.json"
import { z } from "zod"
import type { Product } from "../../components/category/sections/Products.astro"



export const getProductsForCategory = defineAction({
    input: z.object({
        category: z.string().optional()
    }),
    handler: async (input): Promise<{message: string, data: Product[]}> => {
        const { category } = input

        const filtered = content.products.filter(p => {
            const matchesCategory = category ? p.categories.includes(category) : true;
            return matchesCategory;
        });
        
        const data =  filtered as Product[]
        return { message: "Products retrieved successfully", data }
    }
})