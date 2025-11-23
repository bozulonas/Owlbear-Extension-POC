import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  // CRITICAL: Sets the base path to relative. 
  // This fixes the 404 errors when deploying to GitHub Pages subdirectories.
  base: './',
  define: {
    // This allows the code using `process.env.API_KEY` to work in the browser
    // by replacing it with the environment variables present at build time.
    'process.env': process.env
  },
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