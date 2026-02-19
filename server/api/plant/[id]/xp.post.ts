import { prisma } from "~~/lib/prisma";
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

  const plant = await prisma.plant.findFirst({
    where: { id: plantId, userId },
  });

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

  const updatedPlant = await prisma.plant.update({
    where: { id: plantId },
    data: {
      xp: newXp,
      level: newLevel,
      health: Math.min(100, currentHealth + healthGainPerCare),
      last_interaction: new Date(),
    },
  });

  if (newLevel >= 10 && plant.level < 10) {
    const fetcher = useRequestFetch(event);
    await fetcher("/api/achievements/award", {
      method: "POST",
      body: { achievementId: 9 }, // Perfektionist
    });
  }

  return updatedPlant;
});
