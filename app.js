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
  const stackIconStatus = document.getElementById('stackIconStatus');
  const studioPreviewTag = document.getElementById('studioPreviewTag');
  const studioSvgPreview = document.getElementById('studioSvgPreview');
  const snippetPanelTitle = document.getElementById('snippetPanelTitle');
  const snippetPanelDesc = document.getElementById('snippetPanelDesc');
  const embedScopePills = document.getElementById('embedScopePills');
  const kitChecklistRow = document.getElementById('kitChecklistRow');
  const includeHeroCheck = document.getElementById('includeHeroCheck');
  const includeHeatmapCheck = document.getElementById('includeHeatmapCheck');
  const includeStackCheck = document.getElementById('includeStackCheck');
  const downloadKitBtn = document.getElementById('downloadKitBtn');
  const requiredFilesHint = document.getElementById('requiredFilesHint');
  const readmeSnippetOutput = document.getElementById('readmeSnippetOutput');
  const workflowYamlOutput = document.getElementById('workflowYamlOutput');
  const workflowPanel = document.getElementById('workflowPanel');
  const workflowInfoBtn = document.getElementById('workflowInfoBtn');
  const workflowInfoModal = document.getElementById('workflowInfoModal');
  const closeWorkflowInfoBtn = document.getElementById('closeWorkflowInfoBtn');
  const ackWorkflowInfoBtn = document.getElementById('ackWorkflowInfoBtn');
  const staticNotePanel = document.getElementById('staticNotePanel');
  const downloadDarkSvgBtn = document.getElementById('downloadDarkSvgBtn');
  const downloadLightSvgBtn = document.getElementById('downloadLightSvgBtn');
  const copySvgRawBtn = document.getElementById('copySvgRawBtn');

  const FIXED_SITE_URL = 'https://arhylsion.github.io/ghgraph/';
  const SIMPLE_ICONS_CDN = 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/';
  const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  let currentStudioTab = 'heatmap';
  let currentStudioTheme = 'dark';
  let currentStudioAnim = 'ripple';
  let currentStudioMode = 'action';
  let currentEmbedScope = 'kit';
  let fetchedState = null;
  let iconFetchTimer = null;
  const remoteIconCache = new Map();

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

  const SIMPLE_ICON_ALIASES = {
    ts: 'typescript',
    js: 'javascript',
    py: 'python',
    'react native': 'react',
    nextjs: 'nextdotjs',
    'next.js': 'nextdotjs',
    nodejs: 'nodedotjs',
    'node.js': 'nodedotjs',
    node: 'nodedotjs',
    tailwind: 'tailwindcss',
    'tailwind css': 'tailwindcss',
    'vue.js': 'vuedotjs',
    vue: 'vuedotjs',
    postgres: 'postgresql',
    mongo: 'mongodb',
    k8s: 'kubernetes',
    golang: 'go',
    'c++': 'cplusplus',
    cpp: 'cplusplus',
    'c#': 'csharp',
    csharp: 'csharp',
    '.net': 'dotnet',
    dotnet: 'dotnet',
    'three.js': 'threedotjs',
    threejs: 'threedotjs',
    vscode: 'visualstudiocode',
    'vs code': 'visualstudiocode',
    aws: 'amazonwebservices',
    gcp: 'googlecloud',
    'google cloud': 'googlecloud',
    'github actions': 'githubactions',
    'framer motion': 'framer',
    shadcn: 'shadcnui',
    'shadcn/ui': 'shadcnui',
    html: 'html5',
    css: 'css3',
    sass: 'sass',
    scss: 'sass',
    shell: 'gnubash',
    bash: 'gnubash',
    arch: 'archlinux',
    mysql: 'mysql',
    sqlite: 'sqlite',
    tensorflow: 'tensorflow',
    pytorch: 'pytorch',
    fastapi: 'fastapi',
    express: 'express',
    nestjs: 'nestjs',
    remix: 'remix',
    nuxt: 'nuxtdotjs',
    'nuxt.js': 'nuxtdotjs',
    bun: 'bun',
    deno: 'deno',
    flutter: 'flutter',
    dart: 'dart',
    elixir: 'elixir',
    ruby: 'ruby',
    rails: 'rubyonrails',
    zig: 'zig'
  };

  const QUICK_PICK_TECHS = [
    'TypeScript', 'Python', 'React', 'Next.js', 'React Native', 'Expo',
    'Node.js', 'Vite', 'Astro', 'Tailwind CSS', 'PostgreSQL', 'Supabase',
    'Docker', 'Cursor', 'Claude', 'n8n', 'Go', 'Rust', 'Figma', 'Git'
  ];

  function toSimpleIconSlug(name) {
    const clean = String(name || '').trim().toLowerCase();
    if (!clean) return '';
    if (SIMPLE_ICON_ALIASES[clean]) return SIMPLE_ICON_ALIASES[clean];
    return clean
      .replace(/\+/g, 'plus')
      .replace(/#/g, 'sharp')
      .replace(/\./g, 'dot')
      .replace(/[^a-z0-9]/g, '');
  }

  async function fetchIconPathBySlug(slug) {
    if (!slug) return null;
    if (remoteIconCache.has(slug)) return remoteIconCache.get(slug);
    try {
      const resp = await fetch(`${SIMPLE_ICONS_CDN}${encodeURIComponent(slug)}.svg`);
      if (!resp.ok) {
        remoteIconCache.set(slug, null);
        return null;
      }
      const svgText = await resp.text();
      const match = svgText.match(/<path[^>]*\bd="([^"]+)"/i);
      const pathD = match ? match[1] : null;
      remoteIconCache.set(slug, pathD);
      return pathD;
    } catch {
      remoteIconCache.set(slug, null);
      return null;
    }
  }

  async function syncDynamicTechIcons(itemsCsv) {
    const rawItems = (itemsCsv || '').split(',').map(s => s.trim()).filter(Boolean);
    const items = rawItems.length ? rawItems : ['TypeScript', 'Python', 'React', 'Next.js', 'Node.js', 'Docker'];
    const slugs = [...new Set(items.map(toSimpleIconSlug).filter(Boolean))];
    const missing = slugs.filter(slug => !remoteIconCache.has(slug));

    if (missing.length > 0) {
      if (stackIconStatus) stackIconStatus.textContent = `Fetching ${missing.length} icon(s) from Simple Icons...`;
      await Promise.all(missing.map(fetchIconPathBySlug));
    }

    const resolvedCount = items.filter(item => Boolean(remoteIconCache.get(toSimpleIconSlug(item)))).length;
    if (stackIconStatus) {
      stackIconStatus.textContent = `${resolvedCount}/${items.length} official icons loaded`;
    }

    if (currentStudioTab === 'stack') {
      updateStudioPreview();
    }
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
  <g transform="translate(32, 28)">
    <rect width="44" height="44" rx="12" fill="${p.accentContainer}" stroke="${p.border}" stroke-width="1"/>
    <text x="22" y="29" text-anchor="middle" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="20" font-weight="700" fill="${p.onAccentContainer}">${initial}</text>
  </g>
  <text x="90" y="47" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="16" font-weight="600" fill="${p.text}">${cleanName}</text>
  <circle cx="95" cy="64" r="4" fill="${p.mint}"/>
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
        syncDynamicTechIcons(stackItemsInput.value);
        updateStudioPreview();
      });
      stackQuickPicks.appendChild(btn);
    });
  }

  function getCardSvgByType(type, themeOverride) {
    const theme = themeOverride || currentStudioTheme;
    const username = (studioUsername ? studioUsername.value : '') || 'arhylsion';
    if (type === 'hero') {
      return buildHeroBannerSvg(
        heroNameInput ? heroNameInput.value : 'Arhylsion',
        heroStatusInput ? heroStatusInput.value : '',
        heroHeadline1Input ? heroHeadline1Input.value : '',
        heroHeadline2Input ? heroHeadline2Input.value : '',
        theme
      );
    }
    if (type === 'stack') {
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

  function getActiveCardSvg(themeOverride) {
    return getCardSvgByType(currentStudioTab, themeOverride);
  }

  function getAssetPrefixByType(type) {
    if (type === 'hero') return 'ghgraph-hero';
    if (type === 'stack') return 'ghgraph-stack';
    return 'ghgraph';
  }

  function getActiveAssetPrefix() {
    return getAssetPrefixByType(currentStudioTab);
  }

  function getSelectedKitTypes() {
    const types = [];
    if (!includeHeroCheck || includeHeroCheck.checked) types.push('hero');
    if (!includeHeatmapCheck || includeHeatmapCheck.checked) types.push('heatmap');
    if (!includeStackCheck || includeStackCheck.checked) types.push('stack');
    return types.length ? types : [currentStudioTab];
  }

  function buildPictureSnippet(user, prefix, altText) {
    return `<a href="${FIXED_SITE_URL}">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/${prefix}-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="assets/${prefix}-light.svg">
    <img alt="${altText}" src="assets/${prefix}-dark.svg" width="100%">
  </picture>
</a>`;
  }

  function buildKitMarkdown(user, types) {
    const u = (user || '').trim() || 'username';
    const blocks = types.map(type => {
      const prefix = getAssetPrefixByType(type);
      const alt = type === 'hero'
        ? `${u} — Profile Hero`
        : type === 'stack'
          ? `${u}'s Tech Stack`
          : `${u}'s Contribution Heatmap`;
      return buildPictureSnippet(u, prefix, alt);
    });
    return blocks.join('\n\n<br>\n\n');
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
        studioPreviewTag.textContent = 'Tech Stack Preview (Dynamic Simple Icons)';
      } else {
        studioPreviewTag.textContent = 'Animated Heatmap Preview';
      }
    }

    const embedTypes = currentEmbedScope === 'kit' ? getSelectedKitTypes() : [currentStudioTab];

    if (kitChecklistRow) {
      kitChecklistRow.toggleAttribute('hidden', currentEmbedScope !== 'kit');
    }

    if (readmeSnippetOutput) {
      readmeSnippetOutput.textContent = buildKitMarkdown(username, embedTypes);
    }

    if (requiredFilesHint) {
      const files = embedTypes.map(t => {
        const pfx = getAssetPrefixByType(t);
        return `<code>assets/${pfx}-{dark,light}.svg</code>`;
      });
      requiredFilesHint.innerHTML = `Required files in your repository: ${files.join(' · ')}`;
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

  function downloadSvgFile(svgCode, filename) {
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

  function triggerSvgDownload(theme) {
    downloadSvgFile(getActiveCardSvg(theme), `${getActiveAssetPrefix()}-${theme}.svg`);
  }

  async function triggerKitDownload() {
    if (stackItemsInput) {
      await syncDynamicTechIcons(stackItemsInput.value);
    }
    const types = getSelectedKitTypes();
    const queue = [];
    types.forEach(type => {
      const prefix = getAssetPrefixByType(type);
      queue.push({ svg: getCardSvgByType(type, 'dark'), name: `${prefix}-dark.svg` });
      queue.push({ svg: getCardSvgByType(type, 'light'), name: `${prefix}-light.svg` });
    });
    queue.forEach((item, idx) => {
      setTimeout(() => downloadSvgFile(item.svg, item.name), idx * 180);
    });
  }

  function openStudioModal() {
    if (profileStudioModal) {
      profileStudioModal.removeAttribute('hidden');
      updateStudioPreview();
      if (stackItemsInput) syncDynamicTechIcons(stackItemsInput.value);
    }
  }

  function closeStudioModal() {
    if (profileStudioModal) {
      profileStudioModal.setAttribute('hidden', '');
    }
  }

  function openWorkflowInfoModal() {
    if (workflowInfoModal) {
      workflowInfoModal.removeAttribute('hidden');
    }
  }

  function closeWorkflowInfoModal() {
    if (workflowInfoModal) {
      workflowInfoModal.setAttribute('hidden', '');
    }
  }

  function initProfileStudio() {
    if (openStudioBtn) openStudioBtn.addEventListener('click', openStudioModal);
    if (closeStudioBtn) closeStudioBtn.addEventListener('click', closeStudioModal);
    if (workflowInfoBtn) workflowInfoBtn.addEventListener('click', openWorkflowInfoModal);
    if (closeWorkflowInfoBtn) closeWorkflowInfoBtn.addEventListener('click', closeWorkflowInfoModal);
    if (ackWorkflowInfoBtn) ackWorkflowInfoBtn.addEventListener('click', closeWorkflowInfoModal);

    if (workflowInfoModal) {
      workflowInfoModal.addEventListener('click', (e) => {
        if (e.target === workflowInfoModal) closeWorkflowInfoModal();
      });
    }

    if (profileStudioModal) {
      profileStudioModal.addEventListener('click', (e) => {
        if (e.target === profileStudioModal) closeStudioModal();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (workflowInfoModal && !workflowInfoModal.hasAttribute('hidden')) {
        closeWorkflowInfoModal();
      } else if (profileStudioModal && !profileStudioModal.hasAttribute('hidden')) {
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
          if (currentStudioTab === 'stack' && stackItemsInput) {
            syncDynamicTechIcons(stackItemsInput.value);
          }
          updateStudioPreview();
        });
      });
    }

    if (embedScopePills) {
      const pills = embedScopePills.querySelectorAll('.studio-pill');
      pills.forEach(pill => {
        pill.addEventListener('click', () => {
          pills.forEach(p => {
            p.classList.remove('active');
            p.setAttribute('aria-selected', 'false');
          });
          pill.classList.add('active');
          pill.setAttribute('aria-selected', 'true');
          currentEmbedScope = pill.dataset.scope;
          updateStudioPreview();
        });
      });
    }

    [includeHeroCheck, includeHeatmapCheck, includeStackCheck].forEach(chk => {
      if (chk) chk.addEventListener('change', updateStudioPreview);
    });

    if (downloadKitBtn) {
      downloadKitBtn.addEventListener('click', triggerKitDownload);
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
        clearTimeout(iconFetchTimer);
        iconFetchTimer = setTimeout(() => {
          syncDynamicTechIcons(stackItemsInput.value);
        }, 320);
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
