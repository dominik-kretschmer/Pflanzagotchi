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
    await awardAchievement(userId, 5); // Meister-Gärtner
  }

  if (newLevel >= 10) {
    await awardAchievement(userId, 10); // Legende
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
      // Meta-quests to unlock achievements for repeated actions
      if (uq.quest.type === "WATER" && uq.quest.target >= 10) {
        await awardAchievement(userId, 7); // Gieß-Meister
      }
      if (uq.quest.type === "FERTILIZE" && uq.quest.target >= 5) {
        await awardAchievement(userId, 8); // Dünger-König
      }
    }
  }

  // 2. Check for Achievements
  if (type === "ADD_PLANT") {
    await awardAchievement(userId, 1); // Grüner Daumen
    const count = await prisma.plant.count();
    if (count >= 5) {
      await awardAchievement(userId, 2); // Botaniker
    }
    if (count >= 10) {
      await awardAchievement(userId, 6); // Pflanzensammler
    }
  }

  if (type === "WATER") {
    totalXpAwarded += 10; // Base XP for watering
    // For "Serien-Gießer" (3) and "Gieß-Meister" (7), we might need to track total counts
    // For now, let's just award them after some simulated progress or specific checks
  }

  if (type === "FERTILIZE") {
    totalXpAwarded += 20; // Base XP for fertilizing
  }

  if (type === "SENSORS") {
    totalXpAwarded += 5;
    await awardAchievement(userId, 4); // Daten-Experte
  }

  if (type === "PRUNE") {
    totalXpAwarded += 15;
  }

  if (totalXpAwarded > 0) {
    await awardXp(userId, totalXpAwarded);
  }

  // 3. Award XP to specific plant if applicable
  if (plantId) {
    const updatedPlant = await awardPlantXp(plantId, 50); // Base XP for any action on a plant
    if (updatedPlant && updatedPlant.level >= 10) {
      await awardAchievement(userId, 9); // Perfektionist
    }
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
