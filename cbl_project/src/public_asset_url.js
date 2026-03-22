/** Prefix path with Vite base (e.g. /cbl_website/) so public files resolve when base !== '/' */
export function public_asset_url(relative_path) {
  var base = import.meta.env.BASE_URL || '/';
  if (base.slice(-1) !== '/') base += '/';
  var rel = relative_path.replace(/^\//, '');
  return base + rel;
}
