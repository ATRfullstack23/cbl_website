/** Base URL for Express API. Empty = same origin (Vite dev proxy /api -> server). */
export function api_url(path) {
  var base = import.meta.env.VITE_API_URL || '';
  if (base && base.slice(-1) === '/') {
    base = base.slice(0, -1);
  }
  var p = path.charAt(0) === '/' ? path : '/' + path;
  return base + p;
}
