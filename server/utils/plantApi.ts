export type PlantApiParams = Record<
  string,
  string | number | boolean | undefined | null
>;

export const callPlantApi = async (
  path: string,
  params: PlantApiParams = {},
) => {
  const config = useRuntimeConfig();
  const base = config.apiBase;
  const token = config.apiKey;
  const url = new URL(`${base}${path}`);

  url.searchParams.set("token", token);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  return await $fetch(url.toString());
};
