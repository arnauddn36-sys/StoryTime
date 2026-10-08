import { defineConfig } from "vite"; // configuration de Vite
import react from "@vitejs/plugin-react"; // support de React
import tailwindcss from "@tailwindcss/vite"; // support de Tailwind

export default defineConfig({
  plugins: [react(), tailwindcss()], // active React et Tailwind
  server: {
    port: 5173, // port du frontend
    proxy: {
      // Les appels vers /api sont envoyés au backend (évite les soucis CORS en local)
      "/api": "http://localhost:3000",
    },
  },
});
