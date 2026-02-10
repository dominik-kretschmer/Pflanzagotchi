import { prisma } from "~~/lib/prisma";

export default defineEventHandler(async (event) => {
  const userId = getCookie(event, "user-id");

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
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
