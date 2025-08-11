import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
export default defineConfig({
  site: "https://trackattackrunning.com",
  integrations: [tailwind()],
  trailingSlash: "never",
  build: {
    format: "file",
  },
  server: {
    port: 4321,
  },
});
