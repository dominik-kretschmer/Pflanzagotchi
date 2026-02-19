import type { H3Event } from "h3";

export interface ActionConfig {
  baseXp: number;
  plantXp: number;
  achievementId?: number;
  customLogic?: (event: H3Event, plantId?: number) => Promise<void>;
}

export function getActionsConfig(): Record<string, ActionConfig> {
  const runtimeConfig = useRuntimeConfig();
  const { actions: actionsXp, xp: xpConfig } = runtimeConfig;

  return {
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
        const fetcher = useRequestFetch(event);
        await fetcher("/api/user/achievement/check-plants", { method: "POST" });
      },
    },
  };
}
