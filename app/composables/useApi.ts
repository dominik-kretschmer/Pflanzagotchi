const API_BASE = import.meta.env.API_URL;
const API_TOKEN = import.meta.env.API_TOKEN;

function buildUrl(path: string, params: Record<string, any> = {}) {
    const url = new URL(`${API_BASE}${path}`);
    url.searchParams.set('token', API_TOKEN);
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            url.searchParams.set(key, String(value));
        }
    });
    return url.toString();
}

export const useApi = () => {
    const fetchPlants = async (page?: number, per_page?: number) => {
        return await $fetch(buildUrl('/plants', { page, per_page }));
    }

    const searchPlants = async (q: string, filters?: Record<string, any>) => {
        return await $fetch(buildUrl('/plants/search', { q, ...filters }));
    }

    const getPlant = async (idOrSlug: string | number) => {
        return await $fetch(buildUrl(`/plants/${idOrSlug}`));
    }

    const fetchSpecies = async (page?: number, per_page?: number) => {
        return await $fetch(buildUrl('/species', { page, per_page }));
    }

    const searchSpecies = async (q: string, filters?: Record<string, any>) => {
        return await $fetch(buildUrl('/species/search', { q, ...filters }));
    }

    const getGenus = async (idOrSlug: string) => {
        return await $fetch(buildUrl(`/genus/${idOrSlug}`));
    }

    const listGenus = async (page?: number, per_page?: number) => {
        return await $fetch(buildUrl('/genus', { page, per_page }));
    }

    return {
        fetchPlants,
        searchPlants,
        getPlant,
        fetchSpecies,
        searchSpecies,
        listGenus,
        getGenus,
    }
}
