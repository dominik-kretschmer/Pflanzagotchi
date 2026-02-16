import { prisma } from "~~/lib/prisma";
import { getUserId } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const userId = getUserId(event);
  
  // Wir holen alle Erfolge, aber schliessen nur die Daten des aktuellen Users ein
  return await prisma.achievement.findMany({
    include: {
      users: {
        where: { userId },
      },
    },
  });
});
