import { getUserId } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const userId = getUserId(event);

  return await AchievementService.findAllWithUserStatus(userId);
});
