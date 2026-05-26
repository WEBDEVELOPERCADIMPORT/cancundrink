import { defineAction } from "astro:actions"
import type { Place } from "../../components/common/Places.astro"
import content from "../../data/places/places.json"






export const getPlaces = defineAction({
    handler: async (): Promise<{message: string, data: Place[]}> => {
        const data =  content.places as Place[]
        return { message: "Places retrieved successfully", data }
    }
})