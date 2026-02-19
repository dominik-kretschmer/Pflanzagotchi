import { parseSensorData } from "~~/server/utils/transformers";

export default defineEventHandler(async (event) => {
  const method = event.method;

  if (method === "GET") {
    try {
      return await SensorDataService.findAll();
    } catch (err) {
      console.error("Error fetching sensor data", err);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to fetch sensor data",
      });
    }
  }

  if (method === "POST") {
    try {
      const body = await readBody(event);
      const data = parseSensorData(body);
      return await SensorDataService.create(data);
    } catch (err) {
      console.error("Error creating sensor data", err);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to create sensor data",
      });
    }
  }
});
