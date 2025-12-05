import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  runtimeConfig: {
    apiBase: "",
    apiKey: "",
    public: {},
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

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
