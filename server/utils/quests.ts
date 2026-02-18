import { prisma } from "~~/lib/prisma";

export async function ensureDailyQuests(userId: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get all quest templates
  const allQuests = await prisma.dailyQuest.findMany();

  // Ensure user has each quest for today
  for (const quest of allQuests) {
    await prisma.userQuest.upsert({
      where: {
        userId_questId_date: {
          userId,
          questId: quest.id,
          date: today,
        },
      },
      update: {}, // Don't overwrite if it already exists for today
      create: {
        userId,
        questId: quest.id,
        date: today,
        currentValue: 0,
        isCompleted: false,
      },
    });
  }

  return await prisma.userQuest.findMany({
    where: {
      userId,
      date: today,
    },
    include: {
      quest: true,
    },
    orderBy: {
      quest: {
        id: "asc",
      },
    },
  });
}
