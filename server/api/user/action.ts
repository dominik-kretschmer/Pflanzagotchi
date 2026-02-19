import { trackAction } from "~~/server/utils/actions";
import { getUserId } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { type, plantId } = body;

  if (!type) {
    throw createError({
      statusCode: 400,
      statusMessage: "Action type is required",
    });
  }

  return await trackAction(event, type, plantId);
});
