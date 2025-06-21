import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import fs from "fs";

console.log("🚀 Loading Vite config...");
console.log("📍 Config file location:", import.meta.url);

const localConfigPath = resolve(process.cwd(), "vite.config.local.js");
const hasLocalConfig = fs.existsSync(localConfigPath);

if (hasLocalConfig) {
  console.log("📁 Found local Vite config - loading overrides...");
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  console.log("🔧 Configuring server with mode:", mode);
  console.log("🌐 Setting allowedHosts to 'all' for Replit compatibility");

  return {
    plugins: [react()],
    root: "client",
    publicDir: "public",
    envDir: "../",
    resolve: {
      alias: {
        "@": resolve("client/src"),
        "@shared": resolve("shared"),
        "@assets": resolve("attached_assets"),
      },
    },
    server: {
      host: env.HOST || "0.0.0.0",
      port: parseInt(env.PORT || "5173"),
      strictPort: true,
      // Critical: Use array with dot prefix to match all subdomains
      allowedHosts: [".replit.dev", ".repl.co", ".replit.app", "localhost"],
      hmr: {
        clientPort: 443,
        protocol: "wss",
        host: "localhost",
      },
      cors: true,
      fs: {
        strict: false,
      },
    },
    build: {
      outDir: "../dist/public",
      emptyOutDir: true,
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              if (id.includes("react") || id.includes("react-dom")) {
                return "vendor-react";
              }
              if (id.includes("@radix-ui")) {
                return "vendor-ui";
              }
              if (id.includes("three") || id.includes("@react-three")) {
                return "vendor-three";
              }
              if (
                id.includes("framer-motion") ||
                id.includes("gsap") ||
                id.includes("lottie")
              ) {
                return "vendor-animation";
              }
              return "vendor";
            }
          },
        },
      },
      chunkSizeWarningLimit: 600,
    },
    optimizeDeps: {
      exclude: [
        "@replit/vite-plugin-runtime-error-modal",
        "@replit/vite-plugin-cartographer",
      ],
    },
  };
});
