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

  initTheme();
  SAMPLE_SEEDS.forEach(s => {
    if (s.col < WEEKS && s.row < DAYS) {
      grid[s.col][s.row] = s.lvl;
    }
  });
  initGrid();
  updateCommand();
  wireCopyButtons();
})();
