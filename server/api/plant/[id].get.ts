import { getUserId } from "~~/server/utils/auth";
import { calculateCurrentHealth } from "~~/server/utils/health";

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, "id");
  const id = idParam ? parseInt(idParam) : null;

  if (!id || isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Valid ID is required",
    });
  }

  const userId = getUserId(event);

  try {
    const plant = await PlantService.findById(id, userId);

    if (!plant) {
      throw createError({
        statusCode: 404,
        statusMessage: "Plant not found",
      });
    }

    // Track action for XP via API call
    try {
      const fetcher = useRequestFetch(event);
      const actionResult: any = await fetcher("/api/user/action", {
        method: "POST",
        body: { type: "SENSORS", plantId: id },
      });
      if (actionResult?.updatedPlant) {
        return {
          ...actionResult.updatedPlant,
          sensorData: plant.sensorData,
        };
      }
    } catch (e) {
      console.error("Error tracking SENSORS action", e);
    }

    return {
      ...plant,
      health: calculateCurrentHealth(plant),
    };
  } catch (err) {
    console.error(`Error fetching plant ${id}`, err);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
