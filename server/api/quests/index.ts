import { prisma } from "~~/lib/prisma";
import { getUserId } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const userId = getUserId(event);
  return await prisma.userQuest.findMany({
    where: { userId },
    include: {
      quest: true,
    },
  });
});
