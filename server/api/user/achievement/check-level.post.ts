import { getUserId } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const userId = getUserId(event);
  const user = await UserService.findById(userId);

  if (!user) {
    throw createError({ statusCode: 404, statusMessage: "User not found" });
  }

  const fetcher = useRequestFetch(event);

  if (user.level >= 5) {
    await fetcher("/api/achievements/award", {
      method: "POST",
      body: { achievementId: 5 },
    });
  }
  if (user.level >= 10) {
    await fetcher("/api/achievements/award", {
      method: "POST",
      body: { achievementId: 10 },
    });
  }

  return { level: user.level };
});
