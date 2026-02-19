import { getUserId } from "~~/server/utils/auth";
import { parsePlantData } from "~~/server/utils/transformers";

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
  const body = await readBody(event);
  const data = parsePlantData(body);

  try {
    const updateResult = await PlantService.update(id, userId, data);

    if (updateResult.count === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Plant not found or not authorized",
      });
    }

    // Track actions for XP based on what was updated
    let finalPlant = await PlantService.findById(id, userId);

    const fetcher = useRequestFetch(event);
    try {
      if (body.last_water) {
        const actionResult: any = await fetcher("/api/user/action", {
          method: "POST",
          body: { type: "WATER", plantId: id },
        });
        if (actionResult?.updatedPlant) finalPlant = { ...actionResult.updatedPlant, sensorData: finalPlant?.sensorData };
      }
      if (body.last_fertilized) {
        const actionResult: any = await fetcher("/api/user/action", {
          method: "POST",
          body: { type: "FERTILIZE", plantId: id },
        });
        if (actionResult?.updatedPlant) finalPlant = { ...actionResult.updatedPlant, sensorData: finalPlant?.sensorData };
      }
      if (body.last_pruning) {
        const actionResult: any = await fetcher("/api/user/action", {
          method: "POST",
          body: { type: "PRUNE", plantId: id },
        });
        if (actionResult?.updatedPlant) finalPlant = { ...actionResult.updatedPlant, sensorData: finalPlant?.sensorData };
      }
    } catch (e) {
      console.error("Error tracking actions", e);
    }

    return finalPlant;
  } catch (err) {
    console.error(`Error updating plant ${id}`, err);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
