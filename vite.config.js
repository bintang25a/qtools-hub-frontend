import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Memaksa Vite mendengar semua IP
    port: 5173,
    strictPort: true, // Supaya port tidak berubah-ubah kalau error
    watch: {
      usePolling: true, // Penting agar perubahan kode terdeteksi lebih stabil di jaringan Wi-Fi
    },
  },
});
