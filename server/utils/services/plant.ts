import { prisma } from "~~/lib/prisma";

export const PlantService = {
  async findById(id: number, userId: number) {
    return await prisma.plant.findFirst({
      where: { id, userId },
      include: {
        sensorData: true,
      },
    });
  },

  async findManyByUserId(userId: number) {
    return await prisma.plant.findMany({
      where: { userId },
      include: {
        sensorData: true,
      },
    });
  },

  async create(data: any) {
    return await prisma.plant.create({
      data,
    });
  },

  async update(id: number, userId: number, data: any) {
    return await prisma.plant.updateMany({
      where: { id, userId },
      data,
    });
  },

  async delete(id: number, userId: number) {
    return await prisma.plant.deleteMany({
      where: { id, userId },
    });
  },

  async countByUserId(userId: number) {
    return await prisma.plant.count({
      where: { userId },
    });
  },

  async updateXpLevelAndHealth(id: number, xp: number, level: number, health: number) {
    return await prisma.plant.update({
      where: { id },
      data: {
        xp,
        level,
        health,
        last_interaction: new Date(),
      },
    });
  },
};
