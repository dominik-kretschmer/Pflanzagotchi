import { getUserId } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const userId = getUserId(event);
  const body = await readBody(event);
  const { amount } = body;

  if (amount === undefined || typeof amount !== "number") {
    throw createError({
      statusCode: 400,
      statusMessage: "Amount is required and must be a number",
    });
  }

  const user = await UserService.findById(userId);
  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: "User not found",
    });
  }

  const config = useRuntimeConfig();
  const userXpPerLevel = config.xp.userPerLevel;

  let newXp = user.xp + amount;
  let newLevel = user.level;

  while (newXp >= userXpPerLevel) {
    newXp -= userXpPerLevel;
    newLevel += 1;
  }

  const updatedUser = await UserService.updateXpAndLevel(userId, newXp, newLevel);

  return updatedUser;
});
