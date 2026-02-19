import { getUserId } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const userIdCookie = getCookie(event, "user-id");
  if (!userIdCookie) {
    return null;
  }

  const userId = getUserId(event);

  const user = await UserService.findById(userId);

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    xp: user.xp,
    level: user.level,
  };
});
