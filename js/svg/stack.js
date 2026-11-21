import { escapeXml, getThemePalette } from '../utils.js';
import { toSimpleIconSlug, remoteIconCache } from '../icons.js';

export function buildTechStackSvg(title, subtitle, itemsCsv, theme) {
  const p = getThemePalette(theme);
  const cleanTitle = escapeXml((title || '').trim() || 'Tools.');
  const cleanSub = escapeXml((subtitle || '').trim());
  const items = (itemsCsv || '').split(',').map(s => s.trim()).filter(Boolean);

  const padX = 32;
  const maxW = 820 - padX;
  const pillH = 36;
  const gapX = 10;
  const gapY = 12;
  let curX = padX;
  let curY = 74;
  let pillsSvg = '';

  if (!items.length) {
    pillsSvg = `<text x="32" y="98" font-family="'JetBrains Mono', monospace" font-size="12.5" fill="${p.textDim}">Type technologies above (e.g. Next.js, React, Python) to populate pills</text>`;
  } else {
    items.forEach((item, idx) => {
      const label = escapeXml(item);
      const slug = toSimpleIconSlug(item);
      const pathD = remoteIconCache.get(slug) || null;
      const hasIcon = Boolean(pathD);
      const textWidth = Math.round(item.length * 7.6);
      const pillW = hasIcon ? Math.max(84, textWidth + 52) : Math.max(66, textWidth + 32);

      if (curX + pillW > maxW && curX > padX) {
        curX = padX;
        curY += pillH + gapY;
      }

      const delay = (0.035 * idx).toFixed(3);
      const iconGroup = hasIcon
        ? `<g transform="translate(14, 10) scale(0.667)"><path d="${pathD}" fill="${p.text}"/></g>`
        : '';
      const textX = hasIcon ? 36 : 16;

      pillsSvg += `<g class="gh-pill-in" transform="translate(${curX}, ${curY})" style="animation-delay:${delay}s;">
    <rect width="${pillW}" height="${pillH}" rx="18" fill="${p.surfaceAlt}" stroke="${p.border}" stroke-width="1"/>
    ${iconGroup}
    <text x="${textX}" y="22.5" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="13" font-weight="500" fill="${p.text}">${label}</text>
  </g>`;
      curX += pillW + gapX;
    });
  }

  const h = curY + pillH + 30;
  const subSpan = cleanSub ? `\n    <tspan dx="6" font-weight="400" fill="${p.textDim}">${cleanSub}</tspan>` : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 ${h}" width="820" height="${h}" fill="none">
  <style>
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
