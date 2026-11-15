import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => {
  const base = process.env.VITE_BASE_PATH || '/corp-memory-frontend/';

  return {
    base,
    build: {
      target: "es2022",
      sourcemap: true,
    },
    server: {
      host: "0.0.0.0",
      port: 5294,
      strictPort: true,
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    test: {
  environment: "jsdom",
  globals: true,
  setupFiles: "./src/test/setup.ts",
  css: false,
  clearMocks: true,
  restoreMocks: true,
  exclude: [
    "**/node_modules/**",
    "**/dist/**",
    "**/e2e/**",
    "**/.{idea,git,cache,output,temp}/**",
    "**/playwright-report/**",
    "**/test-results/**",
  ],
},
  };
});