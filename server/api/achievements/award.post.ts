import { prisma } from "~~/lib/prisma";
import { getUserId } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const userId = getUserId(event);
  const body = await readBody(event);
  const { achievementId } = body;

  if (!achievementId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Achievement ID is required",
    });
  }

  // Check if already earned
  const existing = await prisma.userAchievement.findFirst({
    where: { userId, achievementId },
  });

  if (existing) return existing;

  const achievement = await prisma.achievement.findUnique({
    where: { id: achievementId },
  });

  if (!achievement) {
    throw createError({
      statusCode: 404,
      statusMessage: "Achievement not found",
    });
  }

  const earned = await prisma.userAchievement.create({
    data: {
      userId,
      achievementId,
    },
  });

  // Award XP to user for earning the achievement
  const fetcher = useRequestFetch(event);
  await fetcher("/api/user/xp", {
    method: "POST",
    body: { amount: achievement.xp_reward },
  });

  return earned;
});
