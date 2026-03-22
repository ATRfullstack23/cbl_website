/**
 * Express API base URL from the frontend build (set in Vercel / .env as VITE_API_URL).
 *
 * Same *idea* as:
 *   fetch(`${import.meta.env.VITE_API_URL}/api/teams`)
 *
 * Do NOT use that template literally: if VITE_API_URL is missing, JavaScript turns it into
 * the string "undefined/api/teams" and the request fails.
 *
 * Local dev: leave VITE_API_URL empty → this returns "/api/teams" (relative), and Vite proxies
 * /api → http://127.0.0.1:5000 (see vite.config.js).
 *
 * Production: VITE_API_URL=https://your-api.onrender.com →
 *   https://your-api.onrender.com/api/teams
 */
export function api_url(path) {
  var raw = import.meta.env.VITE_API_URL;
  var base = raw == null || raw === '' ? '' : String(raw).trim();
  if (base && base.slice(-1) === '/') {
    base = base.slice(0, -1);
  }
  var p = path.charAt(0) === '/' ? path : '/' + path;
  return base + p;
}
