import type { PlantGrowth, PlantGenData } from "@/types/Plant";

export const usePlantDefaults = () => {
  const defaultPlantGrowth = (data?: any): PlantGrowth => {
    const g = data || {};
    return {
      light: g.light ?? null,
      sowing: g.sowing ?? null,
      ph_maximum: g.ph_maximum ?? null,
      ph_minimum: g.ph_minimum ?? null,
      description: g.description ?? null,
      growth_form: g.growth_form ?? null,
      growth_rate: g.growth_rate ?? null,
      growth_habit: g.growth_habit ?? null,
      soil_humidity: g.soil_humidity ?? null,
      days_to_harvest: g.days_to_harvest ?? null,
      average_height_cm: g.average_height_cm
        ? {
            max: g.average_height_cm.max ?? null,
            min: g.average_height_cm.min ?? null,
          }
        : { max: null, min: null },
      maximum_height_cm: g.maximum_height_cm
        ? {
            max: g.maximum_height_cm.max ?? null,
            min: g.maximum_height_cm.min ?? null,
          }
        : { max: null, min: null },
      atmospheric_humidity: g.atmospheric_humidity ?? null,
    };
  };

  const defaultGenData = (data?: any): PlantGenData => {
    if (data && typeof data === "object")
      return {
        api_id: Number(data.api_id ?? 0),
        image_url: data.image_url ?? null,
        images: data.images || {},
        growth: defaultPlantGrowth(data.growth),
        sources: Array.isArray(data.sources) ? data.sources.map(String) : [],
      };
    return {
      api_id: 0,
      image_url: null,
      images: {},
      growth: defaultPlantGrowth(),
      sources: [],
    };
  };

  return {
    defaultPlantGrowth,
    defaultGenData,
  };
};
