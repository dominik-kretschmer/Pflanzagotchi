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
      return plant;
    }

    if (method === "PUT" || method === "PATCH") {
      const body = await readBody(event);
      return await prisma.plant.update({
        where: { id },
        data: body,
      });
    }

    if (method === "DELETE") {
      return await prisma.plant.delete({
        where: { id },
      });
    }
  } catch (err: any) {
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
