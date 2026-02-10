import { prisma } from "~~/lib/prisma";

export default defineEventHandler(async () => {
  return await prisma.userQuest.findMany({
    where: { userId: 1 },
    include: {
      quest: true
    }
  });
});
