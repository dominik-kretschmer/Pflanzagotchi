export interface PlantDTO {
    id: number
    custom_name: string
    name: string
    type: string
    location: string
    date_planted: string
    last_prun: string
    last_water: string
    last_fertelized: string
    gen_data: PlantGenData
    botanical_name: string
    pref_sun: number
    pref_air_humidity: number
    pref_soil_humidity: number
}

export interface PlantGenData {
    api_id: number
    image_url: string | null
    images: PlantImages
    growth: PlantGrowth
    sources: string[]
}

export interface UrlLink {
    self: string
    genus?: string
    plant?: string
}

export interface PlantImage {
    id?: number
    url: string
    license?: string
    author?: string
}

export interface PlantImages {
    flower?: PlantImage[]
    leaf?: PlantImage[]
    habit?: PlantImage[]
    fruit?: PlantImage[]
    bark?: PlantImage[]
    other?: PlantImage[]
}

export interface PlantGrowth {
    growth_form?: string
    growth_habit?: string
    growth_rate?: string
    average_height_cm?: {
        min?: number
        max?: number
    }
    maximum_height_cm?: {
        min?: number
        max?: number
    }
    days_to_harvest?: number
    sowing?: string
    description?: string
    light?: number
    atmospheric_humidity?: number
    soil_humidity?: number
    ph_minimum?: number
    ph_maximum?: number
}

export type PlantCreateInput = Omit<PlantDTO, 'id'>
export type PlantUpdateInput = Partial<Omit<PlantDTO, 'id'>> 
