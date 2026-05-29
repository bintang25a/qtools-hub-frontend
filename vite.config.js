import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "165a-2405-8180-401-7d68-3d58-b19c-b5bd-221b.ngrok-free.app",
      "https://hqhhcnz8-5173.asse.devtunnels.ms/",
    ],
    host: "localhost",
    // host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
    },
  },
});
