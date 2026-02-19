import { getUserId } from "~~/server/utils/auth";
import { calculateCurrentHealth } from "~~/server/utils/health";

export default defineEventHandler(async (event) => {
  const userId = getUserId(event);

  try {
    const plants = await PlantService.findManyByUserId(userId);

    return plants.map((plant) => ({
      ...plant,
      health: calculateCurrentHealth(plant),
    }));
  } catch (err) {
    console.error("Error fetching plants", err);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch plants",
    });
  }
});
