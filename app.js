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

  const profileStudioModal = document.getElementById('profileStudioModal');
  const openStudioBtn = document.getElementById('openStudioBtn');
  const closeStudioBtn = document.getElementById('closeStudioBtn');
  const studioCardTabs = document.getElementById('studioCardTabs');
  const studioThemePills = document.getElementById('studioThemePills');
  const tabHeatmapControls = document.getElementById('tabHeatmapControls');
  const tabHeroControls = document.getElementById('tabHeroControls');
  const tabStackControls = document.getElementById('tabStackControls');
  const studioUsername = document.getElementById('studioUsername');
  const fetchContribBtn = document.getElementById('fetchContribBtn');
  const usePaintedBtn = document.getElementById('usePaintedBtn');
  const fetchStatusText = document.getElementById('fetchStatusText');
  const studioAnimPills = document.getElementById('studioAnimPills');
  const studioModePills = document.getElementById('studioModePills');
  const studioStatsToggle = document.getElementById('studioStatsToggle');
  const heroNameInput = document.getElementById('heroNameInput');
  const heroStatusInput = document.getElementById('heroStatusInput');
  const heroHeadline1Input = document.getElementById('heroHeadline1Input');
  const heroHeadline2Input = document.getElementById('heroHeadline2Input');
  const stackTitleInput = document.getElementById('stackTitleInput');
  const stackSubtitleInput = document.getElementById('stackSubtitleInput');
  const stackItemsInput = document.getElementById('stackItemsInput');
  const stackQuickPicks = document.getElementById('stackQuickPicks');
  const studioPreviewTag = document.getElementById('studioPreviewTag');
  const studioSvgPreview = document.getElementById('studioSvgPreview');
  const snippetPanelTitle = document.getElementById('snippetPanelTitle');
  const snippetPanelDesc = document.getElementById('snippetPanelDesc');
  const readmeSnippetOutput = document.getElementById('readmeSnippetOutput');
  const workflowYamlOutput = document.getElementById('workflowYamlOutput');
  const workflowPanel = document.getElementById('workflowPanel');
  const staticNotePanel = document.getElementById('staticNotePanel');
  const downloadDarkSvgBtn = document.getElementById('downloadDarkSvgBtn');
  const downloadLightSvgBtn = document.getElementById('downloadLightSvgBtn');
  const copySvgRawBtn = document.getElementById('copySvgRawBtn');
  const copyFullReadmeBtn = document.getElementById('copyFullReadmeBtn');

  const FIXED_SITE_URL = 'https://arhylsion.github.io/ghgraph/';
  const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  let currentStudioTab = 'heatmap';
  let currentStudioTheme = 'dark';
  let currentStudioAnim = 'ripple';
  let currentStudioMode = 'action';
  let fetchedState = null;

  function escapeXml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getThemePalette(theme) {
    const isDark = theme === 'dark';
    return {
      isDark,
      bg: isDark ? '#1a181c' : '#ffffff',
      surfaceAlt: isDark ? '#211e23' : '#f5eff7',
      border: isDark ? 'rgba(206, 196, 207, 0.12)' : 'rgba(78, 68, 82, 0.14)',
      borderSubtle: isDark ? 'rgba(206, 196, 207, 0.08)' : 'rgba(78, 68, 82, 0.10)',
      text: isDark ? '#ebe4eb' : '#1d1a20',
      textMuted: isDark ? '#cec4cf' : '#4e4452',
      textDim: isDark ? '#9a919c' : '#7d7281',
      accent: isDark ? '#d9b9ff' : '#6e4d8e',
      accentContainer: isDark ? '#533571' : '#efddff',
      onAccentContainer: isDark ? '#efddff' : '#270747',
      emptyBorder: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.04)',
      pink: isDark ? '#fca5b9' : '#ec4899',
      lilac: isDark ? '#d9b9ff' : '#8b5cf6',
      mint: isDark ? '#8af2b3' : '#1d7e44',
      cellColors: isDark
        ? { 0: '#211e23', 1: '#1c382b', 2: '#2d6248', 3: '#50b57e', 4: '#8af2b3' }
        : { 0: '#ede7f0', 1: '#a8e6be', 2: '#60ce8a', 3: '#37ad66', 4: '#1d7e44' }
    };
  }

  function buildProfileCardSvg(username, theme, showStats, anim) {
    const cleanUser = escapeXml((username || '').trim() || 'username');
    const p = getThemePalette(theme);
    const animMode = anim || 'ripple';
    const h = showStats ? 218 : 212;

    const useFetched = fetchedState && fetchedState.username.toLowerCase() === ((username || '').trim() || '').toLowerCase();
    const activeGrid = useFetched ? fetchedState.grid : grid;

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
      ? `<text x="28" y="0" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="500" fill="${p.accent}">${totalCommits} contributions · ${activeDays} active days</text>`
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
    .gh-badge-link { cursor: pointer; text-decoration: none; }
    .gh-badge-link:hover rect { opacity: 0.85; }
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
  <a href="${FIXED_SITE_URL}" target="_blank" rel="noopener noreferrer" class="gh-badge-link">
    <g transform="translate(716, 16)">
      <rect width="76" height="24" rx="12" fill="${p.accentContainer}"/>
      <text x="38" y="16" text-anchor="middle" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="11.5" font-weight="600" fill="${p.onAccentContainer}">ghgraph</text>
    </g>
  </a>
  ${monthsSvg}
  ${weekdaysSvg}
  <g>${cellsSvg}</g>
  ${footerSvg}
</svg>`;
  }

  const TECH_ICONS = {
    typescript: '<rect x="2" y="2" width="20" height="20" rx="3.5" fill="currentColor"/><path d="M12.6 11.8h-2.5v7.4H8.3v-7.4H5.8V10.2h6.8v1.6zm1.4 5.9c.7.4 1.6.7 2.5.7 1 0 1.6-.4 1.6-1 0-.6-.5-.9-1.6-1.3-1.5-.5-2.5-1.3-2.5-2.6 0-1.5 1.3-2.6 3.2-2.6 1 0 1.8.2 2.4.5l-.5 1.5c-.5-.2-1.1-.4-1.9-.4-.9 0-1.4.4-1.4.9 0 .6.5.8 1.7 1.3 1.6.6 2.4 1.3 2.4 2.7 0 1.5-1.2 2.7-3.5 2.7-1.1 0-2.1-.3-2.8-.7l.4-1.7z" fill="var(--ic-cut)"/>',
    ts: 'ALIAS:typescript',
    javascript: '<rect x="2" y="2" width="20" height="20" rx="3.5" fill="currentColor"/><path d="M11.6 16.4c0 2-1.2 3-3 3-1.1 0-1.9-.3-2.4-.9l.9-1.3c.4.4.8.6 1.4.6.8 0 1.3-.4 1.3-1.5V10.2h1.8v6.2zm2.2 1.3c.6.4 1.5.7 2.4.7 1 0 1.6-.4 1.6-1 0-.6-.4-.9-1.6-1.3-1.5-.5-2.4-1.3-2.4-2.6 0-1.5 1.2-2.6 3.1-2.6 1 0 1.8.2 2.3.5l-.5 1.5c-.5-.2-1.1-.4-1.8-.4-.9 0-1.4.4-1.4.9 0 .6.5.8 1.7 1.3 1.5.6 2.3 1.3 2.3 2.7 0 1.5-1.2 2.7-3.4 2.7-1.1 0-2.1-.3-2.7-.7l.4-1.7z" fill="var(--ic-cut)"/>',
    js: 'ALIAS:javascript',
    python: '<path d="M11.9 2C7.3 2 7.6 4 7.6 4v2.1h4.4v.6H5.9S3 6.4 3 11.1c0 4.7 2.5 4.5 2.5 4.5h1.5v-2.2s-.1-2.5 2.5-2.5h4.3s2.4 0 2.4-2.3V4.4S16.5 2 11.9 2zm-2.3 1.4a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8z" fill="currentColor"/><path d="M12.1 22c4.6 0 4.3-2 4.3-2v-2.1H12v-.6h6.1s2.9.3 2.9-4.4c0-4.7-2.5-4.5-2.5-4.5H17v2.2s.1 2.5-2.5 2.5h-4.3s-2.4 0-2.4 2.3v4.2S7.5 22 12.1 22zm2.3-1.4a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8z" fill="currentColor" opacity="0.82"/>',
    py: 'ALIAS:python',
    react: '<circle cx="12" cy="12" r="2.1" fill="currentColor"/><ellipse cx="12" cy="12" rx="9.5" ry="3.8" stroke="currentColor" stroke-width="1.5" fill="none"/><ellipse cx="12" cy="12" rx="9.5" ry="3.8" stroke="currentColor" stroke-width="1.5" fill="none" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9.5" ry="3.8" stroke="currentColor" stroke-width="1.5" fill="none" transform="rotate(120 12 12)"/>',
    'react native': 'ALIAS:react',
    'next.js': '<circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M8.5 16.5V8.2l8.2 10.6M15.4 8.2v5.4" stroke="var(--ic-cut)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    nextjs: 'ALIAS:next.js',
    'node.js': '<path d="M12 2.2l8.5 4.9v9.8L12 21.8 3.5 16.9V7.1L12 2.2z" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linejoin="round"/><path d="M9.4 15.2V9.3l4.6 5.9V9.3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
    nodejs: 'ALIAS:node.js',
    node: 'ALIAS:node.js',
    vite: '<path d="M13.2 2L4.5 13.4h6.1L9.6 22l9.9-12.1h-6.3L13.2 2z" fill="currentColor"/>',
    astro: '<path d="M12 2.4L6.2 18.2l3.4-1.4 2.4-6.4 2.4 6.4 3.4 1.4L12 2.4zm0 14.3c-1.3 0-2.4.7-2.6 1.8.8.9 1.6 1.8 2.6 3.1 1-1.3 1.8-2.2 2.6-3.1-.2-1.1-1.3-1.8-2.6-1.8z" fill="currentColor"/>',
    'tailwind css': '<path d="M12 6c-2.7 0-4.3 1.3-5 4 1-1.3 2.2-1.8 3.5-1.5.8.2 1.3.7 1.9 1.3 1 1 2.1 2.2 4.6 2.2 2.7 0 4.3-1.3 5-4-1 1.3-2.2 1.8-3.5 1.5-.8-.2-1.3-.7-1.9-1.3C15.6 7.2 14.5 6 12 6zm-5 6c-2.7 0-4.3 1.3-5 4 1-1.3 2.2-1.8 3.5-1.5.8.2 1.3.7 1.9 1.3 1 1 2.1 2.2 4.6 2.2 2.7 0 4.3-1.3 5-4-1 1.3-2.2 1.8-3.5 1.5-.8-.2-1.3-.7-1.9-1.3C10.6 13.2 9.5 12 7 12z" fill="currentColor"/>',
    tailwind: 'ALIAS:tailwind css',
    tailwindcss: 'ALIAS:tailwind css',
    vue: '<path d="M2.5 4h4.2L12 13.2 17.3 4h4.2L12 20.5 2.5 4zm4.8 0h2.8L12 7.4 13.9 4h2.8L12 12.1 7.3 4z" fill="currentColor"/>',
    'vue.js': 'ALIAS:vue',
    svelte: '<path d="M16.9 3.6c-1.8-1.5-4.5-1.4-6.2.2L6.2 8.2c-1.4 1.4-1.7 3.5-.7 5.2l.4.6-.5.8c-.9 1.6-.6 3.7.8 4.9 1.8 1.5 4.5 1.4 6.2-.2l4.5-4.4c1.4-1.4 1.7-3.5.7-5.2l-.4-.6.5-.8c.9-1.6.6-3.7-.8-4.9z" stroke="currentColor" stroke-width="1.8" fill="none"/>',
    postgresql: '<ellipse cx="12" cy="6.2" rx="7.2" ry="3.2" stroke="currentColor" stroke-width="1.7" fill="none"/><path d="M4.8 6.2v11.6c0 1.8 3.2 3.2 7.2 3.2s7.2-1.4 7.2-3.2V6.2" stroke="currentColor" stroke-width="1.7" fill="none"/><path d="M4.8 12c0 1.8 3.2 3.2 7.2 3.2s7.2-1.4 7.2-3.2" stroke="currentColor" stroke-width="1.5" fill="none"/>',
    postgres: 'ALIAS:postgresql',
    supabase: '<path d="M13.4 2.4c.5-.6 1.5-.3 1.5.5v7.6h5.1c.8 0 1.2.9.7 1.5l-10.1 9.6c-.5.6-1.5.3-1.5-.5v-7.6H4c-.8 0-1.2-.9-.7-1.5l10.1-9.6z" fill="currentColor"/>',
    firebase: '<path d="M5.2 17.8L8.1 3.8c.1-.6.9-.7 1.2-.2l2.8 5.2 3.4-3.3c.5-.5 1.3-.2 1.4.5l1.9 11.8-6.8 3.8-6.8-3.8z" fill="currentColor"/>',
    mongodb: '<path d="M12 2.2c2.8 3.6 4.8 7 4.8 10.6 0 3.7-2 6.5-4.3 7.6v1.4h-1v-1.4C9.2 19.3 7.2 16.5 7.2 12.8 7.2 9.2 9.2 5.8 12 2.2z" fill="currentColor"/>',
    mongo: 'ALIAS:mongodb',
    redis: '<path d="M12 3.5l9 4.2-9 4.2-9-4.2 9-4.2zm-9 8.5l9 4.2 9-4.2m-18 4.2l9 4.2 9-4.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    docker: '<path d="M13.5 9.2h2.3v2.2h-2.3V9.2zm-2.9 0h2.3v2.2h-2.3V9.2zm-2.9 0H10v2.2H7.7V9.2zm2.9-2.8h2.3v2.2h-2.3V6.4zm2.9 0h2.3v2.2h-2.3V6.4zm7.4 4.3c-.6-.4-1.8-.5-2.6-.3-.2-.9-.8-1.7-1.6-2.2l-.4-.2-.2.4c-.4.7-.5 1.8-.2 2.6-.4.2-1 .5-1.8.5H3.2l-.1.5c-.2 1.6.1 3.3.9 4.7 1.1 1.8 2.9 2.7 5.4 2.7 4.5 0 7.9-2.1 9.5-6.1.7 0 2.1.1 2.8-1.4l.2-.4-.9-.8z" fill="currentColor"/>',
    kubernetes: '<circle cx="12" cy="12" r="7" stroke="currentColor" stroke-width="1.8" fill="none"/><circle cx="12" cy="12" r="2.2" fill="currentColor"/><path d="M12 2.5v3M12 18.5v3M3.5 7.5l2.6 1.5M17.9 15l2.6 1.5M20.5 7.5l-2.6 1.5M6.1 15l-2.6 1.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    k8s: 'ALIAS:kubernetes',
    git: '<circle cx="7" cy="6" r="2.2" stroke="currentColor" stroke-width="1.8" fill="none"/><circle cx="7" cy="18" r="2.2" stroke="currentColor" stroke-width="1.8" fill="none"/><circle cx="17" cy="10" r="2.2" stroke="currentColor" stroke-width="1.8" fill="none"/><path d="M7 8.2v7.6M17 12.2c0 3.2-3 4.8-7.8 5.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    github: '<path d="M12 2.2C6.5 2.2 2 6.7 2 12.2c0 4.4 2.9 8.2 6.8 9.5.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5 4-1.3 6.8-5.1 6.8-9.5 0-5.5-4.5-10-10-10z" fill="currentColor"/>',
    linux: '<rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" stroke-width="1.8" fill="none"/><path d="M7.5 9.5l3 2.5-3 2.5M12.5 14.5h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    cursor: '<path d="M12 2.2L20.5 7v10L12 21.8 3.5 17V7L12 2.2z" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linejoin="round"/><path d="M12 12l8.5-5M12 12v9.8M12 12L3.5 7" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 2.2L20.5 7 12 12 3.5 7 12 2.2z" fill="currentColor" opacity="0.35"/>',
    claude: '<path d="M12 2.2v6.6m0 6.4v6.6M2.2 12h6.6m6.4 0h6.6M5.1 5.1l4.7 4.7m4.4 4.4l4.7 4.7M18.9 5.1l-4.7 4.7m-4.4 4.4l-4.7 4.7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    openai: '<circle cx="12" cy="12" r="8.2" stroke="currentColor" stroke-width="1.7" fill="none"/><path d="M12 3.8v16.4M4.9 7.9l14.2 8.2M19.1 7.9L4.9 16.1" stroke="currentColor" stroke-width="1.5"/>',
    n8n: '<circle cx="5.5" cy="12" r="2.3" stroke="currentColor" stroke-width="1.7" fill="none"/><circle cx="12" cy="12" r="2.3" stroke="currentColor" stroke-width="1.7" fill="none"/><circle cx="18.5" cy="7.5" r="2.3" stroke="currentColor" stroke-width="1.7" fill="none"/><circle cx="18.5" cy="16.5" r="2.3" stroke="currentColor" stroke-width="1.7" fill="none"/><path d="M7.8 12h1.9m4.5-.8l2.2-2.2m-2.2 3.8l2.2 2.2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    expo: '<path d="M4.2 19.2L10.8 5.2c.5-1 1.9-1 2.4 0l6.6 14h-3.1L12 9.4l-4.7 9.8H4.2z" fill="currentColor"/>',
    tanstack: '<circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.7" fill="none"/><path d="M12 18v-6.5M12 11.5c-1.8-2.2-4.2-2-5.2-.8M12 11.5c1.8-2.2 4.2-2 5.2-.8M12 11.5c0-2.5 1.2-4 2.8-4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    figma: '<path d="M9 3h3v6H9a3 3 0 1 1 0-6zm3 0h3a3 3 0 1 1 0 6h-3V3zm0 6h3a3 3 0 1 1 0 6h-3V9zm-3 0h3v6H9a3 3 0 1 1 0-6zm0 6h3v3a3 3 0 1 1-3-3z" stroke="currentColor" stroke-width="1.6" fill="none"/>',
    vercel: '<path d="M12 3.5L21 19.5H3L12 3.5z" fill="currentColor"/>',
    cloudflare: '<path d="M17.5 18H7.2a4.2 4.2 0 0 1-.5-8.4A5.8 5.8 0 0 1 18 10.7a3.6 3.6 0 0 1-.5 7.3z" fill="currentColor"/>',
    aws: '<path d="M5 15.5c3.8 2.8 10.2 2.8 14 0M16.8 14.3l2.6.8-.8 2.6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M7 11.5l1.8-5h1.4l1.8 5M7.6 9.9h3.8M13.5 6.5l1.3 5 1.4-4 1.4 4 1.3-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    go: '<path d="M10.5 12h4.2v2.4a3.5 3.5 0 1 1-1.2-5.5M18 12a3 3 0 1 0 0 .1z" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>',
    golang: 'ALIAS:go',
    rust: '<circle cx="12" cy="12" r="6.2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    graphql: '<polygon points="12,3 19.8,7.5 19.8,16.5 12,21 4.2,16.5 4.2,7.5" stroke="currentColor" stroke-width="1.6" fill="none"/><polygon points="12,4.5 18.8,16 5.2,16" stroke="currentColor" stroke-width="1.4" fill="none"/><circle cx="12" cy="3" r="1.6" fill="currentColor"/><circle cx="19.8" cy="7.5" r="1.6" fill="currentColor"/><circle cx="19.8" cy="16.5" r="1.6" fill="currentColor"/><circle cx="12" cy="21" r="1.6" fill="currentColor"/><circle cx="4.2" cy="16.5" r="1.6" fill="currentColor"/><circle cx="4.2" cy="7.5" r="1.6" fill="currentColor"/>',
    prisma: '<path d="M5.2 17.5L11.6 3.6c.4-.8 1.5-.8 1.9 0l5.6 15.2c.3.7-.2 1.5-.9 1.6l-11.8 1.2c-.8.1-1.5-.7-1.2-1.5zm6.9-10.2L8.4 18.6l7.8-.8-4.1-10.5z" fill="currentColor"/>',
    laravel: '<path d="M4 6.5l4-2.2 4 2.2v4.6l4 2.2 4-2.2v4.6l-8 4.5-8-4.5V6.5z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" fill="none"/>',
    unity: '<path d="M12 2.5l8 4.6v9.2l-8 4.6-8-4.6V7.1l8-4.6zm0 4.2L7.5 9.3v5.4L12 17.3l4.5-2.6V9.3L12 6.7z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" fill="none"/>',
    swift: '<path d="M19.8 16.4c.5-2.3-.3-5.2-2.4-7.5-2.1-2.3-4.6-3.7-6.8-4.3 2.5 2.4 3.5 5 2.8 7.1-2.4-1.2-5-3.3-7.3-5.8 1.3 2.8 3.6 5.4 6.1 7.1-2.3.2-4.6-.4-7-1.8 1.8 3 4.8 5.2 8.4 5.5 2.2.2 4.3-.4 6.2-.3z" fill="currentColor"/>',
    kotlin: '<path d="M4 4h16l-8 8 8 8H4V4z" fill="currentColor"/>',
    php: '<ellipse cx="12" cy="12" rx="9.5" ry="5.5" stroke="currentColor" stroke-width="1.7" fill="none"/><path d="M7.5 14v-4h1.6a1.1 1.1 0 0 1 0 2.2H7.5m4.2 1.8v-4m0 2h2v2m2.2 0v-4h1.6a1.1 1.1 0 0 1 0 2.2h-1.6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    'c#': '<path d="M12 2.5l8.2 4.7v9.5L12 21.5l-8.2-4.8V7.2L12 2.5z" stroke="currentColor" stroke-width="1.7" fill="none"/><path d="M11.6 14.8a3.2 3.2 0 1 1 0-5.6M14.5 9.5v5m2.2-5v5m-3.2-3.5h4.2m-4.2 2h4.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    csharp: 'ALIAS:c#',
    'c++': '<path d="M12 2.5l8.2 4.7v9.5L12 21.5l-8.2-4.8V7.2L12 2.5z" stroke="currentColor" stroke-width="1.7" fill="none"/><path d="M10.8 14.6a3 3 0 1 1 0-5.2M13.5 12h2.4m-1.2-1.2v2.4M16.8 12h2.4M18 10.8v2.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    cpp: 'ALIAS:c++',
    java: '<path d="M7 10h9v5a4 4 0 0 1-4 4h-1a4 4 0 0 1-4-4v-5zm9 1h1.5a2 2 0 0 1 0 4H16M9.5 4.5c0 1.2 1 1.8 1 3M13 4c0 1.2 1 1.8 1 3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
  };

  const QUICK_PICK_TECHS = [
    'TypeScript', 'Python', 'React', 'Next.js', 'React Native', 'Expo',
    'Node.js', 'Vite', 'Astro', 'Tailwind CSS', 'PostgreSQL', 'Supabase',
    'Docker', 'Cursor', 'Claude', 'n8n', 'Go', 'Rust', 'Figma', 'Git'
  ];

  function resolveTechIcon(name) {
    const key = String(name || '').trim().toLowerCase();
    let entry = TECH_ICONS[key];
    if (entry && entry.startsWith('ALIAS:')) {
      entry = TECH_ICONS[entry.slice(6)];
    }
    return entry || null;
  }

  function buildHeroBannerSvg(name, status, headline1, headline2, theme) {
    const p = getThemePalette(theme);
    const cleanName = escapeXml((name || '').trim() || 'Developer');
    const initial = escapeXml(((name || '').trim()[0] || 'G').toUpperCase());
    const cleanStatus = escapeXml((status || '').trim() || 'Building open-source tools');
    const cleanH1 = escapeXml((headline1 || '').trim() || 'I build fast tools that do the work,');
    const cleanH2 = escapeXml((headline2 || '').trim() || 'and the interfaces they live in.');
    const h = 236;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 ${h}" width="820" height="${h}" fill="none">
  <defs>
    <clipPath id="gh-hero-clip"><rect width="820" height="${h}" rx="16"/></clipPath>
    <filter id="gh-hero-blur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="52"/></filter>
  </defs>
  <style>
    .gh-badge-link { cursor: pointer; text-decoration: none; }
    .gh-badge-link:hover rect { opacity: 0.85; }
    .gh-orb-a { animation: ghHeroDriftA 13s ease-in-out infinite alternate; }
    .gh-orb-b { animation: ghHeroDriftB 16s ease-in-out infinite alternate; }
    .gh-pulse-dot { animation: ghDotPulse 2.4s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
    .gh-fade-up { opacity: 0; animation: ghHeroIn 0.55s cubic-bezier(0.2, 0, 0, 1) forwards; }
    @keyframes ghHeroDriftA { from { transform: translate(-25px, -14px); } to { transform: translate(65px, 18px); } }
    @keyframes ghHeroDriftB { from { transform: translate(25px, 12px); } to { transform: translate(-60px, -16px); } }
    @keyframes ghDotPulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.45; transform: scale(1.3); } }
    @keyframes ghHeroIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  </style>
  <rect width="820" height="${h}" rx="16" fill="${p.bg}" stroke="${p.border}" stroke-width="1"/>
  <g clip-path="url(#gh-hero-clip)" filter="url(#gh-hero-blur)">
    <ellipse class="gh-orb-a" cx="700" cy="40" rx="180" ry="70" fill="${p.lilac}" opacity="${p.isDark ? '0.13' : '0.18'}"/>
    <ellipse class="gh-orb-b" cx="120" cy="220" rx="160" ry="58" fill="${p.pink}" opacity="${p.isDark ? '0.11' : '0.14'}"/>
  </g>
  <g transform="translate(32, 28)">
    <rect width="44" height="44" rx="12" fill="${p.accentContainer}" stroke="${p.border}" stroke-width="1"/>
    <text x="22" y="29" text-anchor="middle" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="20" font-weight="700" fill="${p.onAccentContainer}">${initial}</text>
  </g>
  <text x="90" y="47" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="16" font-weight="600" fill="${p.text}">${cleanName}</text>
  <circle class="gh-pulse-dot" cx="95" cy="64" r="4" fill="${p.mint}"/>
  <text x="107" y="68" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="13.5" font-weight="400" fill="${p.textDim}">${cleanStatus}</text>
  <a href="${FIXED_SITE_URL}" target="_blank" rel="noopener noreferrer" class="gh-badge-link">
    <g transform="translate(712, 28)">
      <rect width="76" height="24" rx="12" fill="${p.accentContainer}"/>
      <text x="38" y="16" text-anchor="middle" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="11.5" font-weight="600" fill="${p.onAccentContainer}">ghgraph</text>
    </g>
  </a>
  <text class="gh-fade-up" x="32" y="144" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="38" font-weight="700" letter-spacing="-0.03em" fill="${p.text}" style="animation-delay:0.06s;">${cleanH1}</text>
  <text class="gh-fade-up" x="32" y="192" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="38" font-weight="700" letter-spacing="-0.03em" fill="${p.textDim}" style="animation-delay:0.15s;">${cleanH2}</text>
</svg>`;
  }

  function buildTechStackSvg(title, subtitle, itemsCsv, theme) {
    const p = getThemePalette(theme);
    const cleanTitle = escapeXml((title || '').trim() || 'Tools.');
    const cleanSub = escapeXml((subtitle || '').trim() || 'What I build with.');
    const rawItems = (itemsCsv || '').split(',').map(s => s.trim()).filter(Boolean);
    const items = rawItems.length ? rawItems : ['TypeScript', 'Python', 'React', 'Next.js', 'Node.js', 'Docker'];

    const padX = 32;
    const maxW = 820 - padX;
    const pillH = 36;
    const gapX = 10;
    const gapY = 12;
    let curX = padX;
    let curY = 74;
    let pillsSvg = '';

    items.forEach((item, idx) => {
      const label = escapeXml(item);
      const iconMarkup = resolveTechIcon(item);
      const hasIcon = Boolean(iconMarkup);
      const textWidth = Math.round(item.length * 7.6);
      const pillW = hasIcon ? Math.max(84, textWidth + 52) : Math.max(66, textWidth + 32);

      if (curX + pillW > maxW && curX > padX) {
        curX = padX;
        curY += pillH + gapY;
      }

      const delay = (0.035 * idx).toFixed(3);
      const renderedIcon = hasIcon
        ? iconMarkup.replace(/currentColor/g, p.text).replace(/var\(--ic-cut\)/g, p.surfaceAlt)
        : '';
      const iconGroup = hasIcon
        ? `<g transform="translate(14, 10) scale(0.667)">${renderedIcon}</g>`
        : '';
      const textX = hasIcon ? 36 : 16;

      pillsSvg += `<g class="gh-pill-in" transform="translate(${curX}, ${curY})" style="animation-delay:${delay}s;">
    <rect width="${pillW}" height="${pillH}" rx="18" fill="${p.surfaceAlt}" stroke="${p.border}" stroke-width="1"/>
    ${iconGroup}
    <text x="${textX}" y="22.5" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="13" font-weight="500" fill="${p.text}">${label}</text>
  </g>`;
      curX += pillW + gapX;
    });

    const h = curY + pillH + 30;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 ${h}" width="820" height="${h}" fill="none">
  <style>
    .gh-badge-link { cursor: pointer; text-decoration: none; }
    .gh-badge-link:hover rect { opacity: 0.85; }
    .gh-pill-in { opacity: 0; animation: ghPillFade 0.38s cubic-bezier(0.2, 0, 0, 1) forwards; }
    @keyframes ghPillFade { from { opacity: 0; } to { opacity: 1; } }
  </style>
  <rect width="820" height="${h}" rx="16" fill="${p.bg}" stroke="${p.border}" stroke-width="1"/>
  <text x="32" y="46" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="22" letter-spacing="-0.02em">
    <tspan font-weight="700" fill="${p.text}">${cleanTitle}</tspan>
    <tspan dx="6" font-weight="400" fill="${p.textDim}">${cleanSub}</tspan>
  </text>
  <a href="${FIXED_SITE_URL}" target="_blank" rel="noopener noreferrer" class="gh-badge-link">
    <g transform="translate(712, 26)">
      <rect width="76" height="24" rx="12" fill="${p.accentContainer}"/>
      <text x="38" y="16" text-anchor="middle" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="11.5" font-weight="600" fill="${p.onAccentContainer}">ghgraph</text>
    </g>
  </a>
  ${pillsSvg}
</svg>`;
  }

  function renderStackQuickPicks() {
    if (!stackQuickPicks || !stackItemsInput) return;
    const currentSet = new Set(
      stackItemsInput.value.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
    );
    stackQuickPicks.innerHTML = '';
    QUICK_PICK_TECHS.forEach(tech => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'stack-pick-chip' + (currentSet.has(tech.toLowerCase()) ? ' active' : '');
      btn.textContent = tech;
      btn.addEventListener('click', () => {
        const list = stackItemsInput.value.split(',').map(s => s.trim()).filter(Boolean);
        const idx = list.findIndex(item => item.toLowerCase() === tech.toLowerCase());
        if (idx >= 0) {
          list.splice(idx, 1);
        } else {
          list.push(tech);
        }
        stackItemsInput.value = list.join(', ');
        renderStackQuickPicks();
        updateStudioPreview();
      });
      stackQuickPicks.appendChild(btn);
    });
  }

  function getActiveCardSvg(themeOverride) {
    const theme = themeOverride || currentStudioTheme;
    const username = (studioUsername ? studioUsername.value : '') || 'arhylsion';
    if (currentStudioTab === 'hero') {
      return buildHeroBannerSvg(
        heroNameInput ? heroNameInput.value : 'Arhylsion',
        heroStatusInput ? heroStatusInput.value : '',
        heroHeadline1Input ? heroHeadline1Input.value : '',
        heroHeadline2Input ? heroHeadline2Input.value : '',
        theme
      );
    }
    if (currentStudioTab === 'stack') {
      return buildTechStackSvg(
        stackTitleInput ? stackTitleInput.value : 'Tools.',
        stackSubtitleInput ? stackSubtitleInput.value : '',
        stackItemsInput ? stackItemsInput.value : '',
        theme
      );
    }
    const showStats = studioStatsToggle ? studioStatsToggle.checked : true;
    return buildProfileCardSvg(username, theme, showStats, currentStudioAnim);
  }

  function getActiveAssetPrefix() {
    if (currentStudioTab === 'hero') return 'ghgraph-hero';
    if (currentStudioTab === 'stack') return 'ghgraph-stack';
    return 'ghgraph';
  }

  function buildPictureSnippet(user, prefix, altText) {
    const u = (user || '').trim() || 'username';
    return `<a href="${FIXED_SITE_URL}">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/${u}/${u}/main/assets/${prefix}-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/${u}/${u}/main/assets/${prefix}-light.svg">
    <img alt="${altText}" src="https://raw.githubusercontent.com/${u}/${u}/main/assets/${prefix}-dark.svg" width="100%">
  </picture>
</a>`;
  }

  function buildFullReadmeMarkdown() {
    const u = ((studioUsername ? studioUsername.value : '') || 'username').trim() || 'username';
    const heroBlock = buildPictureSnippet(u, 'ghgraph-hero', `${u} — Profile Hero`);
    const heatmapBlock = buildPictureSnippet(u, 'ghgraph', `${u}'s Contribution Heatmap`);
    const stackBlock = buildPictureSnippet(u, 'ghgraph-stack', `${u}'s Tech Stack`);
    return `${heroBlock}\n\n<br>\n\n${heatmapBlock}\n\n<br>\n\n${stackBlock}\n`;
  }

  function updateStudioPreview() {
    if (!studioSvgPreview) return;
    const username = (studioUsername ? studioUsername.value : '') || 'arhylsion';
    const showStats = studioStatsToggle ? studioStatsToggle.checked : true;
    const svgCode = getActiveCardSvg(currentStudioTheme);
    studioSvgPreview.innerHTML = svgCode;

    if (studioPreviewTag) {
      if (currentStudioTab === 'hero') {
        studioPreviewTag.textContent = 'Hero Banner Preview (Static)';
      } else if (currentStudioTab === 'stack') {
        studioPreviewTag.textContent = 'Tech Stack Preview (Static)';
      } else {
        studioPreviewTag.textContent = 'Animated Heatmap Preview';
      }
    }

    if (readmeSnippetOutput) {
      const u = username.trim() || 'username';
      const prefix = getActiveAssetPrefix();
      const alt = currentStudioTab === 'hero'
        ? `${u} — Profile Hero`
        : currentStudioTab === 'stack'
          ? `${u}'s Tech Stack`
          : `${u}'s Contribution Heatmap`;
      readmeSnippetOutput.textContent = buildPictureSnippet(u, prefix, alt);
    }

    if (workflowPanel && staticNotePanel) {
      if (currentStudioTab === 'heatmap' && currentStudioMode === 'action') {
        workflowPanel.style.display = 'block';
        staticNotePanel.setAttribute('hidden', '');
      } else {
        workflowPanel.style.display = 'none';
        staticNotePanel.removeAttribute('hidden');
      }
    }

    if (workflowYamlOutput) {
      const statsFlag = showStats ? '' : ' --no-stats';
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

      - name: Generate Animated Heatmap Cards
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        run: |
          curl -sSL -O https://raw.githubusercontent.com/arhylsion/ghgraph/main/ghgraph.py
          python3 ghgraph.py --card --username \${{ github.repository_owner }} --theme both --anim ${currentStudioAnim} --output assets/${statsFlag}
          rm -f ghgraph.py

      - name: Commit and push changes
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add assets/
          git diff --staged --quiet || (git commit -m "chore: sync profile contribution heatmap" && git push)`;
    }
  }

  async function fetchUserContributions() {
    if (!studioUsername || !fetchContribBtn) return;
    const rawUser = studioUsername.value.trim();
    if (!rawUser) return;

    fetchContribBtn.disabled = true;
    fetchContribBtn.textContent = 'Fetching...';
    if (fetchStatusText) fetchStatusText.textContent = `Fetching @${rawUser} public calendar...`;

    try {
      const resp = await fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(rawUser)}?y=last`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      const contribs = Array.isArray(data.contributions) ? data.contributions : [];
      if (!contribs.length) throw new Error('No public contributions returned');

      const mapByDate = new Map();
      contribs.forEach(item => {
        mapByDate.set(item.date, {
          count: Number(item.count) || 0,
          level: Math.min(4, Math.max(0, Number(item.level) || 0))
        });
      });

      const lastDateStr = contribs[contribs.length - 1].date;
      const lastDate = new Date(`${lastDateStr}T00:00:00Z`);
      const lastDow = lastDate.getUTCDay();
      const lastSunday = new Date(lastDate);
      lastSunday.setUTCDate(lastSunday.getUTCDate() - lastDow);
      const startSunday = new Date(lastSunday);
      startSunday.setUTCDate(startSunday.getUTCDate() - 7 * 51);

      const newGrid = Array.from({ length: WEEKS }, () => new Array(DAYS).fill(0));
      const monthCols = [];
      const seenMonths = new Set();
      let totalCommits = 0;
      let activeDays = 0;

      for (let c = 0; c < WEEKS; c++) {
        for (let r = 0; r < DAYS; r++) {
          const d = new Date(startSunday);
          d.setUTCDate(d.getUTCDate() + c * 7 + r);
          const iso = d.toISOString().slice(0, 10);
          const entry = mapByDate.get(iso);
          if (entry) {
            newGrid[c][r] = entry.level;
            if (entry.count > 0) {
              totalCommits += entry.count;
              activeDays++;
            }
          }
          if (r === 0) {
            const mKey = `${d.getUTCFullYear()}-${d.getUTCMonth()}`;
            if (!seenMonths.has(mKey)) {
              seenMonths.add(mKey);
              if (!monthCols.length || c - monthCols[monthCols.length - 1].col >= 3) {
                monthCols.push({ name: MONTH_SHORT[d.getUTCMonth()], col: c });
              }
            }
          }
        }
      }

      if (data.total && typeof data.total.lastYear === 'number') {
        totalCommits = data.total.lastYear;
      }

      fetchedState = {
        username: rawUser,
        grid: newGrid,
        monthCols,
        totalCommits,
        activeDays
      };

      if (usePaintedBtn) usePaintedBtn.removeAttribute('hidden');
      if (fetchStatusText) {
        fetchStatusText.textContent = `Loaded @${rawUser}: ${totalCommits} contributions · ${activeDays} active days`;
      }
      updateStudioPreview();
    } catch {
      if (fetchStatusText) {
        fetchStatusText.textContent = `Could not fetch @${rawUser} — showing painted canvas`;
      }
    } finally {
      fetchContribBtn.disabled = false;
      fetchContribBtn.textContent = 'Fetch';
    }
  }

  function triggerSvgDownload(theme) {
    const svgCode = getActiveCardSvg(theme);
    const prefix = getActiveAssetPrefix();
    const blob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${prefix}-${theme}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function openStudioModal() {
    if (profileStudioModal) {
      profileStudioModal.removeAttribute('hidden');
      updateStudioPreview();
    }
  }

  function closeStudioModal() {
    if (profileStudioModal) {
      profileStudioModal.setAttribute('hidden', '');
    }
  }

  function initProfileStudio() {
    if (openStudioBtn) openStudioBtn.addEventListener('click', openStudioModal);
    if (closeStudioBtn) closeStudioBtn.addEventListener('click', closeStudioModal);

    if (profileStudioModal) {
      profileStudioModal.addEventListener('click', (e) => {
        if (e.target === profileStudioModal) closeStudioModal();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && profileStudioModal && !profileStudioModal.hasAttribute('hidden')) {
        closeStudioModal();
      }
    });

    if (studioCardTabs) {
      const tabs = studioCardTabs.querySelectorAll('.studio-pill');
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
          });
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');
          currentStudioTab = tab.dataset.tab;
          if (tabHeatmapControls) tabHeatmapControls.toggleAttribute('hidden', currentStudioTab !== 'heatmap');
          if (tabHeroControls) tabHeroControls.toggleAttribute('hidden', currentStudioTab !== 'hero');
          if (tabStackControls) tabStackControls.toggleAttribute('hidden', currentStudioTab !== 'stack');
          updateStudioPreview();
        });
      });
    }

    if (fetchContribBtn) {
      fetchContribBtn.addEventListener('click', fetchUserContributions);
    }

    if (usePaintedBtn) {
      usePaintedBtn.addEventListener('click', () => {
        fetchedState = null;
        usePaintedBtn.setAttribute('hidden', '');
        if (fetchStatusText) fetchStatusText.textContent = 'Using painted canvas';
        updateStudioPreview();
      });
    }

    if (studioUsername) {
      studioUsername.addEventListener('input', () => {
        updateStudioPreview();
      });
      studioUsername.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          fetchUserContributions();
        }
      });
    }

    [heroNameInput, heroStatusInput, heroHeadline1Input, heroHeadline2Input, stackTitleInput, stackSubtitleInput].forEach(el => {
      if (el) el.addEventListener('input', updateStudioPreview);
    });

    if (stackItemsInput) {
      stackItemsInput.addEventListener('input', () => {
        renderStackQuickPicks();
        updateStudioPreview();
      });
    }

    renderStackQuickPicks();

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

    if (studioAnimPills) {
      const pills = studioAnimPills.querySelectorAll('.studio-pill');
      pills.forEach(pill => {
        pill.addEventListener('click', () => {
          pills.forEach(p => {
            p.classList.remove('active');
            p.setAttribute('aria-selected', 'false');
          });
          pill.classList.add('active');
          pill.setAttribute('aria-selected', 'true');
          currentStudioAnim = pill.dataset.anim;
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
          updateStudioPreview();
        });
      });
    }

    if (downloadDarkSvgBtn) {
      downloadDarkSvgBtn.addEventListener('click', () => triggerSvgDownload('dark'));
    }

    if (downloadLightSvgBtn) {
      downloadLightSvgBtn.addEventListener('click', () => triggerSvgDownload('light'));
    }

    if (copySvgRawBtn) {
      copySvgRawBtn.addEventListener('click', () => {
        const svgCode = getActiveCardSvg(currentStudioTheme);
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

    if (copyFullReadmeBtn) {
      copyFullReadmeBtn.addEventListener('click', () => {
        const md = buildFullReadmeMarkdown();
        navigator.clipboard.writeText(md).then(() => {
          const btnSpan = copyFullReadmeBtn.querySelector('span');
          if (btnSpan) {
            const old = btnSpan.textContent;
            btnSpan.textContent = 'Copied Full README.md!';
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
