import { getUserId } from "~~/server/utils/auth";
import { parsePlantData } from "~~/server/utils/transformers";

export default defineEventHandler(async (event) => {
  const userId = getUserId(event);

  try {
    const body = await readBody(event);
    const data = parsePlantData(body);

    const newPlant = await PlantService.create({
      ...data,
      userId,
      health: 100,
      last_interaction: new Date(),
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
});
