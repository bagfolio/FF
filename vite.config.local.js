import { defineConfig } from "vite";
import baseConfig from "./vite.config.js";

export default defineConfig({
  ...baseConfig,
  server: {
    ...baseConfig.server,
    allowedHosts: [
      "d4a99208-28b9-43b3-94d5-2a4d5867d066-00-snshgn2z21dq.kirk.replit.dev",
      "d4a99298-28b9-43b3-94d5-2a4d5867d066-00-snshgn2z21dq.kirk.replit.dev",
      "localhost",
      "127.0.0.1",
      ".replit.dev",
      ".repl.co", 
      ".repl.run",
      ".replit.app"
    ],
    host: "0.0.0.0",
    port: 5173
  }
});