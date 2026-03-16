export const getInitials = (name) => {
  const cleaned = String(name || '').trim().replace(/\s+/g, ' ');
  if (!cleaned) return 'S';
  const parts = cleaned.split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

export const makeAvatarDataUri = (name) => {
  const initials = getInitials(name);
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#4F46E5"/>
      <stop offset="1" stop-color="#8B5CF6"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="256" fill="url(#g)"/>
  <text x="256" y="288" text-anchor="middle" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="168" font-weight="800" fill="#fff">${initials}</text>
</svg>`.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

