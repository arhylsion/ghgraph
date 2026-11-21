(function () {
  'use strict';

  const WEEKS = 52;
  const DAYS = 7;
  const LEVEL_COMMITS = { 0: 0, 1: 1, 2: 3, 3: 6, 4: 10 };

  const SAMPLE_SEEDS = [
    { col: 8, row: 1, lvl: 1 },
    { col: 12, row: 0, lvl: 1 }, { col: 12, row: 2, lvl: 2 }, { col: 12, row: 3, lvl: 2 }, { col: 12, row: 4, lvl: 2 }, { col: 12, row: 5, lvl: 2 }, { col: 12, row: 6, lvl: 1 },
    { col: 13, row: 0, lvl: 1 }, { col: 13, row: 4, lvl: 2 }, { col: 13, row: 6, lvl: 2 },
    { col: 14, row: 0, lvl: 2 }, { col: 14, row: 1, lvl: 2 }, { col: 14, row: 2, lvl: 3 }, { col: 14, row: 3, lvl: 2 }, { col: 14, row: 4, lvl: 4 },
    { col: 15, row: 0, lvl: 2 }, { col: 15, row: 2, lvl: 1 }, { col: 15, row: 3, lvl: 2 }, { col: 15, row: 5, lvl: 2 }, { col: 15, row: 6, lvl: 2 },
    { col: 17, row: 0, lvl: 2 }, { col: 17, row: 1, lvl: 2 }, { col: 17, row: 2, lvl: 2 }, { col: 17, row: 4, lvl: 1 }, { col: 17, row: 5, lvl: 2 }, { col: 17, row: 6, lvl: 1 },
    { col: 18, row: 0, lvl: 3 }, { col: 18, row: 1, lvl: 1 }, { col: 18, row: 6, lvl: 2 },
    { col: 19, row: 0, lvl: 4 }, { col: 19, row: 1, lvl: 1 }, { col: 19, row: 4, lvl: 2 }, { col: 19, row: 6, lvl: 3 },
    { col: 20, row: 0, lvl: 1 }, { col: 20, row: 6, lvl: 1 },
    { col: 21, row: 1, lvl: 1 }, { col: 21, row: 6, lvl: 4 },
    { col: 22, row: 1, lvl: 2 }, { col: 22, row: 6, lvl: 2 },
    { col: 23, row: 6, lvl: 1 },
    { col: 24, row: 3, lvl: 1 },
    { col: 25, row: 0, lvl: 2 }, { col: 25, row: 1, lvl: 1 }, { col: 25, row: 3, lvl: 2 }, { col: 25, row: 4, lvl: 2 }, { col: 25, row: 5, lvl: 1 }, { col: 25, row: 6, lvl: 1 },
    { col: 26, row: 0, lvl: 4 }, { col: 26, row: 1, lvl: 3 }, { col: 26, row: 4, lvl: 1 }, { col: 26, row: 6, lvl: 3 },
    { col: 27, row: 0, lvl: 2 }, { col: 27, row: 1, lvl: 3 }, { col: 27, row: 2, lvl: 3 }, { col: 27, row: 5, lvl: 3 }, { col: 27, row: 6, lvl: 2 },
    { col: 28, row: 0, lvl: 2 }, { col: 28, row: 2, lvl: 2 }, { col: 28, row: 3, lvl: 2 }, { col: 28, row: 4, lvl: 2 }, { col: 28, row: 6, lvl: 4 },
    { col: 29, row: 0, lvl: 2 }, { col: 29, row: 3, lvl: 3 }, { col: 29, row: 4, lvl: 3 },
    { col: 31, row: 0, lvl: 1 }, { col: 31, row: 5, lvl: 1 },
    { col: 34, row: 0, lvl: 2 }, { col: 34, row: 2, lvl: 1 }, { col: 34, row: 4, lvl: 2 },
    { col: 35, row: 3, lvl: 3 }, { col: 35, row: 4, lvl: 2 },
    { col: 36, row: 3, lvl: 2 },
    { col: 37, row: 1, lvl: 1 },
    { col: 38, row: 0, lvl: 2 }, { col: 38, row: 1, lvl: 2 }, { col: 38, row: 2, lvl: 3 }, { col: 38, row: 5, lvl: 2 }, { col: 38, row: 6, lvl: 3 },
    { col: 39, row: 0, lvl: 1 }, { col: 39, row: 1, lvl: 1 }, { col: 39, row: 2, lvl: 1 }, { col: 39, row: 5, lvl: 3 },
    { col: 40, row: 0, lvl: 3 }, { col: 40, row: 1, lvl: 2 }, { col: 40, row: 2, lvl: 2 }, { col: 40, row: 5, lvl: 2 }, { col: 40, row: 6, lvl: 2 },
    { col: 41, row: 0, lvl: 1 }, { col: 41, row: 2, lvl: 3 }, { col: 41, row: 3, lvl: 2 }, { col: 41, row: 4, lvl: 2 }, { col: 41, row: 5, lvl: 1 },
    { col: 42, row: 0, lvl: 3 }, { col: 42, row: 2, lvl: 3 }, { col: 42, row: 3, lvl: 2 }, { col: 42, row: 4, lvl: 1 },
    { col: 43, row: 0, lvl: 1 },
  ];

  const grid = Array.from({ length: WEEKS }, () => new Array(DAYS).fill(0));
  const startDate = new Date('2024-06-02T00:00:00Z');
  let isMouseDown = false;
  let isTouching = false;
  let touchPaintLvl = 3;
  let touchStartX = 0;
  let touchStartY = 0;
  let isHorizontalSwiping = false;

  const gridCanvas = document.getElementById('gridCanvas');
  const commandOutput = document.getElementById('commandOutput');
  const copyLiveCmdBtn = document.getElementById('copyLiveCmdBtn');
  const clearGridBtn = document.getElementById('clearGridBtn');
  const statsCounter = document.getElementById('statsCounter');
  const themeToggle = document.getElementById('themeToggle');

  function getCellDate(col, row) {
    const d = new Date(startDate);
    d.setUTCDate(d.getUTCDate() + (col * 7 + row));
    return d;
  }

  function getTooltipText(col, row, level) {
    const d = getCellDate(col, row);
    const dateFormatted = d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    });
    const commits = LEVEL_COMMITS[level];
    if (commits === 0) {
      return `No contributions on ${dateFormatted}`;
    } else if (commits === 1) {
      return `1 contribution on ${dateFormatted}`;
    } else {
      return `${commits} contributions on ${dateFormatted}`;
    }
  }

  function setCellLevel(c, r, lvl) {
    grid[c][r] = lvl;
    const cell = gridCanvas.children[c * DAYS + r];
    if (cell) {
      cell.dataset.level = lvl;
      cell.title = getTooltipText(c, r, lvl);
    }
  }

  function cycleCell(c, r) {
    const next = (grid[c][r] + 1) % 5;
    setCellLevel(c, r, next);
    updateCommand();
    return next;
  }

  function initGrid() {
    gridCanvas.innerHTML = '';
    for (let c = 0; c < WEEKS; c++) {
      for (let r = 0; r < DAYS; r++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.col = c;
        cell.dataset.row = r;
        cell.dataset.level = grid[c][r];
        cell.title = getTooltipText(c, r, grid[c][r]);

        cell.addEventListener('mousedown', (e) => {
          e.preventDefault();
          isMouseDown = true;
          cycleCell(c, r);
        });

        cell.addEventListener('mouseenter', () => {
          if (isMouseDown) {
            setCellLevel(c, r, 3);
            updateCommand();
          }
        });

        gridCanvas.appendChild(cell);
      }
    }
  }

  gridCanvas.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    isHorizontalSwiping = false;

    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (target && target.classList.contains('cell')) {
      isTouching = true;
      const c = parseInt(target.dataset.col, 10);
      const r = parseInt(target.dataset.row, 10);
      const next = cycleCell(c, r);
      touchPaintLvl = next === 0 ? 1 : next;
    }
  }, { passive: true });

  gridCanvas.addEventListener('touchmove', (e) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - touchStartX);

    if (dx > 12 && !isTouching) {
      isHorizontalSwiping = true;
      return;
    }

    if (!isTouching || isHorizontalSwiping) return;

    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (target && target.classList.contains('cell')) {
      const c = parseInt(target.dataset.col, 10);
      const r = parseInt(target.dataset.row, 10);
      if (grid[c][r] !== touchPaintLvl) {
        setCellLevel(c, r, touchPaintLvl);
        updateCommand();
      }
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isTouching = false;
    isHorizontalSwiping = false;
  });

  function syncAllCellDoms() {
    const cells = gridCanvas.querySelectorAll('.cell');
    cells.forEach(cell => {
      const c = parseInt(cell.dataset.col, 10);
      const r = parseInt(cell.dataset.row, 10);
      cell.dataset.level = grid[c][r];
      cell.title = getTooltipText(c, r, grid[c][r]);
    });
  }

  function clearGrid() {
    for (let c = 0; c < WEEKS; c++) {
      for (let r = 0; r < DAYS; r++) {
        grid[c][r] = 0;
      }
    }
    syncAllCellDoms();
    updateCommand();
  }

  function resetGrid() {
    for (let c = 0; c < WEEKS; c++) {
      for (let r = 0; r < DAYS; r++) {
        grid[c][r] = 0;
      }
    }
    SAMPLE_SEEDS.forEach(s => {
      if (s.col < WEEKS && s.row < DAYS) {
        grid[s.col][s.row] = s.lvl;
      }
    });
    syncAllCellDoms();
    updateCommand();
  }

  window.addEventListener('mouseup', () => {
    isMouseDown = false;
  });

  function updateCommand() {
    const activeDays = [];
    let totalCommits = 0;

    for (let c = 0; c < WEEKS; c++) {
      for (let r = 0; r < DAYS; r++) {
        const lvl = grid[c][r];
        if (lvl > 0) {
          const commits = LEVEL_COMMITS[lvl];
          totalCommits += commits;
          const d = getCellDate(c, r);
          const iso = d.toISOString().slice(0, 10);
          activeDays.push({ col: c, row: r, date: iso, commits, lvl });
        }
      }
    }

    if (statsCounter) {
      if (activeDays.length === 0) {
        statsCounter.textContent = '0 contributions in the last year';
      } else {
        statsCounter.textContent = `${totalCommits} contributions · ${activeDays.length} active days`;
      }
    }

    if (typeof updateStudioPreview === 'function') {
      updateStudioPreview();
    }

    if (activeDays.length === 0) {
      commandOutput.textContent = 'python ghgraph.py --repo user/activity --year 2025 --dry-run';
      return;
    }

    if (activeDays.length <= 8) {
      const datesArg = activeDays.map(d => `${d.date}:${d.commits}`).join(', ');
      commandOutput.textContent = `python ghgraph.py --repo user/activity --dates "${datesArg}"`;
      return;
    }

    const startDateStr = activeDays[0].date;
    const endDateStr = activeDays[activeDays.length - 1].date;

    if (startDateStr === endDateStr) {
      commandOutput.textContent = `python ghgraph.py --repo user/activity --dates "${startDateStr}:${totalCommits}"`;
    } else if (activeDays.length >= 35) {
      commandOutput.textContent = `python ghgraph.py --repo user/activity --spread "${startDateStr}..${endDateStr}:${totalCommits}"`;
    } else {
      commandOutput.textContent = `python ghgraph.py --repo user/activity --spread "${startDateStr}..${endDateStr}:${totalCommits}" --only-empty`;
    }
  }

  if (copyLiveCmdBtn) {
    copyLiveCmdBtn.addEventListener('click', async () => {
      const codeText = commandOutput.textContent.trim();
      if (!codeText) return;
      try {
        await navigator.clipboard.writeText(codeText);
        copyLiveCmdBtn.classList.add('copied');
        setTimeout(() => { copyLiveCmdBtn.classList.remove('copied'); }, 1500);
      } catch {
        copyLiveCmdBtn.classList.add('copied');
        setTimeout(() => { copyLiveCmdBtn.classList.remove('copied'); }, 1500);
      }
    });
  }

  if (clearGridBtn) {
    clearGridBtn.addEventListener('click', () => {
      let hasActive = false;
      for (let c = 0; c < WEEKS; c++) {
        for (let r = 0; r < DAYS; r++) {
          if (grid[c][r] > 0) {
            hasActive = true;
            break;
          }
        }
        if (hasActive) break;
      }

      if (hasActive) {
        clearGrid();
        clearGridBtn.title = 'Restore sample';
      } else {
        resetGrid();
        clearGridBtn.title = 'Clear all cells';
      }
    });
  }

  function wireCopyButtons() {
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

  function initTheme() {
    const savedTheme = localStorage.getItem('ghgraph-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const next = isDark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('ghgraph-theme', next);
    });
  }

  const tosDrawer = document.getElementById('tosDrawer');
  const openTosBtn = document.getElementById('openTosBtn');
  const openTosFooterBtn = document.getElementById('openTosFooterBtn');
  const closeTosBtn = document.getElementById('closeTosBtn');
  const ackTosBtn = document.getElementById('ackTosBtn');

  function openTos() {
    if (tosDrawer) tosDrawer.removeAttribute('hidden');
  }

  function closeTos() {
    if (tosDrawer) tosDrawer.setAttribute('hidden', '');
  }

  if (openTosBtn) openTosBtn.addEventListener('click', openTos);
  if (openTosFooterBtn) openTosFooterBtn.addEventListener('click', openTos);
  if (closeTosBtn) closeTosBtn.addEventListener('click', closeTos);
  if (ackTosBtn) ackTosBtn.addEventListener('click', closeTos);

  if (tosDrawer) {
    tosDrawer.addEventListener('click', (e) => {
      if (e.target === tosDrawer) closeTos();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && tosDrawer && !tosDrawer.hasAttribute('hidden')) {
      closeTos();
    }
  });

  const osPills = document.querySelectorAll('.os-pill');
  const downloadCmd = document.getElementById('downloadCmd');
  const tokenCmd = document.getElementById('tokenCmd');

  const OS_COMMANDS = {
    windows: {
      download: 'curl.exe -O https://raw.githubusercontent.com/arhylsion/ghgraph/main/ghgraph.py',
      token: '$env:GITHUB_TOKEN = "ghp_your_token_here"'
    },
    unix: {
      download: 'curl -O https://raw.githubusercontent.com/arhylsion/ghgraph/main/ghgraph.py',
      token: 'export GITHUB_TOKEN="ghp_your_token_here"'
    }
  };

  osPills.forEach(pill => {
    pill.addEventListener('click', () => {
      osPills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');

      const os = pill.dataset.os;
      if (OS_COMMANDS[os]) {
        if (downloadCmd) downloadCmd.textContent = OS_COMMANDS[os].download;
        if (tokenCmd) tokenCmd.textContent = OS_COMMANDS[os].token;
      }
    });
  });

  const repoInfoBtn = document.getElementById('repoInfoBtn');
  const repoInfoPopover = document.getElementById('repoInfoPopover');

  if (repoInfoBtn && repoInfoPopover) {
    repoInfoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = repoInfoPopover.hasAttribute('hidden');
      if (isHidden) {
        repoInfoPopover.removeAttribute('hidden');
      } else {
        repoInfoPopover.setAttribute('hidden', '');
      }
    });

    document.addEventListener('click', (e) => {
      if (!repoInfoPopover.contains(e.target) && e.target !== repoInfoBtn) {
        repoInfoPopover.setAttribute('hidden', '');
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        repoInfoPopover.setAttribute('hidden', '');
      }
    });
  }

  const studioUsername = document.getElementById('studioUsername');
  const studioThemePills = document.getElementById('studioThemePills');
  const studioModePills = document.getElementById('studioModePills');
  const studioStatsToggle = document.getElementById('studioStatsToggle');
  const studioSvgPreview = document.getElementById('studioSvgPreview');
  const readmeSnippetOutput = document.getElementById('readmeSnippetOutput');
  const workflowYamlOutput = document.getElementById('workflowYamlOutput');
  const workflowPanel = document.getElementById('workflowPanel');
  const downloadSvgBtn = document.getElementById('downloadSvgBtn');
  const copySvgRawBtn = document.getElementById('copySvgRawBtn');

  let currentStudioTheme = 'dark';
  let currentStudioMode = 'action';

  function buildProfileCardSvg(username, theme, showStats) {
    const cleanUser = (username || '').trim() || 'username';
    const isDark = theme === 'dark';
    const h = showStats ? 204 : 166;

    const bg = isDark ? '#1a181c' : '#ffffff';
    const border = isDark ? 'rgba(206, 196, 207, 0.12)' : 'rgba(78, 68, 82, 0.14)';
    const text = isDark ? '#ebe4eb' : '#1d1a20';
    const textDim = isDark ? '#9a919c' : '#7d7281';
    const accent = isDark ? '#d9b9ff' : '#6e4d8e';
    const accentContainer = isDark ? '#533571' : '#efddff';
    const onAccentContainer = isDark ? '#efddff' : '#270747';
    const cellBorder = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

    const cellColors = isDark
      ? { 0: '#211e23', 1: '#1c382b', 2: '#2d6248', 3: '#50b57e', 4: '#8af2b3' }
      : { 0: '#ede7f0', 1: '#a8e6be', 2: '#60ce8a', 3: '#37ad66', 4: '#1d7e44' };

    let totalCommits = 0;
    let activeDays = 0;
    let cellsSvg = '';

    const startX = 56;
    const startY = 66;
    const step = 14.5;
    const cellSize = 11;

    for (let c = 0; c < WEEKS; c++) {
      for (let r = 0; r < DAYS; r++) {
        const lvl = grid[c][r];
        if (lvl > 0) {
          totalCommits += LEVEL_COMMITS[lvl];
          activeDays++;
        }
        const x = (startX + c * step).toFixed(1);
        const y = (startY + r * step).toFixed(1);
        const color = cellColors[lvl];
        cellsSvg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2.5" fill="${color}" stroke="${cellBorder}" stroke-width="0.7"/>`;
      }
    }

    const monthCols = [
      { name: 'Jan', col: 1 }, { name: 'Feb', col: 5 }, { name: 'Mar', col: 9 },
      { name: 'Apr', col: 14 }, { name: 'May', col: 18 }, { name: 'Jun', col: 22 },
      { name: 'Jul', col: 27 }, { name: 'Aug', col: 31 }, { name: 'Sep', col: 35 },
      { name: 'Oct', col: 40 }, { name: 'Nov', col: 44 }, { name: 'Dec', col: 49 }
    ];

    let monthsSvg = '';
    monthCols.forEach(m => {
      const x = (startX + m.col * step).toFixed(1);
      monthsSvg += `<text x="${x}" y="50" font-family="'Outfit', -apple-system, sans-serif" font-size="10" font-weight="500" fill="${textDim}">${m.name}</text>`;
    });

    const weekdays = [
      { name: 'Mon', row: 1 },
      { name: 'Wed', row: 3 },
      { name: 'Fri', row: 5 }
    ];

    let weekdaysSvg = '';
    weekdays.forEach(w => {
      const y = (startY + w.row * step + 9).toFixed(1);
      weekdaysSvg += `<text x="28" y="${y}" font-family="'Outfit', -apple-system, sans-serif" font-size="10" font-weight="500" fill="${textDim}">${w.name}</text>`;
    });

    let footerSvg = '';
    if (showStats) {
      footerSvg = `
  <g transform="translate(0, 186)">
    <text x="28" y="0" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="500" fill="${accent}">${totalCommits} contributions · ${activeDays} active days</text>
    <text x="696" y="0" text-anchor="end" font-family="'Outfit', -apple-system, sans-serif" font-size="11" fill="${textDim}">Less</text>
    <rect x="704" y="-9" width="9" height="9" rx="2" fill="${cellColors[0]}" stroke="${cellBorder}" stroke-width="0.5"/>
    <rect x="716" y="-9" width="9" height="9" rx="2" fill="${cellColors[1]}" stroke="${cellBorder}" stroke-width="0.5"/>
    <rect x="728" y="-9" width="9" height="9" rx="2" fill="${cellColors[2]}" stroke="${cellBorder}" stroke-width="0.5"/>
    <rect x="740" y="-9" width="9" height="9" rx="2" fill="${cellColors[3]}" stroke="${cellBorder}" stroke-width="0.5"/>
    <rect x="752" y="-9" width="9" height="9" rx="2" fill="${cellColors[4]}" stroke="${cellBorder}" stroke-width="0.5"/>
    <text x="768" y="0" font-family="'Outfit', -apple-system, sans-serif" font-size="11" fill="${textDim}">More</text>
  </g>`;
    } else {
      footerSvg = `
  <g transform="translate(0, 150)">
    <text x="696" y="0" text-anchor="end" font-family="'Outfit', -apple-system, sans-serif" font-size="11" fill="${textDim}">Less</text>
    <rect x="704" y="-9" width="9" height="9" rx="2" fill="${cellColors[0]}" stroke="${cellBorder}" stroke-width="0.5"/>
    <rect x="716" y="-9" width="9" height="9" rx="2" fill="${cellColors[1]}" stroke="${cellBorder}" stroke-width="0.5"/>
    <rect x="728" y="-9" width="9" height="9" rx="2" fill="${cellColors[2]}" stroke="${cellBorder}" stroke-width="0.5"/>
    <rect x="740" y="-9" width="9" height="9" rx="2" fill="${cellColors[3]}" stroke="${cellBorder}" stroke-width="0.5"/>
    <rect x="752" y="-9" width="9" height="9" rx="2" fill="${cellColors[4]}" stroke="${cellBorder}" stroke-width="0.5"/>
    <text x="768" y="0" font-family="'Outfit', -apple-system, sans-serif" font-size="11" fill="${textDim}">More</text>
  </g>`;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 ${h}" width="820" height="${h}" fill="none">
  <rect width="820" height="${h}" rx="14" fill="${bg}" stroke="${border}" stroke-width="1"/>
  <text x="28" y="32" font-family="'Outfit', -apple-system, sans-serif" font-size="15" font-weight="600" fill="${text}">@${cleanUser}</text>
  <g transform="translate(738, 16)">
    <rect width="54" height="20" rx="10" fill="${accentContainer}"/>
    <text x="27" y="14" text-anchor="middle" font-family="'Outfit', -apple-system, sans-serif" font-size="11" font-weight="600" fill="${onAccentContainer}">ghgraph</text>
  </g>
  ${monthsSvg}
  ${weekdaysSvg}
  <g>${cellsSvg}</g>
  ${footerSvg}
</svg>`;
  }

  function updateStudioPreview() {
    if (!studioSvgPreview) return;
    const username = (studioUsername ? studioUsername.value : '') || 'arhylsion';
    const showStats = studioStatsToggle ? studioStatsToggle.checked : true;
    const svgCode = buildProfileCardSvg(username, currentStudioTheme, showStats);
    studioSvgPreview.innerHTML = svgCode;

    if (readmeSnippetOutput) {
      const u = username.trim() || 'username';
      readmeSnippetOutput.textContent = `<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/${u}/${u}/main/assets/ghgraph-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/${u}/${u}/main/assets/ghgraph-light.svg">
  <img alt="${u}'s Contribution Heatmap" src="https://raw.githubusercontent.com/${u}/${u}/main/assets/ghgraph-dark.svg">
</picture>`;
    }

    if (workflowYamlOutput) {
      const u = username.trim() || 'username';
      workflowYamlOutput.textContent = `name: Refresh Profile Heatmap

on:
  schedule:
    - cron: '0 0 * * *'
  workflow_dispatch:

permissions:
  contents: write

jobs:
  sync-heatmap:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Download ghgraph CLI
        run: |
          mkdir -p assets
          curl -sSL -O https://raw.githubusercontent.com/arhylsion/ghgraph/main/ghgraph.py

      - name: Generate Heatmap Cards
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        run: |
          python ghgraph.py --repo \${{ github.repository }} --year $(date +%Y) --dry-run

      - name: Commit and push changes
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add assets/
          git diff --staged --quiet || (git commit -m "chore: sync profile contribution heatmap" && git push)`;
    }
  }

  function initProfileStudio() {
    if (studioUsername) {
      studioUsername.addEventListener('input', () => {
        updateStudioPreview();
      });
    }

    if (studioStatsToggle) {
      studioStatsToggle.addEventListener('change', () => {
        updateStudioPreview();
      });
    }

    if (studioThemePills) {
      const pills = studioThemePills.querySelectorAll('.studio-pill');
      pills.forEach(pill => {
        pill.addEventListener('click', () => {
          pills.forEach(p => {
            p.classList.remove('active');
            p.setAttribute('aria-selected', 'false');
          });
          pill.classList.add('active');
          pill.setAttribute('aria-selected', 'true');
          currentStudioTheme = pill.dataset.theme;
          updateStudioPreview();
        });
      });
    }

    if (studioModePills) {
      const pills = studioModePills.querySelectorAll('.studio-pill');
      pills.forEach(pill => {
        pill.addEventListener('click', () => {
          pills.forEach(p => {
            p.classList.remove('active');
            p.setAttribute('aria-selected', 'false');
          });
          pill.classList.add('active');
          pill.setAttribute('aria-selected', 'true');
          currentStudioMode = pill.dataset.mode;
          if (workflowPanel) {
            workflowPanel.style.display = currentStudioMode === 'action' ? 'block' : 'none';
          }
        });
      });
    }

    if (downloadSvgBtn) {
      downloadSvgBtn.addEventListener('click', () => {
        const username = (studioUsername ? studioUsername.value : '') || 'username';
        const showStats = studioStatsToggle ? studioStatsToggle.checked : true;
        const svgCode = buildProfileCardSvg(username, currentStudioTheme, showStats);
        const blob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ghgraph-${currentStudioTheme}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }

    if (copySvgRawBtn) {
      copySvgRawBtn.addEventListener('click', () => {
        const username = (studioUsername ? studioUsername.value : '') || 'username';
        const showStats = studioStatsToggle ? studioStatsToggle.checked : true;
        const svgCode = buildProfileCardSvg(username, currentStudioTheme, showStats);
        navigator.clipboard.writeText(svgCode).then(() => {
          const btnSpan = copySvgRawBtn.querySelector('span');
          if (btnSpan) {
            const old = btnSpan.textContent;
            btnSpan.textContent = 'Copied!';
            setTimeout(() => {
              btnSpan.textContent = old;
            }, 1800);
          }
        });
      });
    }

    updateStudioPreview();
  }

  initTheme();
  SAMPLE_SEEDS.forEach(s => {
    if (s.col < WEEKS && s.row < DAYS) {
      grid[s.col][s.row] = s.lvl;
    }
  });
  initGrid();
  updateCommand();
  initProfileStudio();
  wireCopyButtons();
})();
