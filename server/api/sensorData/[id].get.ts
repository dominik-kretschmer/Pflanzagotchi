export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, "id");
  const id = idParam ? parseInt(idParam) : null;

  if (!id || isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Valid ID is required",
    });
  }

  try {
    const sensorData = await SensorDataService.findById(id);
    if (!sensorData) {
      throw createError({
        statusCode: 404,
        statusMessage: "Sensor data not found",
      });
    }
    return sensorData;
  } catch (err) {
    console.error(`Error fetching sensor data ${id}`, err);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
