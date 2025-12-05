// server/api/genus/[idOrSlug].get.ts
import { callPlantApi } from "~/../server/utils/plantApi";

export default defineEventHandler(async (event) => {
  const idOrSlug = getRouterParam(event, "idOrSlug");

  if (!idOrSlug) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing genus id or slug",
    });
  }

  return callPlantApi(`/genus/${idOrSlug}`);
});
