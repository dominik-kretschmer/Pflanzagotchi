import { prisma } from "~~/lib/prisma";

export const QuestService = {
  async findAllTemplates() {
    return await prisma.dailyQuest.findMany();
  },

  async findUserQuestsByDate(userId: number, date: Date) {
    return await prisma.userQuest.findMany({
      where: {
        userId,
        date,
      },
      include: {
        quest: true,
      },
      orderBy: {
        quest: { id: "asc" },
      },
    });
  },

  async findIncompleteUserQuestsByType(userId: number, type: string, date: Date) {
    return await prisma.userQuest.findMany({
      where: {
        userId,
        isCompleted: false,
        date,
        quest: { type },
      },
      include: {
        quest: true,
      },
    });
  },

  async upsertUserQuest(userId: number, questId: number, date: Date) {
    return await prisma.userQuest.upsert({
      where: {
        userId_questId_date: {
          userId,
          questId,
          date,
        },
      },
      update: {},
      create: {
        userId,
        questId,
        date,
        currentValue: 0,
        isCompleted: false,
      },
    });
  },

  async updateProgress(userQuestId: number, newValue: number, isCompleted: boolean) {
    return await prisma.userQuest.update({
      where: { id: userQuestId },
      data: {
        currentValue: newValue,
        isCompleted,
      },
    });
  },
};
