import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  runtimeConfig: {
    apiBase: "",
    apiKey: "",
    public: {},
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
