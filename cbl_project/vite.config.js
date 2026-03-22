import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  var api_port = env.VITE_API_PORT || '5000'
  var api_proxy = {
    '/api': {
      target: 'http://127.0.0.1:' + api_port,
      changeOrigin: true,
    },
  }

  // Default "/" matches Vercel (site at domain root). Set VITE_BASE_PATH=/repo/ only for GitHub Pages etc.
  return defineConfig({
    plugins: [react()],
    base: env.VITE_BASE_PATH || '/',
    server: {
      proxy: api_proxy,
      host: true,
      port: 5173
    },
    // Same proxy for `npm run preview` so /api/teams works when API runs on localhost:5000
    preview: {
      proxy: api_proxy,

    },
  })
}