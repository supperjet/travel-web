import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const target = env.VITE_API_TARGET || "https://travel-api-test.chou-test.workers.dev";
  const proxyOptions = { target, changeOrigin: true, secure: true, timeout: 15_000, proxyTimeout: 15_000 };

  return {
    plugins: [react()],
    server: {
      port: 3000,
      strictPort: true,
      proxy: {
        "/api": proxyOptions,
        "/v1": proxyOptions,
        "/health": proxyOptions,
        "/ready": proxyOptions,
      },
    },
  };
});
