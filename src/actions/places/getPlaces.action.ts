import { defineAction } from "astro:actions"
import content from "../../data/places/places.json"
import { z } from "zod"

interface Place {
    id: string;
    name: string;
    address: string;
    zipCode: string;
}






export const getPlaces = defineAction({
    input: z.object({
        zipCode: z.string().optional()
    }),
    handler: async (input): Promise<{message: string, data: Place[]}> => {
        const { zipCode } = input

        const filtered = content.places.filter(p => {
            const matchesZipCode = zipCode ? p.zipCode === zipCode : true;
            return matchesZipCode;
        });
        
        const data =  filtered as Place[]
        return { message: "Places retrieved successfully", data }
    }
})