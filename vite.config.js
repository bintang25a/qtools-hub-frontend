import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["hqhhcnz8-5174.asse.devtunnels.ms"],
    host: "localhost", // "0.0.0.0",
    port: 5174,
    strictPort: true,
    watch: {
      usePolling: true,
    },
  },
});
