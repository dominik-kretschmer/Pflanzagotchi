import { prisma } from "~~/lib/prisma";

export default defineEventHandler(async (event) => {
  const userIdCookie = getCookie(event, "user-id");
  const userId = userIdCookie ? parseInt(userIdCookie) : 1; // Fallback to 1 for now if not logged in

  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      achievements: {
        include: { achievement: true },
      },
      quests: {
        include: { quest: true },
      },
    },
  });
});
