import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig(async ({ mode }) => {
  const plugins = [react(), runtimeErrorOverlay()];

  // Only load cartographer when running inside Replit & not in production
  if (mode !== "production" && process.env.REPL_ID) {
    const { cartographer } = await import("@replit/vite-plugin-cartographer");
    plugins.push(cartographer());
  }

  return {
    // Your app lives in /client
    root: path.resolve(import.meta.dirname, "client"),

    plugins,

    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      },
    },

    build: {
      // 👇 Build straight into "dist" so Vercel can serve it
      outDir: path.resolve(import.meta.dirname, "dist"),
      emptyOutDir: true,
    },

    server: {
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },

    // For Vercel this will just be "/"
    // For GitHub Pages you can set BASE_PATH when you run build:github-pages
    base: process.env.BASE_PATH || "/",
  };
});
