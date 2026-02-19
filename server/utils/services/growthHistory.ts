import { prisma } from "~~/lib/prisma";

export const GrowthHistoryService = {
  async addHistoryEntry(
    plantId: number,
    data: { level: number; xp: number; health: number },
  ) {
    return await prisma.plantGrowthHistory.create({
      data: {
        plantId,
        level: data.level,
        xp: data.xp,
        health: data.health,
      },
    });
  },

  async getHistoryByPlantId(plantId: number) {
    return await prisma.plantGrowthHistory.findMany({
      where: { plantId },
      orderBy: { timestamp: "asc" },
    });
  },

  async getStatistics(plantId: number) {
    return await prisma.plantStatistics.findUnique({
      where: { plantId },
    });
  },

  async incrementActionCount(plantId: number, actionType: string) {
    const fieldMap: Record<string, string> = {
      WATER: "total_water_count",
      FERTILIZE: "total_fertilize_count",
      PRUNE: "total_prune_count",
      SENSORS: "total_sensor_checks",
    };

    const field = fieldMap[actionType];
    if (!field) return null;

    return await prisma.plantStatistics.upsert({
      where: { plantId },
      update: { [field]: { increment: 1 } },
      create: { plantId, [field]: 1 },
    });
  },
};
