import { prisma } from "~~/lib/prisma";

export default defineEventHandler(async () => {
  return await prisma.achievement.findMany({
    include: {
      users: {
        where: { userId: 1 },
      },
    },
  });
});
