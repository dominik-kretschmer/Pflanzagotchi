import { getUserId } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const userId = getUserId(event);
  const plantIdParam = getRouterParam(event, "id");
  const plantId = plantIdParam ? parseInt(plantIdParam) : null;

  if (!plantId || isNaN(plantId)) {
    throw createError({ statusCode: 400, statusMessage: "Valid Plant ID is required" });
  }

  const plant = await PlantService.findById(plantId, userId);

  if (!plant) {
    throw createError({ statusCode: 404, statusMessage: "Plant not found" });
  }

  const fetcher = useRequestFetch(event);
  
  if (plant.level >= 10) {
    await fetcher("/api/achievements/award", {
      method: "POST",
      body: { achievementId: 9 }, // Perfektionist
    });
  }

  return { level: plant.level };
});
