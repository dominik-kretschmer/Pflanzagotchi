import { prisma } from "~~/lib/prisma";

export const AchievementService = {
  async findAllWithUserStatus(userId: number) {
    return await prisma.achievement.findMany({
      include: {
        users: {
          where: { userId },
        },
      },
    });
  },

  async findUserAchievement(userId: number, achievementId: number) {
    return await prisma.userAchievement.findFirst({
      where: { userId, achievementId },
    });
  },

  async findById(id: number) {
    return await prisma.achievement.findUnique({
      where: { id },
    });
  },

  async awardToUser(userId: number, achievementId: number) {
    return await prisma.userAchievement.create({
      data: {
        userId,
        achievementId,
      },
    });
  },
};
