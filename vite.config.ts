import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import sitemap from "vite-plugin-sitemap";

const routes = [
  "/",
  "/Pricing",
  "/sign-in",
  "/sign-up",
  "/support",
  "/dashboard",
  "/calls",
  "/messages",
  "/database",
  "/control-center",
  "/payment",
  "/settings",
  "/profileSettings",
  "/automationConfig",
  "/businessKnowledge",
];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    sitemap({
      hostname: "https://www.call-backer.com",
      dynamicRoutes: routes,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
