
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
    gen_data: any
    botanical_name: string
    pref_sun: number
    pref_air_humidity: number
    pref_soil_humidity: number
}

export type PlantCreateInput = Omit<PlantDTO, 'id'>;
export type PlantUpdateInput = Partial<Omit<PlantDTO, 'id'>>;

export const usePlants = () => {
    const plants = useState<PlantDTO[]>('plants', () => []);
    const selectedPlant = useState<PlantDTO | null>('selectedPlant', () => null);
    const plantsLoading = useState<boolean>('plantsLoading', () => false);
    const plantsError = useState<string | null>('plantsError', () => null);

    const fetchPlants = async () => {
        plantsLoading.value = true;
        try {
            plants.value = await $fetch<PlantDTO[]>('/api/plants');
            plantsError.value = null;
        } catch (err: any) {
            plantsError.value =
                err?.data?.message || err?.message || 'Fehler beim Laden der Pflanzen';
        } finally {
            plantsLoading.value = false;
        }
    }

    const fetchPlant = async (id: number) => {
        plantsLoading.value = true;
        try {
            const data = await $fetch<PlantDTO>(`/api/plants/${id}`);
            selectedPlant.value = data;
            plantsError.value = null;
            return data;
        } catch (err: any) {
            plantsError.value =
                err?.data?.message || err?.message || 'Fehler beim Laden der Pflanze';
            return null;
        } finally {
            plantsLoading.value = false;
        }
    }

    const createPlant = async (payload: PlantCreateInput) => {
        plantsLoading.value = true
        try {
            const created = await $fetch<PlantDTO>('/api/plants', {
                method: 'POST',
                body: payload
            })
            plants.value = [created, ...plants.value]
            plantsError.value = null
            return created
        } catch (err: any) {
            plantsError.value =
                err?.data?.message || err?.message || 'Fehler beim Erstellen der Pflanze'
            throw err
        } finally {
            plantsLoading.value = false
        }
    }

    const updatePlant = async (id: number, payload: PlantUpdateInput) => {
        plantsLoading.value = true;
        try {
            const updated = await $fetch<PlantDTO>(`/api/plants/${id}`, {
                method: 'PUT',
                body: payload
            });

            plants.value = plants.value.map(p => (p.id === id ? updated : p));
            if (selectedPlant.value?.id === id) selectedPlant.value = updated;

            plantsError.value = null;
            return updated;
        } catch (err: any) {
            plantsError.value =
                err?.data?.message || err?.message || 'Fehler beim Aktualisieren der Pflanze';
            throw err;
        } finally {
            plantsLoading.value = false;
        }
    }

    const deletePlant = async (id: number) => {
        plantsLoading.value = true;
        try {
            await $fetch(`/api/plants/${id}`, { method: 'DELETE' });
            plants.value = plants.value.filter(p => p.id !== id);
            if (selectedPlant.value?.id === id) selectedPlant.value = null;
            plantsError.value = null;
        } catch (err: any) {
            plantsError.value =
                err?.data?.message || err?.message || 'Fehler beim Löschen der Pflanze';
            throw err;
        } finally {
            plantsLoading.value = false;
        }
    }

    return {
        plants,
        selectedPlant,
        plantsLoading,
        plantsError,
        fetchPlants,
        fetchPlant,
        createPlant,
        updatePlant,
        deletePlant
    }
}
