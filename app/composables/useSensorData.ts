import type { SensorCreateInput, SensorUpdateInput } from "@/types/SensorData";

export const useSensorData = () => {
  const fetchSensorData = async () => await $fetch("/api/sensorData");

  const fetchSensorDataItem = async (id: number) =>
    await $fetch(`/api/sensorData/${id}`);

  const createSensorData = async (payload: SensorCreateInput) =>
    await $fetch("/api/sensorData", {
      method: "POST",
      body: payload,
    });

  const updateSensorData = async (id: number, payload: SensorUpdateInput) =>
    await $fetch(`/api/sensorData/${id}`, {
      method: "PUT",
      body: payload,
    });

  const deleteSensorData = async (id: number) =>
    await $fetch(`/api/sensorData/${id}`, {
      method: "DELETE",
    });

  return {
    fetchSensorData,
    fetchSensorDataItem,
    createSensorData,
    updateSensorData,
    deleteSensorData,
  };
};
