import { getUserId } from "~~/server/utils/auth";
import { ImageService } from "~~/server/utils/services/image";
import { PlantService } from "~~/server/utils/services/plant";

export default defineEventHandler(async (event) => {
  const plantIdParam = getRouterParam(event, "id");
  const plantId = plantIdParam ? parseInt(plantIdParam) : null;

  if (!plantId || isNaN(plantId)) {
    throw createError({ statusCode: 400, statusMessage: "Valid Plant ID is required" });
  }

  const userId = getUserId(event);
  const plant = await PlantService.findById(plantId, userId);
  if (!plant) {
    throw createError({ statusCode: 404, statusMessage: "Plant not found or not authorized" });
  }

  return await ImageService.findByPlantId(plantId);
});
