import { escapeXml, getThemePalette } from '../utils.js';

export function wrapQuoteLines(text, maxChars) {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const lines = [];
  let current = '';
  words.forEach(w => {
    if ((current + ' ' + w).trim().length > maxChars && current) {
      lines.push(current);
      current = w;
    } else {
      current = (current + ' ' + w).trim();
    }
  });
  if (current) lines.push(current);
  return lines.slice(0, 3);
}

export function buildDevQuoteSvg(quoteText, author, label, theme) {
  const p = getThemePalette(theme);
  const lines = wrapQuoteLines(quoteText, 58);
  const rawAuthor = (author || '').trim();
  const cleanAuthor = escapeXml(rawAuthor);
  const cleanLabel = escapeXml((label || '').trim() || 'Dev Quote');
  const lineHeight = 32;
  const startY = 82;
  const lineCount = Math.max(1, lines.length);
  const authorY = startY + (lineCount - 1) * lineHeight + 42;
  const h = authorY + 32;

  const linesSvg = lines.length
    ? lines.map((line, i) => {
      const y = startY + i * lineHeight;
      const esc = escapeXml(line);
      const openQ = i === 0 ? `<tspan font-style="normal" font-weight="700" fill="${p.secondary}">\u201c</tspan>` : '';
      const closeQ = i === lines.length - 1 ? `<tspan font-style="normal" font-weight="700" fill="${p.secondary}">\u201d</tspan>` : '';
      return `  <text class="gh-q-in" x="34" y="${y}" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="22" font-weight="500" font-style="italic" letter-spacing="-0.015em" fill="${p.mint}" style="animation-delay:${(0.08 + i * 0.08).toFixed(2)}s;">${openQ}${esc}${closeQ}</text>`;
    }).join('\n')
    : `  <text x="34" y="${startY}" font-family="'JetBrains Mono', monospace" font-size="13" fill="${p.textDim}">Type your quote above, or click Shuffle Quote.</text>`;

  const authorSvg = rawAuthor
    ? `  <text class="gh-q-in" x="786" y="${authorY}" text-anchor="end" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="16" font-weight="500" font-style="italic" fill="${p.pink}" style="animation-delay:0.26s;">\u2014 ${cleanAuthor}</text>`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 ${h}" width="820" height="${h}" fill="none">
  <style>
    .gh-q-in { opacity: 0; animation: ghQuoteIn 0.5s cubic-bezier(0.2, 0, 0, 1) forwards; }
    @keyframes ghQuoteIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
  </style>
  <rect width="820" height="${h}" rx="16" fill="${p.bg}" stroke="${p.border}" stroke-width="1"/>
  <text x="34" y="36" font-family="'JetBrains Mono', monospace" font-size="11.5" font-weight="500" fill="${p.textDim}">${cleanLabel}</text>
${linesSvg}
${authorSvg}
</svg>`;
}
