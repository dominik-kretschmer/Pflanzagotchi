
export default defineEventHandler(async (event) => {
  const fetcher = useRequestFetch(event);
  return await fetcher("/api/quests/ensure", { method: "POST" });
});
