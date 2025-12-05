const endPoints = {
  plants: "/api/plant",
  searchPlants: "/api/plant/search",
  species: "/api/species",
  searchSpecies: "/api/species/search",
  genus: "/api/genus",
};

export const useApi = () => {
  const fetchPlants = async (page?: number, per_page?: number) => {
    return await $fetch(endPoints.plants, {
      params: { page, per_page },
    });
  };

  const searchPlants = async (
    q: string,
    filters?: Record<string, string | number>,
  ) => {
    return await $fetch(endPoints.searchPlants, {
      params: { q, ...(filters || {}) },
    });
  };

  const getPlant = async (idOrSlug: string | number) => {
    return await $fetch(`${endPoints.plants}/${idOrSlug}`);
  };

  const fetchSpecies = async (page?: number, per_page?: number) => {
    return await $fetch(endPoints.species, {
      params: { page, per_page },
    });
  };

  const searchSpecies = async (
    q: string,
    filters?: Record<string, string | number>,
  ) => {
    return await $fetch(endPoints.searchSpecies, {
      params: { q, ...(filters || {}) },
    });
  };

  const getGenus = async (idOrSlug: string) => {
    return await $fetch(`${endPoints.genus}/${idOrSlug}`);
  };

  const listGenus = async (page?: number, per_page?: number) => {
    return await $fetch(endPoints.genus, {
      params: { page, per_page },
    });
  };

  return {
    fetchPlants,
    searchPlants,
    getPlant,
    fetchSpecies,
    searchSpecies,
    listGenus,
    getGenus,
  };
};
