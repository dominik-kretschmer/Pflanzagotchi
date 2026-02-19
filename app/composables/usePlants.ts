import type { PlantCreateInput, PlantUpdateInput } from "@/types/Plant";
import { useRequestHeaders } from "#app";

export const usePlants = () => {
  const headers = import.meta.server
    ? useRequestHeaders(["cookie"])
    : undefined;

  const fetchPlants = async () =>
    await $fetch("/api/plant", { headers, credentials: "include" });

  const fetchPlant = async (id: number) =>
    await $fetch(`/api/plant/${id}`, { headers, credentials: "include" });

  const createPlant = async (payload: PlantCreateInput) =>
    await $fetch("/api/plant", {
      method: "POST",
      body: payload,
      headers,
      credentials: "include",
    });

  const updatePlant = async (id: number, payload: PlantUpdateInput) =>
    await $fetch(`/api/plant/${id}`, {
      method: "PUT",
      body: payload,
      headers,
      credentials: "include",
    });

  const deletePlant = async (id: number) =>
    await $fetch(`/api/plant/${id}`, {
      method: "DELETE",
      headers,
      credentials: "include",
    });

  return {
    fetchPlants,
    fetchPlant,
    createPlant,
    updatePlant,
    deletePlant,
  };
};
