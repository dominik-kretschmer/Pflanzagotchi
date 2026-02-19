import { getUserId } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const userId = getUserId(event);
  const body = await readBody(event);
  const { type } = body;

  if (!type) {
    throw createError({
      statusCode: 400,
      statusMessage: "Action type is required",
    });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Find relevant quests for TODAY
  const userQuests = await QuestService.findIncompleteUserQuestsByType(userId, type, today);

  let totalXpAwarded = 0;
  const fetcher = useRequestFetch(event);

  for (const uq of userQuests) {
    const newValue = uq.currentValue + 1;
    const isCompleted = newValue >= uq.quest.target;

    await QuestService.updateProgress(uq.id, newValue, isCompleted);

    if (isCompleted) {
      totalXpAwarded += uq.quest.xp_reward;

      // Meta-quests to unlock achievements for repeated actions
      if (uq.quest.type === "WATER" && uq.quest.target >= 10) {
        await fetcher("/api/achievements/award", {
          method: "POST",
          body: { achievementId: 7 },
        });
      }
      if (uq.quest.type === "FERTILIZE" && uq.quest.target >= 5) {
        await fetcher("/api/achievements/award", {
          method: "POST",
          body: { achievementId: 8 },
        });
      }
    }
  }

  return { totalXpAwarded };
});
