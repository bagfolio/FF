import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import fs from "fs";

const localConfigPath = resolve(process.cwd(), "vite.config.local.js");
const hasLocalConfig = fs.existsSync(localConfigPath);

if (hasLocalConfig) {
  console.log("📁 Found local Vite config - loading overrides...");
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react(),
    ],
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
      host: env.HOST || '0.0.0.0',
      port: parseInt(env.PORT || '5173'),
      strictPort: true,
      hmr: {
        clientPort: 443,
        protocol: 'wss',
      },
      cors: mode === 'development' ? true : {
        origin: [
          /\.replit\.dev$/,
          /\.repl\.co$/,
          /^http:\/\/localhost(:\d+)?$/
        ],
        credentials: true
      }
    },
    build: {
      outDir: "../dist/public",
      emptyOutDir: true,
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }
              if (id.includes('@radix-ui')) {
                return 'vendor-ui';
              }
              if (id.includes('three') || id.includes('@react-three')) {
                return 'vendor-three';
              }
              if (id.includes('framer-motion') || id.includes('gsap') || id.includes('lottie')) {
                return 'vendor-animation';
              }
              return 'vendor';
            }
          }
        }
      },
      chunkSizeWarningLimit: 600
    },
    optimizeDeps: {
      exclude: ['@replit/vite-plugin-runtime-error-modal', '@replit/vite-plugin-cartographer']
    }
  };
});