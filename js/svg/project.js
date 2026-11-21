import { escapeXml, slugifyName, getThemePalette } from '../utils.js';
import { getIconPath, isImageHref } from '../icons.js';

export function getProjectMonogram(name) {
  const words = String(name || '').trim().split(/[\s|/_-]+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  const clean = (name || '').trim();
  return clean ? clean.slice(0, 2).toUpperCase() : 'PR';
}

export function buildSectionHeaderSvg(boldText, mutedText, theme) {
  const p = getThemePalette(theme);
  const cleanBold = escapeXml((boldText || '').trim() || 'Selected work.');
  const cleanMuted = escapeXml((mutedText || '').trim());
  const subSpan = cleanMuted ? `\n    <tspan dx="6" font-weight="400" fill="${p.textDim}">${cleanMuted}</tspan>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 52" width="820" height="52" fill="none">
  <text x="4" y="34" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="24" letter-spacing="-0.025em">
    <tspan font-weight="700" fill="${p.text}">${cleanBold}</tspan>${subSpan}
  </text>
</svg>`;
}

export function buildProjectCardSvg(proj, theme) {
  const item = proj || { name: '', category: '', desc: '', year: '', width: 'full' };
  const p = getThemePalette(theme);
  const isHalf = item.width === 'half';
  const w = isHalf ? 400 : 820;
  const previewH = isHalf ? 188 : 286;
  const footerH = 82;
  const h = previewH + footerH + 16;
  const pad = 12;
  const innerW = w - pad * 2;
  const uid = slugifyName(item.id || item.name || 'proj');
  const clipId = `gh-pclip-${uid}`;
  const iconClipId = `gh-piclip-${uid}`;
  const blurId = `gh-pblur-${uid}`;

  const rawName = (item.name || '').trim() || 'Project Name';
  const cleanName = escapeXml(rawName);
  const rawCat = (item.category || '').trim();
  const cleanCat = escapeXml(rawCat || 'Category');
  const cleanYear = escapeXml((item.year || '').trim());
  const maxDescChars = isHalf ? 36 : 92;
  const rawDesc = (item.desc || '').trim() || 'Short project description.';
  const trimmedDesc = rawDesc.length > maxDescChars ? rawDesc.slice(0, maxDescChars - 1).trim() + '\u2026' : rawDesc;
  const cleanDesc = escapeXml(trimmedDesc);
  const cleanImg = (item.coverDataUrl || item.coverValue || '').trim();
  const footerY = pad + previewH + 18;
  const arrowX = w - 52;

  const iconHref = item.iconDataUrl || (isImageHref(item.iconValue) ? item.iconValue.trim() : '');
  const iconPath = iconHref ? null : getIconPath(item.iconValue || '');
  const monogram = escapeXml(getProjectMonogram((item.name || '').trim()));

  let iconDefs = '';
  let iconBadgeContent = '';
  if (iconHref) {
    iconDefs = `    <clipPath id="${iconClipId}"><rect width="38" height="38" rx="10"/></clipPath>\n`;
    iconBadgeContent = `    <rect width="38" height="38" rx="10" fill="${p.surfaceHigh}"/>
    <image href="${escapeXml(iconHref)}" x="0" y="0" width="38" height="38" clip-path="url(#${iconClipId})" preserveAspectRatio="xMidYMid slice"/>
    <rect width="38" height="38" rx="10" fill="none" stroke="${p.border}" stroke-width="1"/>`;
  } else if (iconPath) {
    iconBadgeContent = `    <rect width="38" height="38" rx="10" fill="${p.surfaceHigh}" stroke="${p.border}" stroke-width="1"/>
    <g transform="translate(9, 9) scale(0.833)"><path d="${iconPath}" fill="${p.accent}"/></g>`;
  } else {
    iconBadgeContent = `    <rect width="38" height="38" rx="10" fill="${p.surfaceHigh}" stroke="${p.border}" stroke-width="1"/>
    <text x="19" y="24" text-anchor="middle" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="14" font-weight="700" fill="${p.accent}">${monogram}</text>`;
  }

  const coverContent = cleanImg
    ? `  <rect x="${pad}" y="${pad}" width="${innerW}" height="${previewH}" rx="12" fill="${p.surfaceAlt}"/>
  <image href="${escapeXml(cleanImg)}" x="${pad}" y="${pad}" width="${innerW}" height="${previewH}" clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice"/>
  <rect x="${pad}" y="${pad}" width="${innerW}" height="${previewH}" rx="12" fill="none" stroke="${p.borderSubtle}" stroke-width="1"/>`
    : `  <rect x="${pad}" y="${pad}" width="${innerW}" height="${previewH}" rx="12" fill="${p.surfaceAlt}" stroke="${p.borderSubtle}" stroke-width="1"/>
  <g clip-path="url(#${clipId})" filter="url(#${blurId})">
    <ellipse cx="${Math.round(w * 0.25)}" cy="${Math.round(previewH * 0.35)}" rx="${Math.round(w * 0.28)}" ry="70" fill="${p.lilac}" opacity="${p.isDark ? '0.20' : '0.25'}"/>
    <ellipse cx="${Math.round(w * 0.78)}" cy="${Math.round(previewH * 0.75)}" rx="${Math.round(w * 0.24)}" ry="65" fill="${p.pink}" opacity="${p.isDark ? '0.18' : '0.22'}"/>
  </g>
  <rect x="${pad + 20}" y="${pad + 18}" width="${innerW - 40}" height="${previewH - 18}" rx="10" fill="${p.bg}" stroke="${p.border}" stroke-width="1"/>
  <circle cx="${pad + 36}" cy="${pad + 34}" r="4" fill="${p.pink}"/>
  <circle cx="${pad + 50}" cy="${pad + 34}" r="4" fill="${p.secondary}"/>
  <circle cx="${pad + 64}" cy="${pad + 34}" r="4" fill="${p.mint}"/>
  <text x="${Math.round(w / 2)}" y="${Math.round(pad + previewH * 0.56)}" text-anchor="middle" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="${isHalf ? 22 : 30}" font-weight="700" letter-spacing="-0.03em" fill="${p.text}">${cleanName}</text>
  <text x="${Math.round(w / 2)}" y="${Math.round(pad + previewH * 0.56 + 22)}" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="11.5" fill="${p.textDim}">${cleanCat}</text>`;

  const catSpan = rawCat ? `\n      <tspan dx="5" font-weight="400" fill="${p.textDim}">\u00b7 ${cleanCat}</tspan>` : '';
  const titleLine = isHalf
    ? `    <text x="50" y="16" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="14.5" font-weight="600" fill="${p.text}">${cleanName}</text>`
    : `    <text x="50" y="16" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="14.5">
      <tspan font-weight="600" fill="${p.text}">${cleanName}</tspan>${catSpan}
    </text>`;

  const rightBadge = isHalf && cleanYear
    ? `  <text x="${w - 18}" y="${footerY + 16}" text-anchor="end" font-family="'JetBrains Mono', monospace" font-size="11.5" font-weight="500" fill="${p.textDim}">${cleanYear}</text>`
    : `  <g transform="translate(${arrowX}, ${footerY + 2})">
    <circle cx="17" cy="17" r="17" fill="${p.surfaceAlt}" stroke="${p.border}" stroke-width="1"/>
    <path d="M13 21L21 13M21 13H15M21 13V19" stroke="${p.textMuted}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
  </g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" fill="none">
  <defs>
    <clipPath id="${clipId}"><rect x="${pad}" y="${pad}" width="${innerW}" height="${previewH}" rx="12"/></clipPath>
${iconDefs}    <filter id="${blurId}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="44"/></filter>
  </defs>
  <rect width="${w}" height="${h}" rx="16" fill="${p.bg}" stroke="${p.border}" stroke-width="1"/>
${coverContent}
  <g transform="translate(18, ${footerY})">
${iconBadgeContent}
${titleLine}
    <text x="50" y="34" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="12.5" font-weight="400" fill="${p.textDim}">${cleanDesc}</text>
  </g>
${rightBadge}
</svg>`;
}
