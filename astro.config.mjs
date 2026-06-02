import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
// Zero-JS-framework build: all interactivity (theme toggle, mobile menu, tag
// filters, contact form) is vanilla JS in <script> tags. No React island runtime.
export default defineConfig({
  // `site` is REQUIRED for @astrojs/sitemap and canonical URLs.
  site: "https://sethbrasile.com",
  integrations: [sitemap(), icon()],
  vite: {
    plugins: [tailwindcss()],
  },
});
