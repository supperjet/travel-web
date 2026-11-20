import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const target = env.VITE_API_TARGET || "https://travel-api-test.chou-test.workers.dev";

  return {
    plugins: [react()],
    server: {
      port: 3000,
      strictPort: true,
      proxy: {
        "/api": { target, changeOrigin: true, secure: true },
        "/v1": { target, changeOrigin: true, secure: true },
        "/health": { target, changeOrigin: true, secure: true },
        "/ready": { target, changeOrigin: true, secure: true },
      },
    },
  };
});
