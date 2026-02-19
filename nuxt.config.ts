import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  runtimeConfig: {
    apiBase: process.env.NUXT_API_BASE,
    apiKey: process.env.NUXT_API_KEY,
    health: {
      lossPerWeek: Number(process.env.NUXT_HEALTH_LOSS_PER_WEEK),
      gainPerCare: Number(process.env.NUXT_HEALTH_GAIN_PER_CARE),
    },
    xp: {
      userPerLevel: Number(process.env.NUXT_XP_USER_PER_LEVEL),
      plantPerLevel: Number(process.env.NUXT_XP_PLANT_PER_LEVEL),
      plantValue: Number(process.env.NUXT_XP_PLANT_VALUE),
    },
    actions: {
      water: Number(process.env.NUXT_ACTIONS_WATER),
      fertilize: Number(process.env.NUXT_ACTIONS_FERTILIZE),
      sensors: Number(process.env.NUXT_ACTIONS_SENSORS),
      prune: Number(process.env.NUXT_ACTIONS_PRUNE),
    },
    upload: {
      maxSize: Number(process.env.NUXT_MAX_UPLOAD_SIZE || 5242880),
      path: process.env.NUXT_UPLOAD_PATH || "public/uploads/plants",
    },
    public: {
      maxSensorPoints: Number(process.env.NUXT_PUBLIC_MAX_SENSOR_POINTS),
    },
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  devServer: {
    host: "0.0.0.0",
    port: 3000,
  },
  build: {
    transpile: ["vuetify"],
  },

  vite: {
    plugins: [vuetify({ autoImport: true })],
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  modules: ["@nuxt/eslint"],
});
