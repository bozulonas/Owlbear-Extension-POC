import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // CRITICAL: Sets the base path to relative (./). 
  // This allows the app to work at https://user.github.io/repo-name/ 
  base: './',
  define: {
    // CRITICAL FIX: Only inject the specific API_KEY. 
    // Injecting the whole process.env object causes syntax errors in the browser.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  },
  server: {
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