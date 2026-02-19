import { prisma } from "~~/lib/prisma";
import { getUserId } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const userId = getUserId(event);
  const count = await prisma.plant.count({ where: { userId } });
  const fetcher = useRequestFetch(event);
  
  if (count >= 1) {
    await fetcher("/api/achievements/award", {
      method: "POST",
      body: { achievementId: 1 }, // Grüner Daumen
    });
  }
  if (count >= 5) {
    await fetcher("/api/achievements/award", {
      method: "POST",
      body: { achievementId: 2 }, // Botaniker
    });
  }
  if (count >= 10) {
    await fetcher("/api/achievements/award", {
      method: "POST",
      body: { achievementId: 6 }, // Pflanzensammler
    });
  }

  return { count };
});
