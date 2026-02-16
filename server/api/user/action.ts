import { trackAction } from "~~/server/utils/xp";
import { getUserId } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { type } = body;

  if (!type) {
    throw createError({
      statusCode: 400,
      statusMessage: "Action type is required",
    });
  }

  return await trackAction(getUserId(event), type);
});
