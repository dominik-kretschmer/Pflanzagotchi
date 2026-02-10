import { trackAction } from "~~/server/utils/xp";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { type } = body;

  if (!type) {
    throw createError({
      statusCode: 400,
      statusMessage: "Action type is required",
    });
  }

  // Always use user 1
  return await trackAction(1, type);
});
