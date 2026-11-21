export function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function slugifyName(str) {
  return String(str || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item';
}

export function getThemePalette(theme) {
  const isDark = theme === 'dark';
  return {
    isDark,
    bg: isDark ? '#1a181c' : '#ffffff',
    surfaceAlt: isDark ? '#211e23' : '#f5eff7',
    surfaceHigh: isDark ? '#2b272d' : '#efe9f1',
    border: isDark ? 'rgba(206, 196, 207, 0.12)' : 'rgba(78, 68, 82, 0.14)',
    borderSubtle: isDark ? 'rgba(206, 196, 207, 0.08)' : 'rgba(78, 68, 82, 0.10)',
    text: isDark ? '#ebe4eb' : '#1d1a20',
    textMuted: isDark ? '#cec4cf' : '#4e4452',
    textDim: isDark ? '#9a919c' : '#7d7281',
    accent: isDark ? '#d9b9ff' : '#6e4d8e',
    accentContainer: isDark ? '#533571' : '#efddff',
    onAccentContainer: isDark ? '#efddff' : '#270747',
    secondary: isDark ? '#e9c661' : '#8a3c27',
    emptyBorder: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.04)',
    pink: isDark ? '#fca5b9' : '#ec4899',
    lilac: isDark ? '#d9b9ff' : '#8b5cf6',
    mint: isDark ? '#8af2b3' : '#1d7e44',
    cellColors: isDark
      ? { 0: '#211e23', 1: '#1c382b', 2: '#2d6248', 3: '#50b57e', 4: '#8af2b3' }
      : { 0: '#ede7f0', 1: '#a8e6be', 2: '#60ce8a', 3: '#37ad66', 4: '#1d7e44' }
  };
}

export function downloadSvgFile(svgCode, filename) {
  const blob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function resizeImageFileToDataUrl(file, maxW, maxH, mime, quality, callback) {
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxW / img.width, maxH / img.height);
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      callback(canvas.toDataURL(mime || 'image/jpeg', quality || 0.86));
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

export function wireCopyButtons() {
  document.querySelectorAll('.terminal-copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      let codeText = '';
      const parent = btn.closest('.code-terminal-block');
      if (parent) {
        const codeEl = parent.querySelector('code');
        if (codeEl) codeText = codeEl.textContent.trim();
      }

      if (!codeText) return;

      try {
        await navigator.clipboard.writeText(codeText);
        btn.classList.add('copied');
        setTimeout(() => { btn.classList.remove('copied'); }, 1500);
      } catch {
        btn.classList.add('copied');
        setTimeout(() => { btn.classList.remove('copied'); }, 1500);
      }
    });
  });
}
