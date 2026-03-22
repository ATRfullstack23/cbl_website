import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  // Default "/" matches Vercel (site at domain root). Set VITE_BASE_PATH=/repo/ only for GitHub Pages etc.
  return defineConfig({
    plugins: [react()],
    base: env.VITE_BASE_PATH || '/',
  })
}