import { escapeXml, getThemePalette } from '../utils.js';

export function buildHeroBannerSvg(name, status, headline1, headline2, avatarHref, theme) {
  const p = getThemePalette(theme);
  const rawName = (name || '').trim();
  const cleanName = escapeXml(rawName || 'Your Name');
  const initial = escapeXml((rawName[0] || 'U').toUpperCase());
  const cleanStatus = escapeXml((status || '').trim() || 'Status & location');
  const cleanH1 = escapeXml((headline1 || '').trim() || 'Primary headline line,');
  const cleanH2 = escapeXml((headline2 || '').trim() || 'and secondary accent line.');
  const cleanAvatar = (avatarHref || '').trim();
  const h = 236;

  const avatarDefs = cleanAvatar
    ? '    <clipPath id="gh-avatar-clip"><rect x="32" y="28" width="44" height="44" rx="12"/></clipPath>\n'
    : '';

  const avatarBlock = cleanAvatar
    ? `  <rect x="32" y="28" width="44" height="44" rx="12" fill="${p.accentContainer}"/>
  <image href="${escapeXml(cleanAvatar)}" x="32" y="28" width="44" height="44" clip-path="url(#gh-avatar-clip)" preserveAspectRatio="xMidYMid slice"/>
  <rect x="32" y="28" width="44" height="44" rx="12" fill="none" stroke="${p.border}" stroke-width="1"/>`
    : `  <g transform="translate(32, 28)">
    <rect width="44" height="44" rx="12" fill="${p.accentContainer}" stroke="${p.border}" stroke-width="1"/>
    <text x="22" y="29" text-anchor="middle" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="20" font-weight="700" fill="${p.onAccentContainer}">${initial}</text>
  </g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 ${h}" width="820" height="${h}" fill="none">
  <defs>
    <clipPath id="gh-hero-clip"><rect width="820" height="${h}" rx="16"/></clipPath>
${avatarDefs}    <filter id="gh-hero-blur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="52"/></filter>
  </defs>
  <style>
    .gh-orb-a { animation: ghHeroDriftA 13s ease-in-out infinite alternate; }
    .gh-orb-b { animation: ghHeroDriftB 16s ease-in-out infinite alternate; }
    .gh-fade-up { opacity: 0; animation: ghHeroIn 0.55s cubic-bezier(0.2, 0, 0, 1) forwards; }
    @keyframes ghHeroDriftA { from { transform: translate(-25px, -14px); } to { transform: translate(65px, 18px); } }
    @keyframes ghHeroDriftB { from { transform: translate(25px, 12px); } to { transform: translate(-60px, -16px); } }
    @keyframes ghHeroIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  </style>
  <rect width="820" height="${h}" rx="16" fill="${p.bg}" stroke="${p.border}" stroke-width="1"/>
  <g clip-path="url(#gh-hero-clip)" filter="url(#gh-hero-blur)">
    <ellipse class="gh-orb-a" cx="700" cy="40" rx="180" ry="70" fill="${p.lilac}" opacity="${p.isDark ? '0.13' : '0.18'}"/>
    <ellipse class="gh-orb-b" cx="120" cy="220" rx="160" ry="58" fill="${p.pink}" opacity="${p.isDark ? '0.11' : '0.14'}"/>
  </g>
${avatarBlock}
  <text x="90" y="47" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="16" font-weight="600" fill="${p.text}">${cleanName}</text>
  <circle cx="95" cy="64" r="4" fill="${p.mint}"/>
  <text x="107" y="68" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="13.5" font-weight="400" fill="${p.textDim}">${cleanStatus}</text>
  <text class="gh-fade-up" x="32" y="144" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="38" font-weight="700" letter-spacing="-0.03em" fill="${p.text}" style="animation-delay:0.06s;">${cleanH1}</text>
  <text class="gh-fade-up" x="32" y="192" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="38" font-weight="700" letter-spacing="-0.03em" fill="${p.textDim}" style="animation-delay:0.15s;">${cleanH2}</text>
</svg>`;
}
