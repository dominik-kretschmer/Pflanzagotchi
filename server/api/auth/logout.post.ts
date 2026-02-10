export default defineEventHandler(async (event) => {
  deleteCookie(event, "user-id", {
    path: "/",
  });
  return { success: true };
});
