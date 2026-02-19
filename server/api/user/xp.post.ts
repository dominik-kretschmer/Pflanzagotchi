import { prisma } from "~~/lib/prisma";
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

  const user = await prisma.user.findUnique({ where: { id: userId } });
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

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      xp: newXp,
      level: newLevel,
    },
  });

  if (newLevel > user.level) {
    const fetcher = useRequestFetch(event);
    if (newLevel >= 5 && user.level < 5) {
      await fetcher("/api/achievements/award", {
        method: "POST",
        body: { achievementId: 5 },
      });
    }
    if (newLevel >= 10 && user.level < 10) {
      await fetcher("/api/achievements/award", {
        method: "POST",
        body: { achievementId: 10 },
      });
    }
  }

  return updatedUser;
});
