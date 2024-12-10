import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    cors: {
      origin: true,
      credentials: true,
    },
  },
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
  },
});
