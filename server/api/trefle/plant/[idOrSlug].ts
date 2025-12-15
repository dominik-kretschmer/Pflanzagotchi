// server/api/plants/[idOrSlug].get.ts
import { callPlantApi } from "~~/server/utils/plantApi";

export default defineEventHandler(async (event) => {
  const idOrSlug = getRouterParam(event, "idOrSlug");
  if (!idOrSlug) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing plant id or slug",
    });
  }

  return callPlantApi(`/plants/${idOrSlug}`);
});
