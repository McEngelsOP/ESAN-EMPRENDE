export function supabaseConfig() {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!raw || !key) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' || url.username || url.password) return null;
    // Acepta también la URL REST que muestra el panel de Data API.
    if (!['', '/', '/rest/v1', '/rest/v1/'].includes(url.pathname)) return null;
    return { url: url.origin, key };
  } catch { return null; }
}
