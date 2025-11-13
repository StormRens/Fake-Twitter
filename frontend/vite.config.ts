import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { reactRouter } from "@react-router/dev/vite";

export default defineConfig({
  plugins: [react(), reactRouter(), tailwindcss()],
  server: { host: "0.0.0.0", port: 3000 },
  preview: { host: "0.0.0.0", port: 3000 }
});
