import type { H3Event } from "h3";
import { getActionsConfig } from "./actionConfigs";

export async function trackAction(
  event: H3Event,
  type: string,
  plantId?: number,
) {
  const ACTIONS_CONFIG = getActionsConfig();
  const fetcher = useRequestFetch(event);

  await fetcher("/api/quests/ensure", { method: "POST" });

  const questResult: any = await fetcher("/api/quests/progress", {
    method: "POST",
    body: { type },
  });
  let totalXpAwarded = questResult?.totalXpAwarded || 0;

  const config = ACTIONS_CONFIG[type];

  if (config) {
    totalXpAwarded += config.baseXp;

    if (config.achievementId) {
      await fetcher("/api/achievements/award", {
        method: "POST",
        body: { achievementId: config.achievementId },
      });
    }

    if (config.customLogic) {
      await config.customLogic(event, plantId);
    }
  }

  if (totalXpAwarded > 0) {
    await fetcher("/api/user/xp", {
      method: "POST",
      body: { amount: totalXpAwarded },
    });
    // Check for level-based user achievements
    await fetcher("/api/user/achievement/check-level", { method: "POST" });
  }

  let updatedPlant = null;
  if (plantId && config?.plantXp) {
    updatedPlant = await fetcher(`/api/plant/${plantId}/xp`, {
      method: "POST",
      body: { amount: config.plantXp },
    });
    // Check for level-based plant achievements
    await fetcher(`/api/plant/${plantId}/achievement/check-level`, { method: "POST" });
  }

  return { totalXpAwarded, updatedPlant };
}
