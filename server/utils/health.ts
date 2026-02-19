
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function calculateCurrentHealth(plant: {
  health: number;
  last_interaction?: Date | string | null;
}) {
  if (!plant.last_interaction) return plant.health;

  const config = useRuntimeConfig();
  const healthLossPerWeek = config.health.lossPerWeek;

  const now = new Date();
  const lastInteraction = new Date(plant.last_interaction);

  if (isNaN(lastInteraction.getTime())) return plant.health;

  const diffMs = now.getTime() - lastInteraction.getTime();

  if (diffMs <= 0) return plant.health;

  const healthLoss = Math.floor((diffMs / ONE_WEEK_MS) * healthLossPerWeek);
  return Math.max(0, plant.health - healthLoss);
}
