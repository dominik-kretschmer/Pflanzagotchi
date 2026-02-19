import { getUserId } from "~~/server/utils/auth";
import { calculateCurrentHealth } from "~~/server/utils/health";

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

  const body = await readBody(event);
  const { amount } = body;

  if (amount === undefined || typeof amount !== "number") {
    throw createError({
      statusCode: 400,
      statusMessage: "Amount is required and must be a number",
    });
  }

  const plant = await PlantService.findById(plantId, userId);

  if (!plant) {
    throw createError({
      statusCode: 404,
      statusMessage: "Plant not found or not authorized",
    });
  }

  const config = useRuntimeConfig();
  const plantXpPerLevel = config.xp.plantPerLevel;
  const healthGainPerCare = config.health.gainPerCare;

  let newXp = plant.xp + amount;
  let newLevel = plant.level;

  while (newXp >= plantXpPerLevel) {
    newXp -= plantXpPerLevel;
    newLevel += 1;
  }

  const currentHealth = calculateCurrentHealth(plant);
  const newHealth = Math.min(100, currentHealth + healthGainPerCare);

  const updatedPlant = await PlantService.updateXpLevelAndHealth(plantId, newXp, newLevel, newHealth);

  return updatedPlant;
});
