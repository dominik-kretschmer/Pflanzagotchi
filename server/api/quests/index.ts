import { getUserId } from "~~/server/utils/auth";
import { ensureDailyQuests } from "~~/server/utils/quests";

export default defineEventHandler(async (event) => {
  const userId = getUserId(event);
  return await ensureDailyQuests(userId);
});
