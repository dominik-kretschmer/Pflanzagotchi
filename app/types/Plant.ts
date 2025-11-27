
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
    gen_data: plantGenData
    botanical_name: string
    pref_sun: number
    pref_air_humidity: number
    pref_soil_humidity: number
}

export interface plantGenData {
    api_id: number
    image_url: string | null
    images: object
    growth: object
    sources:array
}

export type PlantCreateInput = Omit<PlantDTO, 'id'>;
export type PlantUpdateInput = Partial<Omit<PlantDTO, 'id'>>;