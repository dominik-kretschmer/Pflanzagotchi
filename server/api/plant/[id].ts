import { prisma } from "~~/lib/prisma";

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, "id");
  const id = idParam ? parseInt(idParam) : null;
  const method = event.method;

  if (!id || isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Valid ID is required",
    });
  }

  try {
    if (method === "GET") {
      const plant = await prisma.plant.findUnique({
        where: { id },
        include: {
          sensorData: true,
        },
      });

      if (!plant) {
        throw createError({
          statusCode: 404,
          statusMessage: "Plant not found",
        });
      }

      // Track action for XP (viewing sensors/detail)
      try {
        const { trackAction } = await import("~~/server/utils/xp");
        await trackAction(1, "SENSORS", id);
      } catch (e) {
        console.error("Error tracking SENSORS action", e);
      }

      return plant;
    }

    if (method === "PUT" || method === "PATCH") {
      const body = await readBody(event);

      // Map ISO strings to Date objects and Decimals for Prisma
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

      const updatedPlant = await prisma.plant.update({
        where: { id },
        data,
      });

      // Track actions for XP
      try {
        const { trackAction } = await import("~~/server/utils/xp");
        if (body.last_water) {
          await trackAction(1, "WATER", id);
        }
        if (body.last_fertilized) {
          await trackAction(1, "FERTILIZE", id);
        }
        if (body.last_pruning) {
          await trackAction(1, "PRUNE", id);
        }
      } catch (e) {
        console.error("Error tracking WATER/FERTILIZE action", e);
      }

      return updatedPlant;
    }

    if (method === "DELETE") {
      return await prisma.plant.delete({
        where: { id },
      });
    }
  } catch (err) {
    if (err.code === "P2025") {
      throw createError({ statusCode: 404, statusMessage: "Plant not found" });
    }

    console.error(`Error handling plant operation [${method}]`, err);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
