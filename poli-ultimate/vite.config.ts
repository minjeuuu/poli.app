import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      external: ["claude-sonnet-4-20250514"]
    }
  }
});