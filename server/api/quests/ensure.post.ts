import { getUserId } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const userId = getUserId(event);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get all quest templates
  const allQuests = await QuestService.findAllTemplates();

  // Ensure user has each quest for today
  for (const quest of allQuests) {
    await QuestService.upsertUserQuest(userId, quest.id, today);
  }

  return await QuestService.findUserQuestsByDate(userId, today);
});
