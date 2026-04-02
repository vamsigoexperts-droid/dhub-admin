/**
 * Vite exposes env vars on import.meta.env (must be prefixed with VITE_).
 * Default API is production; set VITE_API_BASE_URL for local backend (e.g. http://127.0.0.1:5013/).
 */
export function getAdminApiBaseUrl() {
  const raw = String(import.meta.env?.VITE_API_BASE_URL || 'https://api.doorstephub.com').trim();
  return raw.endsWith('/') ? raw : `${raw}/`;
}

/** Image/upload CDN; override with VITE_MEDIA_BASE_URL if needed */
export function getMediaBaseUrl() {
  const raw = String(import.meta.env?.VITE_MEDIA_BASE_URL || 'https://api.doorstephub.com').trim();
  return raw.endsWith('/') ? raw : `${raw}/`;
}
