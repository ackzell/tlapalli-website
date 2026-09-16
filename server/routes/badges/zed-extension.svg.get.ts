export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Content-Type', 'image/svg+xml');
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600');

  const upstream = new URL('https://zedbadge.dev/extension/tlapalli-theme.svg');
  upstream.search = new URLSearchParams(getQuery(event) as Record<string, string>).toString();

  return await $fetch(upstream.toString());
});