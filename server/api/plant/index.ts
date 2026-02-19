import { prisma } from "~~/lib/prisma";
import { getUserId } from "~~/server/utils/auth";
import { calculateCurrentHealth } from "~~/server/utils/health";
import { parsePlantData } from "~~/server/utils/transformers";

export default defineEventHandler(async (event) => {
  const method = event.method;
  const userId = getUserId(event);

  if (method === "GET") {
    try {
      const plants = await prisma.plant.findMany({
        where: { userId },
        include: {
          sensorData: true,
        },
      });

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
  }

  if (method === "POST") {
    try {
      const body = await readBody(event);
      const data = parsePlantData(body);

      const newPlant = await prisma.plant.create({
        data: {
          ...data,
          userId,
          health: 100,
          last_interaction: new Date(),
        },
      });

      // Track action for XP via API call
      try {
        const fetcher = useRequestFetch(event);
        const actionResult: any = await fetcher("/api/user/action", {
          method: "POST",
          body: { type: "ADD_PLANT", plantId: newPlant.id },
        });
        if (actionResult?.updatedPlant) return actionResult.updatedPlant;
      } catch (e) {
        console.error("Error tracking ADD_PLANT action", e);
      }

      return newPlant;
    } catch (err) {
      console.error("Error creating plant", err);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to create plant",
      });
    }
  }
});
