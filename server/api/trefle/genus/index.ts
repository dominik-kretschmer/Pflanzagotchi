// server/api/genus/index.get.ts
import { callPlantApi } from "~/../server/utils/plantApi";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  return callPlantApi("/genus", {
    page: query.page as string | undefined,
    per_page: query.per_page as string | undefined,
  });
});
