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

  const uploadImage = async (id: number, file: File, caption?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    if (caption) formData.append("caption", caption);

    return await $fetch(`/api/plant/${id}/images/upload`, {
      method: "POST",
      body: formData,
      headers,
      credentials: "include",
    });
  };

  const fetchImages = async (id: number) =>
    await $fetch(`/api/plant/${id}/images`, { headers, credentials: "include" });

  const deleteImage = async (plantId: number, imageId: number) =>
    await $fetch(`/api/plant/${plantId}/images/${imageId}`, {
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
    uploadImage,
    fetchImages,
    deleteImage,
  };
};
