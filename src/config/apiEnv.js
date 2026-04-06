/**
 * Vite exposes env vars on import.meta.env (must be prefixed with VITE_).
 * Default API is production; override VITE_API_BASE_URL only when you intentionally want a different backend.
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
