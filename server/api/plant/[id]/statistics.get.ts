import { getUserId } from "~~/server/utils/auth";
import { GrowthHistoryService } from "~~/server/utils/services/growthHistory";

export default defineEventHandler(async (event) => {
  const userId = getUserId(event);
  const plantIdParam = getRouterParam(event, "id");
  const plantId = plantIdParam ? parseInt(plantIdParam) : null;

  if (!plantId || isNaN(plantId)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Valid Plant ID is required",
    });
  }

  // Ensure plant exists and belongs to user
  const plant = await PlantService.findById(plantId, userId);
  if (!plant) {
    throw createError({
      statusCode: 404,
      statusMessage: "Plant not found",
    });
  }

  const stats = await GrowthHistoryService.getStatistics(plantId);

  return {
    plantId,
    stats: stats || {
      total_water_count: 0,
      total_fertilize_count: 0,
      total_prune_count: 0,
      total_sensor_checks: 0,
    },
  };
});
