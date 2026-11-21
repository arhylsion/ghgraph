import { escapeXml, slugifyName, getThemePalette } from '../utils.js';
import { getIconPath } from '../icons.js';

export function parseContactLines(text) {
  const lines = String(text || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const out = [];
  lines.forEach(line => {
    const parts = line.split('|');
    const name = (parts[0] || '').trim();
    const url = (parts[1] || '').trim();
    if (name) out.push({ name, url, slug: slugifyName(name) });
  });
  return out;
}

export function buildSocialPillSvg(item, theme) {
  const p = getThemePalette(theme);
  const label = escapeXml(item.name);
  const pathD = getIconPath(item.name);
  const hasIcon = Boolean(pathD);
  const textWidth = Math.round(item.name.length * 7.8);
  const pillW = hasIcon ? Math.max(88, textWidth + 56) : Math.max(68, textWidth + 34);
  const pillH = 40;
  const iconGroup = hasIcon
    ? `<g transform="translate(15, 12) scale(0.667)"><path d="${pathD}" fill="${p.text}"/></g>`
    : '';
  const textX = hasIcon ? 38 : 17;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${pillW} ${pillH}" width="${pillW}" height="${pillH}" fill="none">
  <rect x="0.5" y="0.5" width="${pillW - 1}" height="${pillH - 1}" rx="20" fill="${p.surfaceAlt}" stroke="${p.border}" stroke-width="1"/>
  ${iconGroup}
  <text x="${textX}" y="24.5" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="13.5" font-weight="500" fill="${p.text}">${label}</text>
</svg>`;
}

export function buildContactCardSvg(title, subtitle, rawLines, theme) {
  const p = getThemePalette(theme);
  const cleanTitle = escapeXml((title || '').trim() || 'Say hi.');
  const cleanSub = escapeXml((subtitle || '').trim());
  const items = parseContactLines(rawLines);

  const padX = 32;
  const maxW = 820 - padX;
  const pillH = 38;
  const gapX = 10;
  const gapY = 12;
  let curX = padX;
  let curY = 76;
  let pillsSvg = '';

  if (!items.length) {
    pillsSvg = `<text x="32" y="100" font-family="'JetBrains Mono', monospace" font-size="12.5" fill="${p.textDim}">Add social links above (e.g. GitHub | https://github.com/username)</text>`;
  } else {
    items.forEach((item, idx) => {
      const label = escapeXml(item.name);
      const pathD = getIconPath(item.name);
      const hasIcon = Boolean(pathD);
      const textWidth = Math.round(item.name.length * 7.8);
      const pillW = hasIcon ? Math.max(88, textWidth + 54) : Math.max(68, textWidth + 32);

      if (curX + pillW > maxW && curX > padX) {
        curX = padX;
        curY += pillH + gapY;
      }

      const delay = (0.04 * idx).toFixed(3);
      const iconGroup = hasIcon
        ? `<g transform="translate(14, 11) scale(0.667)"><path d="${pathD}" fill="${p.text}"/></g>`
        : '';
      const textX = hasIcon ? 37 : 16;

      const pillGroup = `<g class="gh-pill-in" transform="translate(${curX}, ${curY})" style="animation-delay:${delay}s;">
      <rect width="${pillW}" height="${pillH}" rx="19" fill="${p.surfaceAlt}" stroke="${p.border}" stroke-width="1"/>
      ${iconGroup}
      <text x="${textX}" y="23.5" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="13" font-weight="500" fill="${p.text}">${label}</text>
    </g>`;

      pillsSvg += item.url
        ? `<a href="${escapeXml(item.url)}" target="_blank" rel="noopener noreferrer" class="gh-social-link">\n    ${pillGroup}\n  </a>`
        : pillGroup;
      curX += pillW + gapX;
    });
  }

  const h = curY + pillH + 30;
  const subSpan = cleanSub ? `\n    <tspan dx="6" font-weight="400" fill="${p.textDim}">${cleanSub}</tspan>` : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 ${h}" width="820" height="${h}" fill="none">
  <style>
    .gh-social-link { cursor: pointer; text-decoration: none; }
    .gh-social-link:hover rect { opacity: 0.85; }
    .gh-pill-in { opacity: 0; animation: ghPillFade 0.38s cubic-bezier(0.2, 0, 0, 1) forwards; }
    @keyframes ghPillFade { from { opacity: 0; } to { opacity: 1; } }
  </style>
  <rect width="820" height="${h}" rx="16" fill="${p.bg}" stroke="${p.border}" stroke-width="1"/>
  <text x="32" y="46" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="22" letter-spacing="-0.02em">
    <tspan font-weight="700" fill="${p.text}">${cleanTitle}</tspan>${subSpan}
  </text>
  ${pillsSvg}
</svg>`;
}
