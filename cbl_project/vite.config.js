import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Use '/' for Vercel/Netlify at domain root. Set VITE_BASE_URL only for subpath deploys (e.g. GitHub Pages).
  base: process.env.VITE_BASE_URL || '/',
  plugins: [react()],
});
