// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@nuxtjs/color-mode",
    "nuxt-icon",
    "@pinia/nuxt",
    "nuxt-auth-sanctum",
  ],
  ssr: false,
  colorMode: {
    preference: "light",
    fallback: "light",
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_URL || "http://localhost:80",
    },
  },

  sanctum: {
    mode: "token",
    baseUrl: process.env.API_URL || "http://localhost:80",
    endpoints: {
      login: "/api/login",
      logout: "/api/logout",
    },
  },
});
