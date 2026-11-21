import { WEEKS, DAYS, LEVEL_COMMITS } from '../constants.js';
import { escapeXml, getThemePalette } from '../utils.js';

export function buildProfileCardSvg(username, theme, showStats, anim, paintedGrid, fetchedState) {
  const cleanUser = escapeXml((username || '').trim() || 'username');
  const p = getThemePalette(theme);
  const animMode = anim || 'ripple';
  const h = showStats ? 218 : 212;

  const useFetched = fetchedState && fetchedState.username.toLowerCase() === ((username || '').trim() || '').toLowerCase();
  const activeGrid = useFetched ? fetchedState.grid : paintedGrid;

  let totalCommits = useFetched ? fetchedState.totalCommits : 0;
  let activeDays = useFetched ? fetchedState.activeDays : 0;
  let cellsSvg = '';

  const startX = 56;
  const startY = 78;
  const step = 14.5;
  const cellSize = 11;

  for (let c = 0; c < WEEKS; c++) {
    for (let r = 0; r < DAYS; r++) {
      const lvl = activeGrid[c][r];
      if (!useFetched && lvl > 0) {
        totalCommits += LEVEL_COMMITS[lvl];
        activeDays++;
      }
      const x = (startX + c * step).toFixed(1);
      const y = (startY + r * step).toFixed(1);
      const color = p.cellColors[lvl] || p.cellColors[0];
      const strokeAttr = lvl === 0 ? `stroke="${p.emptyBorder}" stroke-width="0.5"` : 'stroke="none"';

      const enterDelay = ((c + r) * 0.014).toFixed(3);
      let cls = 'gh-c';
      let delayStyle = `animation-delay:${enterDelay}s;`;

      if (lvl > 0) {
        if (animMode === 'ripple') {
          cls = c % 2 === 0 ? 'gh-ca-pink' : 'gh-ca-lilac';
          const loopDelay = (1.0 + (c + r) * 0.055).toFixed(3);
          delayStyle = `animation-delay:${enterDelay}s,${loopDelay}s;`;
        } else if (animMode === 'rain') {
          cls = 'gh-ca-rain';
          const colPhase = ((c * 13) % 17) * 0.28;
          const loopDelay = (0.8 + colPhase + r * 0.14).toFixed(3);
          delayStyle = `animation-delay:${enterDelay}s,${loopDelay}s;`;
        } else if (animMode === 'aurora') {
          cls = 'gh-ca-aurora';
          const loopDelay = (0.8 + (c % 12) * 0.35 + r * 0.12).toFixed(3);
          delayStyle = `animation-delay:${enterDelay}s,${loopDelay}s;`;
        } else {
          cls = 'gh-ca-rhythm';
          const loopDelay = (0.8 + (6 - r) * 0.11 + (c % 8) * 0.22).toFixed(3);
          delayStyle = `animation-delay:${enterDelay}s,${loopDelay}s;`;
        }
      }

      cellsSvg += `<rect class="${cls}" x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2.5" fill="${color}" ${strokeAttr} style="${delayStyle}"/>`;
    }
  }

  const monthCols = useFetched ? fetchedState.monthCols : [
    { name: 'Jan', col: 1 }, { name: 'Feb', col: 5 }, { name: 'Mar', col: 9 },
    { name: 'Apr', col: 14 }, { name: 'May', col: 18 }, { name: 'Jun', col: 22 },
    { name: 'Jul', col: 27 }, { name: 'Aug', col: 31 }, { name: 'Sep', col: 35 },
    { name: 'Oct', col: 40 }, { name: 'Nov', col: 44 }, { name: 'Dec', col: 49 }
  ];

  let monthsSvg = '';
  monthCols.forEach(m => {
    const x = (startX + m.col * step).toFixed(1);
    monthsSvg += `<text x="${x}" y="64" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="10" font-weight="500" fill="${p.textDim}">${m.name}</text>`;
  });

  const weekdays = [
    { name: 'Mon', row: 1 },
    { name: 'Wed', row: 3 },
    { name: 'Fri', row: 5 }
  ];

  let weekdaysSvg = '';
  weekdays.forEach(w => {
    const y = (startY + w.row * step + 9).toFixed(1);
    weekdaysSvg += `<text x="28" y="${y}" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="10" font-weight="500" fill="${p.textDim}">${w.name}</text>`;
  });

  const legendY = showStats ? 200 : 196;
  const statsSvg = showStats
    ? `<text x="28" y="0" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="500" fill="${p.accent}">${totalCommits} contributions \u00b7 ${activeDays} active days</text>`
    : '';

  const footerSvg = `
  <g transform="translate(0, ${legendY})">
    ${statsSvg}
    <text x="696" y="0" text-anchor="end" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="11" fill="${p.textDim}">Less</text>
    <rect x="704" y="-9" width="9" height="9" rx="2" fill="${p.cellColors[0]}" stroke="${p.emptyBorder}" stroke-width="0.5"/>
    <rect x="716" y="-9" width="9" height="9" rx="2" fill="${p.cellColors[1]}" stroke="none"/>
    <rect x="728" y="-9" width="9" height="9" rx="2" fill="${p.cellColors[2]}" stroke="none"/>
    <rect x="740" y="-9" width="9" height="9" rx="2" fill="${p.cellColors[3]}" stroke="none"/>
    <rect x="752" y="-9" width="9" height="9" rx="2" fill="${p.cellColors[4]}" stroke="none"/>
    <text x="768" y="0" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="11" fill="${p.textDim}">More</text>
  </g>`;

  const auroraDefs = animMode === 'aurora' ? `  <defs>
    <clipPath id="gh-card-clip"><rect width="820" height="${h}" rx="14"/></clipPath>
    <filter id="gh-blur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="42"/></filter>
  </defs>` : '';

  const auroraBg = animMode === 'aurora' ? `  <g clip-path="url(#gh-card-clip)" filter="url(#gh-blur)">
    <ellipse class="gh-orb-1" cx="220" cy="110" rx="180" ry="70" fill="${p.lilac}" opacity="${p.isDark ? '0.18' : '0.20'}"/>
    <ellipse class="gh-orb-2" cx="610" cy="120" rx="170" ry="65" fill="${p.pink}" opacity="${p.isDark ? '0.16' : '0.18'}"/>
  </g>` : '';

  let animCss = '';
  if (animMode === 'ripple') {
    animCss = `    .gh-ca-pink { opacity: 0; transform-box: fill-box; transform-origin: center; animation: ghFade 0.42s cubic-bezier(0.2, 0, 0, 1) forwards, ghRipplePink 6s ease-in-out infinite; }
    .gh-ca-lilac { opacity: 0; transform-box: fill-box; transform-origin: center; animation: ghFade 0.42s cubic-bezier(0.2, 0, 0, 1) forwards, ghRippleLilac 6s ease-in-out infinite; }
    @keyframes ghRipplePink { 0%, 80%, 100% { transform: scale(1); } 88% { transform: scale(1.18); fill: ${p.pink}; } }
    @keyframes ghRippleLilac { 0%, 80%, 100% { transform: scale(1); } 88% { transform: scale(1.18); fill: ${p.lilac}; } }`;
  } else if (animMode === 'rain') {
    animCss = `    .gh-ca-rain { opacity: 0; transform-box: fill-box; transform-origin: center; animation: ghFade 0.42s cubic-bezier(0.2, 0, 0, 1) forwards, ghRain 4.8s ease-in-out infinite; }
    @keyframes ghRain { 0%, 72%, 100% { filter: brightness(1); transform: scale(1); } 80% { filter: brightness(1.55); transform: scale(1.15); fill: ${p.pink}; } 88% { filter: brightness(1.15); transform: scale(1); } }`;
  } else if (animMode === 'aurora') {
    animCss = `    .gh-ca-aurora { opacity: 0; transform-box: fill-box; transform-origin: center; animation: ghFade 0.42s cubic-bezier(0.2, 0, 0, 1) forwards, ghBreathe 5s ease-in-out infinite; }
    .gh-orb-1 { animation: ghDrift1 11s ease-in-out infinite alternate; }
    .gh-orb-2 { animation: ghDrift2 13s ease-in-out infinite alternate; }
    @keyframes ghBreathe { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.3); } }
    @keyframes ghDrift1 { from { transform: translate(-40px, -18px); } to { transform: translate(110px, 22px); } }
    @keyframes ghDrift2 { from { transform: translate(45px, 20px); } to { transform: translate(-110px, -22px); } }`;
  } else {
    animCss = `    .gh-ca-rhythm { opacity: 0; transform-box: fill-box; transform-origin: center; animation: ghFade 0.42s cubic-bezier(0.2, 0, 0, 1) forwards, ghRhythm 3.6s ease-in-out infinite; }
    @keyframes ghRhythm { 0%, 68%, 100% { transform: scale(1); filter: brightness(1); } 78% { transform: scale(1.22); filter: brightness(1.4); fill: ${p.lilac}; } 88% { transform: scale(0.96); } }`;
  }

  const styleBlock = `  <style>
    .gh-c { opacity: 0; transform-box: fill-box; transform-origin: center; animation: ghFade 0.42s cubic-bezier(0.2, 0, 0, 1) forwards; }
    @keyframes ghFade { from { opacity: 0; transform: scale(0.84); } to { opacity: 1; transform: scale(1); } }
${animCss}
  </style>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 ${h}" width="820" height="${h}" fill="none">
${auroraDefs}
${styleBlock}
  <rect width="820" height="${h}" rx="14" fill="${p.bg}" stroke="${p.border}" stroke-width="1"/>
${auroraBg}
  <text x="28" y="34" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="15" font-weight="600" fill="${p.text}">@${cleanUser}</text>
  ${monthsSvg}
  ${weekdaysSvg}
  <g>${cellsSvg}</g>
  ${footerSvg}
</svg>`;
}
