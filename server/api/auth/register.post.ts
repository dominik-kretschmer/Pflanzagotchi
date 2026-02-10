import { prisma } from "~~/lib/prisma";
import { hashPassword } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password, name } = body;

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email and password are required",
    });
  }

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    throw createError({
      statusCode: 409,
      statusMessage: "User already exists",
    });
  }

  const user = await prisma.user.create({
    data: {
      email,
      password: hashPassword(password),
      name,
      xp: 0,
      level: 1,
    },
  });

  // Set session cookie
  setCookie(event, "user-id", user.id.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
});
