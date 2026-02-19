import type { H3Event } from "h3";

export interface ActionConfig {
  baseXp: number;
  plantXp: number;
  achievementId?: number;
  customLogic?: (event: H3Event, plantId?: number) => Promise<void>;
}

export async function trackAction(
  event: H3Event,
  type: string,
  plantId?: number,
) {
  const runtimeConfig = useRuntimeConfig();
  const { actions: actionsXp, xp: xpConfig } = runtimeConfig;
  const fetcher = useRequestFetch(event);

  const ACTIONS_CONFIG: Record<string, ActionConfig> = {
    WATER: {
      baseXp: actionsXp.water,
      plantXp: xpConfig.plantValue,
    },
    FERTILIZE: {
      baseXp: actionsXp.fertilize,
      plantXp: xpConfig.plantValue,
    },
    SENSORS: {
      baseXp: actionsXp.sensors,
      plantXp: xpConfig.plantValue,
      achievementId: 4,
    },
    PRUNE: {
      baseXp: actionsXp.prune,
      plantXp: xpConfig.plantValue,
    },
    ADD_PLANT: {
      baseXp: 0,
      plantXp: 0,
      customLogic: async (event) => {
        await fetcher("/api/user/achievement/check-plants", { method: "POST" });
      },
    },
  };

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
  }

  let updatedPlant = null;
  if (plantId && config?.plantXp) {
    updatedPlant = await fetcher(`/api/plant/${plantId}/xp`, {
      method: "POST",
      body: { amount: config.plantXp },
    });
  }

  return { totalXpAwarded, updatedPlant };
}
