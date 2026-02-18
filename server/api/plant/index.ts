import { prisma } from "~~/lib/prisma";
import { getUserId } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const method = event.method;

  const userId = getUserId(event);

  if (method === "GET") {
    try {
      return await prisma.plant.findMany({
        where: { userId },
        include: {
          sensorData: true,
        },
      });
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

      const dateFields = [
        "date_planted",
        "last_pruning",
        "last_water",
        "last_fertilized",
      ];
      const decimalFields = [
        "pref_sun",
        "pref_air_humidity",
        "pref_soil_humidity",
      ];
      const data: any = { ...body };

      for (const field of dateFields) {
        if (data[field]) {
          data[field] = new Date(data[field]);
        }
      }

      for (const field of decimalFields) {
        if (data[field] !== undefined && data[field] !== null) {
          data[field] = parseFloat(data[field]);
        }
      }

      const newPlant = await prisma.plant.create({
        data: {
          ...data,
          userId,
        },
      });

      // Track action for XP
      try {
        const { trackAction } = await import("~~/server/utils/xp");
        await trackAction(getUserId(event), "ADD_PLANT", newPlant.id);
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
