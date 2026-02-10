import { prisma } from "~~/lib/prisma";

export const XP_PER_LEVEL = 1000;

export async function awardXp(userId: number, amount: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  let newXp = user.xp + amount;
  let newLevel = user.level;

  while (newXp >= XP_PER_LEVEL) {
    newXp -= XP_PER_LEVEL;
    newLevel += 1;
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      xp: newXp,
      level: newLevel,
    },
  });

  if (newLevel >= 5) {
    await awardAchievement(userId, 5);
  }

  return updatedUser;
}

export async function awardAchievement(userId: number, achievementId: number) {
  // Check if already earned
  const existing = await prisma.userAchievement.findFirst({
    where: { userId, achievementId },
  });

  if (existing) return null;

  const achievement = await prisma.achievement.findUnique({
    where: { id: achievementId },
  });

  if (!achievement) return null;

  const earned = await prisma.userAchievement.create({
    data: {
      userId,
      achievementId,
    },
  });

  await awardXp(userId, achievement.xp_reward);

  return earned;
}

export async function trackAction(
  userId: number,
  type: string,
  plantId?: number,
) {
  // 1. Find relevant quests
  const userQuests = await prisma.userQuest.findMany({
    where: {
      userId,
      isCompleted: false,
      quest: {
        type: type,
      },
    },
    include: {
      quest: true,
    },
  });

  let totalXpAwarded = 0;

  for (const uq of userQuests) {
    const newValue = uq.currentValue + 1;
    const isCompleted = newValue >= uq.quest.target;

    await prisma.userQuest.update({
      where: { id: uq.id },
      data: {
        currentValue: newValue,
        isCompleted,
      },
    });

    if (isCompleted) {
      totalXpAwarded += uq.quest.xp_reward;
    }
  }

  // 2. Check for Achievements
  if (type === "ADD_PLANT") {
    await awardAchievement(userId, 1);
    const count = await prisma.plant.count();
    if (count >= 5) {
      await awardAchievement(userId, 2);
    }
  }

  if (type === "SENSORS") {
    // This could be tracked more complexly, but for now let's just give it after some views
    // Maybe not the best place to check it every time, but fine for a small app
  }

  if (totalXpAwarded > 0) {
    await awardXp(userId, totalXpAwarded);
  }

  // 3. Award XP to specific plant if applicable
  if (plantId) {
    await awardPlantXp(plantId, 50); // Base XP for any action on a plant
  }

  return { totalXpAwarded };
}

export async function awardPlantXp(plantId: number, amount: number) {
  const plant = await prisma.plant.findUnique({ where: { id: plantId } });
  if (!plant) return null;

  let newXp = plant.xp + amount;
  let newLevel = plant.level;

  while (newXp >= 500) {
    // Plants level up faster
    newXp -= 500;
    newLevel += 1;
  }

  return await prisma.plant.update({
    where: { id: plantId },
    data: {
      xp: newXp,
      level: newLevel,
      health: Math.min(100, plant.health + 5), // Caring for plant improves health
    },
  });
}
