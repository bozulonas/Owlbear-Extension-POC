import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  server: {
    // CRITICAL: This allows Owlbear Rodeo (external origin) to access the manifest and assets
    // running on your localhost during development.
    cors: {
      origin: "https://www.owlbear.rodeo",
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      preflightContinue: true
    },
    headers: {
      "Access-Control-Allow-Origin": "https://www.owlbear.rodeo"
    }
  },
});