import { callPlantApi } from "~/../server/utils/plantApi";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { q, ...rest } = query;

  if (!q) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing search query (q)",
    });
  }

  return callPlantApi("/plants/search", {
    q: String(q),
    ...Object.fromEntries(
      Object.entries(rest).map(([k, v]) => [k, v as string]),
    ),
  });
});
