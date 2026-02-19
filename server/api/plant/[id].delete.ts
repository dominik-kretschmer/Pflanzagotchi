import { getUserId } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, "id");
  const id = idParam ? parseInt(idParam) : null;

  if (!id || isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Valid ID is required",
    });
  }

  const userId = getUserId(event);

  try {
    const deleted = await PlantService.delete(id, userId);

    if (deleted.count === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Plant not found or not authorized",
      });
    }
    return deleted;
  } catch (err) {
    console.error(`Error deleting plant ${id}`, err);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
