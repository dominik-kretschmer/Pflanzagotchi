import { prisma } from "~~/lib/prisma";
import { getUserId } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const userIdCookie = getCookie(event, "user-id");
  if (!userIdCookie) {
    return null;
  }
  
  const userId = getUserId(event);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      xp: true,
      level: true,
    },
  });

  return user;
});
