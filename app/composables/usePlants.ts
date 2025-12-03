import type { PlantCreateInput, PlantUpdateInput } from "@/types/Plant"

export const usePlants = () => {

    const fetchPlants = async () =>
        await $fetch('/api/plant')

    const fetchPlant = async (id: number) =>
        await $fetch(`/api/plant/${id}`)

    const createPlant = async (payload: PlantCreateInput) =>
        await $fetch('/api/plant', {
            method: 'POST',
            body: payload
        })

    const updatePlant = async (id: number, payload: PlantUpdateInput) =>
        await $fetch(`/api/plant/${id}`, {
            method: 'PUT',
            body: payload
        })

    const deletePlant = async (id: number) =>
        await $fetch(`/api/plant/${id}`, {
            method: 'DELETE'
        })

    return {
        fetchPlants,
        fetchPlant,
        createPlant,
        updatePlant,
        deletePlant
    }
}
