import { prisma } from "~~/lib/prisma";
import { getUserId } from "~~/server/utils/auth";
import { calculateCurrentHealth } from "~~/server/utils/health";
import { parsePlantData } from "~~/server/utils/transformers";

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

  const userId = getUserId(event);

  try {
    if (method === "GET") {
      const plant = await prisma.plant.findFirst({
        where: { id, userId },
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

      // Track action for XP via API call
      try {
        const fetcher = useRequestFetch(event);
        const actionResult: any = await fetcher("/api/user/action", {
          method: "POST",
          body: { type: "SENSORS", plantId: id },
        });
        if (actionResult?.updatedPlant) {
          return {
            ...actionResult.updatedPlant,
            sensorData: plant.sensorData,
          };
        }
      } catch (e) {
        console.error("Error tracking SENSORS action", e);
      }

      return {
        ...plant,
        health: calculateCurrentHealth(plant),
      };
    }

    if (method === "PUT" || method === "PATCH") {
      const body = await readBody(event);
      const data = parsePlantData(body);

      const updateResult = await prisma.plant.updateMany({
        where: { id, userId },
        data,
      });

      if (updateResult.count === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: "Plant not found or not authorized",
        });
      }

      // Track actions for XP based on what was updated
      let finalPlant = await prisma.plant.findFirst({
        where: { id, userId },
        include: { sensorData: true },
      });

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
    }

    if (method === "DELETE") {
      const deleted = await prisma.plant.deleteMany({
        where: { id, userId },
      });

      if (deleted.count === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: "Plant not found or not authorized",
        });
      }
      return deleted;
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
