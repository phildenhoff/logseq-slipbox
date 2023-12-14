import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import logseqDevPlugin from "vite-plugin-logseq";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 3000,
  },
  build: {
    target: ["es2020"],
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2020",
    },
  },
  plugins: [svelte(), logseqDevPlugin.default()],
});
