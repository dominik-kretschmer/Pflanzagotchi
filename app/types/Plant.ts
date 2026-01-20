export interface PlantDTO {
  id: number;
  custom_name: string;
  name: string;
  type: string;
  location: string;
  date_planted: string;
  last_prun: string;
  last_water: string;
  last_fertelized: string;
  gen_data: PlantGenData;
  botanical_name: string;
  pref_sun: number;
  pref_air_humidity: number;
  pref_soil_humidity: number;
}

export interface PlantGenData {
  api_id: number;
  image_url: string | null;
  images: PlantImages;
  growth: PlantGrowth;
  sources: string[];
}

export interface PlantImage {
  id?: number;
  url: string;
  license?: string;
  author?: string;
}

export interface PlantImages {
  flower?: PlantImage[];
  leaf?: PlantImage[];
  habit?: PlantImage[];
  fruit?: PlantImage[];
  bark?: PlantImage[];
  other?: PlantImage[];
}

export interface PlantGrowth {
  growth_form?: string;
  growth_habit?: string;
  growth_rate?: string;
  average_height_cm?: {
    min?: number;
    max?: number;
  };
  maximum_height_cm?: {
    min?: number;
    max?: number;
  };
  days_to_harvest?: number;
  sowing?: string;
  description?: string;
  light?: number;
  atmospheric_humidity?: number;
  soil_humidity?: number;
  ph_minimum?: number;
  ph_maximum?: number;
}

export interface TreflePlant {
  id: number;
  common_name: string | null;
  slug: string;
  scientific_name: string;
  year: number | null;
  author: string | null;
  family: string | null;
  genus: string | null;
  image_url: string | null;
}

export interface TrefleSearchResponse {
  data: TreflePlant[];
  links: {
    self: string;
    first?: string;
    last?: string;
  };
  meta: {
    total: number;
  };
}

export interface TreflePlantDetails {
  data?: {
    id?: number;
    common_name?: string | null;
    scientific_name?: string | null;
    slug?: string;
    image_url?: string | null;
    main_species?: {
      id?: number;
      images?: Record<
        string,
        Array<{ image_url?: string; copyright?: string }>
      >;
      growth?: Record<string, unknown>;
      sources?: Array<{
        id?: number;
        name?: string;
        url?: string;
        last_update?: string;
      }>;
    };
    sources?: Array<{
      id?: number;
      name?: string;
      url?: string;
      last_update?: string;
    }>;
  };
}
export type PlantCreateInput = Omit<PlantDTO, "id">;
export type PlantUpdateInput = Partial<Omit<PlantDTO, "id">>;
