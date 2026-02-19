import { prisma } from "~~/lib/prisma";

export const UserService = {
  async findById(id: number, includeRelations = false) {
    return await prisma.user.findUnique({
      where: { id },
      include: includeRelations
        ? {
            achievements: { include: { achievement: true } },
            quests: { include: { quest: true } },
          }
        : undefined,
    });
  },

  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  },

  async create(data: {
    email: string;
    password?: string;
    name?: string;
    xp: number;
    level: number;
  }) {
    return await prisma.user.create({
      data,
    });
  },

  async updateXpAndLevel(id: number, xp: number, level: number) {
    return await prisma.user.update({
      where: { id },
      data: { xp, level },
    });
  },
};
