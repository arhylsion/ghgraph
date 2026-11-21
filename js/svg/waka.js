import { escapeXml, getThemePalette } from '../utils.js';

export const WAKA_RANGE_LABELS = {
  all_time: 'ALL TIME',
  last_7_days: 'LAST 7 DAYS',
  last_30_days: 'LAST 30 DAYS',
  last_6_months: 'LAST 6 MONTHS',
  last_year: 'LAST YEAR'
};

export function parseWakaInput(rawText, limit) {
  const maxItems = Math.max(1, Math.min(10, Number(limit) || 5));
  const lines = String(rawText || '').split(/\r?\n/);
  const items = [];

  lines.forEach(rawLine => {
    const line = rawLine.trim();
    if (!line || line.startsWith('```') || line.startsWith('<!--')) return;

    if (line.includes('|')) {
      const parts = line.split('|').map(s => s.trim());
      const name = parts[0] || '';
      const text = parts[1] || '';
      const pctMatch = (parts[2] || '').match(/(\d+(?:\.\d+)?)/);
      const percent = pctMatch ? parseFloat(pctMatch[1]) : 0;
      if (name) items.push({ name, text, percent });
      return;
    }

    const rawMatch = line.match(/^(.+?)\s{2,}(.+?)\s{2,}(?:[\u2580-\u259f\u25a0-\u25ff#\-\.=]+\s+)?(\d+(?:\.\d+)?)\s*%?$/);
    if (rawMatch) {
      items.push({
        name: rawMatch[1].trim(),
        text: rawMatch[2].trim(),
        percent: parseFloat(rawMatch[3])
      });
      return;
    }

    const simpleMatch = line.match(/^(.+?)\s+(\d+(?:\.\d+)?)\s*%$/);
    if (simpleMatch) {
      items.push({
        name: simpleMatch[1].trim(),
        text: '',
        percent: parseFloat(simpleMatch[2])
      });
    }
  });

  return items.slice(0, maxItems);
}

function summarizeDurations(items) {
  let totalMins = 0;
  let parsedAny = false;
  items.forEach(item => {
    const hMatch = String(item.text || '').match(/(\d+)\s*hrs?/i);
    const mMatch = String(item.text || '').match(/(\d+)\s*mins?/i);
    if (hMatch || mMatch) {
      parsedAny = true;
      totalMins += (hMatch ? parseInt(hMatch[1], 10) : 0) * 60 + (mMatch ? parseInt(mMatch[1], 10) : 0);
    }
  });
  if (!parsedAny || totalMins <= 0) return '';
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  return hrs > 0 ? `${hrs} hrs ${mins} mins` : `${mins} mins`;
}

function renderWakaBarSvg({ trackX, y, trackW, ratio, pct, color, surfaceAlt, borderSubtle, dotInactive, delay, barStyle }) {
  const clamped = Math.min(1, Math.max(0, ratio));

  if (barStyle === 'blocks') {
    const totalBlocks = 25;
    const exact = clamped * totalBlocks;
    const fullBlocks = Math.floor(exact);
    const frac = exact - fullBlocks;
    let out = '';
    for (let i = 0; i < totalBlocks; i++) {
      const bx = (trackX + i * 14.25).toFixed(2);
      const by = y + 5;
      if (i < fullBlocks) {
        out += `<rect x="${bx}" y="${by}" width="11" height="10" rx="2.5" fill="${color}"/>`;
      } else if (i === fullBlocks && (frac >= 0.14 || (pct > 0 && fullBlocks === 0))) {
        const op = frac >= 0.78 ? '0.82' : (frac >= 0.45 ? '0.56' : '0.32');
        out += `<rect x="${bx}" y="${by}" width="11" height="10" rx="2.5" fill="${surfaceAlt}" stroke="${borderSubtle}" stroke-width="0.6"/>`;
        out += `<rect x="${bx}" y="${by}" width="11" height="10" rx="2.5" fill="${color}" opacity="${op}"/>`;
      } else {
        out += `<rect x="${bx}" y="${by}" width="11" height="10" rx="2.5" fill="${surfaceAlt}" stroke="${borderSubtle}" stroke-width="0.6"/>`;
      }
    }
    return out;
  }

  if (barStyle === 'braille') {
    const totalCells = 24;
    const exact = clamped * totalCells;
    const fullCells = Math.floor(exact);
    const frac = exact - fullCells;
    const baseX = trackX + 4.0;
    const baseY = y + 5.5;
    let out = '';
    for (let i = 0; i < totalCells; i++) {
      let activeRows = 0;
      if (i < fullCells) {
        activeRows = 4;
      } else if (i === fullCells) {
        if (frac >= 0.80) activeRows = 4;
        else if (frac >= 0.58) activeRows = 3;
        else if (frac >= 0.34) activeRows = 2;
        else if (frac >= 0.12 || (pct > 0 && fullCells === 0)) activeRows = 1;
      }
      const cx0 = baseX + i * 14.8;
      for (let row = 0; row < 4; row++) {
        const isActive = row >= (4 - activeRows);
        const dotFill = isActive ? color : dotInactive;
        const cy = (baseY + row * 3.0).toFixed(1);
        out += `<circle cx="${cx0.toFixed(1)}" cy="${cy}" r="1.15" fill="${dotFill}"/>`;
        out += `<circle cx="${(cx0 + 4.0).toFixed(1)}" cy="${cy}" r="1.15" fill="${dotFill}"/>`;
      }
    }
    return out;
  }

  const fillW = pct > 0 ? Math.max(4, Number((trackW * clamped).toFixed(1))) : 0;
  const barRect = fillW > 0
    ? `<rect class="gh-wbar" x="${trackX}" y="${y + 6}" width="${fillW}" height="8" rx="4" fill="${color}" style="animation-delay:${delay}s;"/>`
    : '';
  return `<rect x="${trackX}" y="${y + 6}" width="${trackW}" height="8" rx="4" fill="${surfaceAlt}" stroke="${borderSubtle}" stroke-width="0.75"/>
    ${barRect}`;
}

export function buildWakaMetricsSvg(options) {
  const {
    title,
    subtitle,
    rawText,
    timeRange,
    limit,
    barScale,
    barStyle,
    showSummary,
    theme
  } = options || {};

  const p = getThemePalette(theme);
  const dotInactive = p.isDark ? 'rgba(206, 196, 207, 0.16)' : 'rgba(78, 68, 82, 0.16)';
  const rowColors = p.isDark
    ? ['#d9b9ff', '#8af2b3', '#fca5b9', '#e9c661', '#a8d8ff']
    : ['#6e4d8e', '#1d7e44', '#ec4899', '#8a3c27', '#2563eb'];

  const cleanTitle = escapeXml((title || '').trim() || 'Coding Activity.');
  const cleanSub = escapeXml((subtitle || '').trim());
  const rangeLabel = escapeXml(WAKA_RANGE_LABELS[timeRange] || 'ALL TIME');
  const subSpan = cleanSub ? `\n    <tspan dx="6" font-weight="400" fill="${p.textDim}">${cleanSub}</tspan>` : '';

  const badgeW = Math.max(84, rangeLabel.length * 7 + 26);
  const badgeX = 820 - 32 - badgeW;

  const languages = parseWakaInput(rawText, limit);
  const trackX = 186;
  const trackW = 354;
  const startY = 78;
  const rowStep = 34;

  const maxPct = languages.reduce((acc, item) => Math.max(acc, Number(item.percent) || 0), 0) || 100;
  let rowsSvg = '';
  let contentBottom = 122;

  if (!languages.length) {
    rowsSvg = `  <text x="32" y="102" font-family="'JetBrains Mono', monospace" font-size="12.5" fill="${p.textDim}">Paste WakaTime stats above (e.g. Python | 65 hrs 29 mins | 19.21) to preview</text>`;
  } else {
    rowsSvg = languages.map((item, idx) => {
      const y = startY + idx * rowStep;
      const color = rowColors[idx % rowColors.length];
      let rawName = (item.name || 'Unknown').trim();
      if (rawName.length > 17) rawName = rawName.slice(0, 16).trim() + '\u2026';
      const cleanName = escapeXml(rawName);
      const cleanDur = escapeXml((item.text || '').trim());
      const pct = Math.max(0, Math.min(100, Number(item.percent) || 0));
      const pctStr = pct.toFixed(2).padStart(5, '0') + '%';
      const ratio = barScale === 'relative' ? (pct / maxPct) : (pct / 100);
      const delay = (0.055 * idx).toFixed(3);

      const barSvg = renderWakaBarSvg({
        trackX,
        y,
        trackW,
        ratio,
        pct,
        color,
        surfaceAlt: p.surfaceAlt,
        borderSubtle: p.borderSubtle,
        dotInactive,
        delay,
        barStyle: barStyle || 'bar'
      });

      return `  <g class="gh-wrow" style="animation-delay:${delay}s;">
    <circle cx="38" cy="${y + 10}" r="4" fill="${color}"/>
    <text x="52" y="${y + 14}" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="13.5" font-weight="600" fill="${p.text}">${cleanName}</text>
    ${barSvg}
    <text x="694" y="${y + 14}" text-anchor="end" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="400" fill="${p.textMuted}">${cleanDur}</text>
    <text x="788" y="${y + 14}" text-anchor="end" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="600" fill="${color}">${pctStr}</text>
  </g>`;
    }).join('\n');
    contentBottom = startY + languages.length * rowStep;
  }

  let footerSvg = '';
  let h = contentBottom + 20;
  const totalSummary = showSummary && languages.length ? summarizeDurations(languages) : '';
  if (totalSummary) {
    const divY = contentBottom + 8;
    const footY = divY + 24;
    const summaryText = escapeXml(`Shown top ${languages.length}: ${totalSummary}`);
    footerSvg = `  <line x1="32" y1="${divY}" x2="788" y2="${divY}" stroke="${p.borderSubtle}" stroke-width="1"/>
  <text x="32" y="${footY}" font-family="'JetBrains Mono', monospace" font-size="11.5" font-weight="500" fill="${p.textDim}">${summaryText}</text>\n`;
    h = footY + 24;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 ${h}" width="820" height="${h}" fill="none">
  <style>
    .gh-wrow { opacity: 0; animation: ghWakaRow 0.42s cubic-bezier(0.2, 0, 0, 1) forwards; }
    .gh-wbar { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); animation: ghWakaBar 0.72s cubic-bezier(0.2, 0, 0, 1) forwards; }
    @keyframes ghWakaRow { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes ghWakaBar { from { transform: scaleX(0); } to { transform: scaleX(1); } }
  </style>
  <rect width="820" height="${h}" rx="16" fill="${p.bg}" stroke="${p.border}" stroke-width="1"/>
  <text x="32" y="46" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="22" letter-spacing="-0.02em">
    <tspan font-weight="700" fill="${p.text}">${cleanTitle}</tspan>${subSpan}
  </text>
  <g transform="translate(${badgeX}, 26)">
    <rect width="${badgeW}" height="24" rx="12" fill="${p.accentContainer}"/>
    <text x="${(badgeW / 2).toFixed(1)}" y="15.5" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="600" fill="${p.onAccentContainer}">${rangeLabel}</text>
  </g>
${rowsSvg}
${footerSvg}</svg>`;
}
