export type PlantApiParams = Record<
  string,
  string | number | boolean | undefined | null
>;

export const callPlantApi = async (
  path: string,
  params: PlantApiParams = {},
) => {
  console.log("funzt");

  const config = useRuntimeConfig();
  const base = config.plantApiBase;
  const token = config.plantApiToken;

  if (!base || !token) {
    throw createError({
      statusCode: 500,
      statusMessage: "Plant API not configured properly",
    });
  }

  const url = new URL(`${base}${path}`);

  url.searchParams.set("token", token);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  return await $fetch(url.toString());
};
