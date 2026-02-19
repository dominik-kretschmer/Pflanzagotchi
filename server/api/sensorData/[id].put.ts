export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, "id");
  const id = idParam ? parseInt(idParam) : null;

  if (!id || isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: "Valid ID is required" });
  }

  try {
    const body = await readBody(event);
    return await SensorDataService.update(id, body);
  } catch (err) {
    console.error(`Error updating sensor data ${id}`, err);
    throw createError({ statusCode: 500, statusMessage: "Internal Server Error" });
  }
});
