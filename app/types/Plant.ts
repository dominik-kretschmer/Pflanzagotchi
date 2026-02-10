export interface PlantDTO {
  id: number;
  custom_name: string;
  name: string;
  type: string;
  location: string;
  date_planted: string;
  last_pruning: string;
  last_water: string;
  last_fertilized: string;
  gen_data: PlantGenData;
  botanical_name: string;
  pref_sun: number;
  pref_air_humidity: number;
  pref_soil_humidity: number;
  xp: number;
  level: number;
  health: number;
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
  growth_form: string | null;
  growth_habit: string | null;
  growth_rate: string | null;
  average_height_cm: {
    min: number | null;
    max: number | null;
  } | null;
  maximum_height_cm: {
    min: number | null;
    max: number | null;
  } | null;
  days_to_harvest: number | null;
  sowing: string | null;
  description: string | null;
  light: number | null;
  atmospheric_humidity: number | null;
  soil_humidity: number | null;
  ph_minimum: number | null;
  ph_maximum: number | null;
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
      specifications?: Record<string, unknown>;
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
