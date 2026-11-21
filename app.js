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
  const studioSearchWrap = document.getElementById('studioSearchWrap');
  const studioCardSearch = document.getElementById('studioCardSearch');
  const studioActiveCardPill = document.getElementById('studioActiveCardPill');
  const studioSearchMenu = document.getElementById('studioSearchMenu');
  const studioThemePills = document.getElementById('studioThemePills');
  const tabHeatmapControls = document.getElementById('tabHeatmapControls');
  const tabHeroControls = document.getElementById('tabHeroControls');
  const tabStackControls = document.getElementById('tabStackControls');
  const tabProjectControls = document.getElementById('tabProjectControls');
  const tabContactControls = document.getElementById('tabContactControls');
  const tabQuoteControls = document.getElementById('tabQuoteControls');
  const studioUsername = document.getElementById('studioUsername');
  const fetchContribBtn = document.getElementById('fetchContribBtn');
  const usePaintedBtn = document.getElementById('usePaintedBtn');
  const fetchStatusText = document.getElementById('fetchStatusText');
  const studioAnimPills = document.getElementById('studioAnimPills');
  const studioModePills = document.getElementById('studioModePills');
  const studioScopeGroup = document.getElementById('studioScopeGroup');
  const studioScopePills = document.getElementById('studioScopePills');
  const studioStatsToggle = document.getElementById('studioStatsToggle');
  const heroNameInput = document.getElementById('heroNameInput');
  const heroStatusInput = document.getElementById('heroStatusInput');
  const heroHeadline1Input = document.getElementById('heroHeadline1Input');
  const heroHeadline2Input = document.getElementById('heroHeadline2Input');
  const heroAvatarInput = document.getElementById('heroAvatarInput');
  const heroAvatarFile = document.getElementById('heroAvatarFile');
  const heroAvatarUploadBtn = document.getElementById('heroAvatarUploadBtn');
  const heroAvatarClearBtn = document.getElementById('heroAvatarClearBtn');
  const stackTitleInput = document.getElementById('stackTitleInput');
  const stackSubtitleInput = document.getElementById('stackSubtitleInput');
  const stackItemsInput = document.getElementById('stackItemsInput');
  const stackQuickPicks = document.getElementById('stackQuickPicks');
  const stackIconStatus = document.getElementById('stackIconStatus');
  const projNameInput = document.getElementById('projNameInput');
  const projCatInput = document.getElementById('projCatInput');
  const projDescInput = document.getElementById('projDescInput');
  const projUrlInput = document.getElementById('projUrlInput');
  const projWidthPills = document.getElementById('projWidthPills');
  const projImageInput = document.getElementById('projImageInput');
  const projImageFile = document.getElementById('projImageFile');
  const projImageUploadBtn = document.getElementById('projImageUploadBtn');
  const projImageClearBtn = document.getElementById('projImageClearBtn');
  const downloadWorkHeaderBtn = document.getElementById('downloadWorkHeaderBtn');
  const contactTitleInput = document.getElementById('contactTitleInput');
  const contactSubtitleInput = document.getElementById('contactSubtitleInput');
  const contactModePills = document.getElementById('contactModePills');
  const contactItemsInput = document.getElementById('contactItemsInput');
  const contactQuickPicks = document.getElementById('contactQuickPicks');
  const contactIconStatus = document.getElementById('contactIconStatus');
  const quoteTextInput = document.getElementById('quoteTextInput');
  const quoteAuthorInput = document.getElementById('quoteAuthorInput');
  const quoteLabelInput = document.getElementById('quoteLabelInput');
  const shuffleQuoteBtn = document.getElementById('shuffleQuoteBtn');
  const studioPreviewTag = document.getElementById('studioPreviewTag');
  const studioSvgPreview = document.getElementById('studioSvgPreview');
  const snippetPanelTitle = document.getElementById('snippetPanelTitle');
  const snippetPanelDesc = document.getElementById('snippetPanelDesc');
  const embedScopePills = document.getElementById('embedScopePills');
  const kitChecklistRow = document.getElementById('kitChecklistRow');
  const includeHeroCheck = document.getElementById('includeHeroCheck');
  const includeHeatmapCheck = document.getElementById('includeHeatmapCheck');
  const includeProjectCheck = document.getElementById('includeProjectCheck');
  const includeStackCheck = document.getElementById('includeStackCheck');
  const includeQuoteCheck = document.getElementById('includeQuoteCheck');
  const includeContactCheck = document.getElementById('includeContactCheck');
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

  const STUDIO_CARDS = [
    { id: 'heatmap', label: 'Heatmap', desc: 'Animated 52-week contribution graph' },
    { id: 'hero', label: 'Hero Banner', desc: 'Editorial intro with avatar & headline' },
    { id: 'stack', label: 'Tech Stack', desc: 'Dynamic Simple Icons tool pills' },
    { id: 'project', label: 'Project', desc: 'Selected work showcase card (100% / 49%)' },
    { id: 'contact', label: 'Contact', desc: 'Social media links with Simple Icons' },
    { id: 'quote', label: 'Dev Quote', desc: 'M3 styled random or custom dev quote' }
  ];

  const DEV_QUOTES = [
    { text: 'Within a computer, natural language is unnatural.', author: 'Alan Perlis' },
    { text: 'Talk is cheap. Show me the code.', author: 'Linus Torvalds' },
    { text: 'Simplicity is prerequisite for reliability.', author: 'Edsger W. Dijkstra' },
    { text: 'Programs must be written for people to read, and only incidentally for machines to execute.', author: 'Harold Abelson' },
    { text: 'Make it work, make it right, make it fast.', author: 'Kent Beck' },
    { text: 'Premature optimization is the root of all evil.', author: 'Donald Knuth' },
    { text: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.', author: 'Martin Fowler' },
    { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
    { text: 'Code is like humor. When you have to explain it, it is bad.', author: 'Cory House' },
    { text: 'Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.', author: 'Antoine de Saint-Exupery' },
    { text: 'Controlling complexity is the essence of computer programming.', author: 'Brian Kernighan' },
    { text: 'The best error message is the one that never shows up.', author: 'Thomas Fuchs' }
  ];

  const FALLBACK_SOCIAL_ICONS = {
    luma: 'M12 2.2l2.6 6.2 6.2 2.6-6.2 2.6L12 19.8l-2.6-6.2-6.2-2.6 6.2-2.6L12 2.2z',
    email: 'M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11zm2.2-.5L12 11.2 18.8 6H5.2zm13.8 2.1l-6.4 4.9a1 1 0 0 1-1.2 0L5 8.1v9.4c0 .3.2.5.5.5h13c.3 0 .5-.2.5-.5V8.1z',
    website: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.9 9h-3.1a15.7 15.7 0 0 0-1.4-5.1A8 8 0 0 1 18.9 11zM12 4.1c1 1.4 1.8 3.9 2 6.9h-4c.2-3 1-5.5 2-6.9zM4.2 14a8.2 8.2 0 0 1 0-4h3.3a17 17 0 0 0 0 4H4.2zm.9 2h3.1a15.7 15.7 0 0 0 1.4 5.1A8 8 0 0 1 5.1 16zm3.1-8H5.1a8 8 0 0 1 4.5-5.1A15.7 15.7 0 0 0 8.2 8zm3.8 11.9c-1-1.4-1.8-3.9-2-6.9h4c-.2 3-1 5.5-2 6.9zm2.4-.8A15.7 15.7 0 0 0 15.8 14h3.1a8 8 0 0 1-4.5 5.1zM16.5 14a17 17 0 0 0 0-4h3.3a8.2 8.2 0 0 1 0 4h-3.3z'
  };

  const QUICK_PICK_SOCIALS = [
    { name: 'GitHub', url: 'https://github.com/username' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/username' },
    { name: 'X', url: 'https://x.com/username' },
    { name: 'Instagram', url: 'https://instagram.com/username' },
    { name: 'WhatsApp', url: 'https://wa.me/628123456789' },
    { name: 'Luma', url: 'https://lu.ma/username' },
    { name: 'Discord', url: 'https://discord.com/users/username' },
    { name: 'YouTube', url: 'https://youtube.com/@username' },
    { name: 'Telegram', url: 'https://t.me/username' },
    { name: 'Gmail', url: 'mailto:you@example.com' },
    { name: 'Bluesky', url: 'https://bsky.app/profile/username' },
    { name: 'Threads', url: 'https://threads.net/@username' }
  ];

  let currentStudioTab = 'heatmap';
  let currentStudioTheme = 'dark';
  let currentStudioAnim = 'ripple';
  let currentStudioMode = 'action';
  let currentWorkflowScope = 'public';
  let currentEmbedScope = 'kit';
  let currentProjWidth = 'full';
  let currentContactMode = 'card';
  let heroAvatarDataUrl = '';
  let projImageDataUrl = '';
  let fetchedState = null;
  let iconFetchTimer = null;
  let contactFetchTimer = null;
  let quoteIdx = 0;
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

  function getIconPath(name) {
    const slug = toSimpleIconSlug(name);
    if (!slug) return null;
    if (remoteIconCache.has(slug) && remoteIconCache.get(slug)) {
      return remoteIconCache.get(slug);
    }
    if (FALLBACK_SOCIAL_ICONS[slug]) return FALLBACK_SOCIAL_ICONS[slug];
    return null;
  }

  function slugifyName(str) {
    return String(str || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item';
  }

  function parseContactLines(text) {
    const lines = String(text || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const out = [];
    lines.forEach(line => {
      const parts = line.split('|');
      const name = (parts[0] || '').trim();
      const url = (parts[1] || '').trim() || FIXED_SITE_URL;
      if (name) out.push({ name, url, slug: slugifyName(name) });
    });
    return out.length ? out : [{ name: 'GitHub', url: 'https://github.com/arhylsion', slug: 'github' }];
  }

  async function syncDynamicContactIcons(text) {
    const items = parseContactLines(text);
    const slugs = [...new Set(items.map(i => toSimpleIconSlug(i.name)).filter(Boolean))];
    const missing = slugs.filter(slug => !remoteIconCache.has(slug) && !FALLBACK_SOCIAL_ICONS[slug]);

    if (missing.length > 0) {
      if (contactIconStatus) contactIconStatus.textContent = `Fetching ${missing.length} icon(s)...`;
      await Promise.all(missing.map(fetchIconPathBySlug));
    }

    const resolved = items.filter(i => Boolean(getIconPath(i.name))).length;
    if (contactIconStatus) {
      contactIconStatus.textContent = `${resolved}/${items.length} official icons loaded`;
    }

    if (currentStudioTab === 'contact') {
      updateStudioPreview();
    }
  }

  function buildHeroBannerSvg(name, status, headline1, headline2, avatarHref, theme) {
    const p = getThemePalette(theme);
    const cleanName = escapeXml((name || '').trim() || 'Developer');
    const initial = escapeXml(((name || '').trim()[0] || 'G').toUpperCase());
    const cleanStatus = escapeXml((status || '').trim() || 'Building open-source tools');
    const cleanH1 = escapeXml((headline1 || '').trim() || 'I build fast tools that do the work,');
    const cleanH2 = escapeXml((headline2 || '').trim() || 'and the interfaces they live in.');
    const cleanAvatar = (avatarHref || '').trim();
    const h = 236;

    const avatarDefs = cleanAvatar
      ? '    <clipPath id="gh-avatar-clip"><rect x="32" y="28" width="44" height="44" rx="12"/></clipPath>\n'
      : '';

    const avatarBlock = cleanAvatar
      ? `  <rect x="32" y="28" width="44" height="44" rx="12" fill="${p.accentContainer}"/>
  <image href="${escapeXml(cleanAvatar)}" x="32" y="28" width="44" height="44" clip-path="url(#gh-avatar-clip)" preserveAspectRatio="xMidYMid slice"/>
  <rect x="32" y="28" width="44" height="44" rx="12" fill="none" stroke="${p.border}" stroke-width="1"/>`
      : `  <g transform="translate(32, 28)">
    <rect width="44" height="44" rx="12" fill="${p.accentContainer}" stroke="${p.border}" stroke-width="1"/>
    <text x="22" y="29" text-anchor="middle" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="20" font-weight="700" fill="${p.onAccentContainer}">${initial}</text>
  </g>`;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 ${h}" width="820" height="${h}" fill="none">
  <defs>
    <clipPath id="gh-hero-clip"><rect width="820" height="${h}" rx="16"/></clipPath>
${avatarDefs}    <filter id="gh-hero-blur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="52"/></filter>
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
${avatarBlock}
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

  function buildSectionHeaderSvg(boldText, mutedText, theme) {
    const p = getThemePalette(theme);
    const cleanBold = escapeXml((boldText || '').trim() || 'Selected work.');
    const cleanMuted = escapeXml((mutedText || '').trim() || 'Products, client sites and open source.');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 52" width="820" height="52" fill="none">
  <text x="4" y="34" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="24" letter-spacing="-0.025em">
    <tspan font-weight="700" fill="${p.text}">${cleanBold}</tspan>
    <tspan dx="6" font-weight="400" fill="${p.textDim}">${cleanMuted}</tspan>
  </text>
</svg>`;
  }

  function buildProjectCardSvg(name, category, desc, imgHref, widthMode, theme) {
    const p = getThemePalette(theme);
    const isHalf = widthMode === 'half';
    const w = isHalf ? 400 : 820;
    const previewH = isHalf ? 186 : 286;
    const footerH = 82;
    const h = previewH + footerH + 16;
    const pad = 12;
    const innerW = w - pad * 2;
    const cleanName = escapeXml((name || '').trim() || 'Project');
    const initial = escapeXml(((name || '').trim()[0] || 'P').toUpperCase());
    const cleanCat = escapeXml((category || '').trim() || 'Web App');
    const maxDescChars = isHalf ? 44 : 92;
    const rawDesc = (desc || '').trim() || 'Built with clean architecture and thoughtful design.';
    const trimmedDesc = rawDesc.length > maxDescChars ? rawDesc.slice(0, maxDescChars - 1).trim() + '\u2026' : rawDesc;
    const cleanDesc = escapeXml(trimmedDesc);
    const cleanImg = (imgHref || '').trim();
    const footerY = pad + previewH + 18;
    const arrowX = w - 52;

    const coverContent = cleanImg
      ? `  <rect x="${pad}" y="${pad}" width="${innerW}" height="${previewH}" rx="12" fill="${p.surfaceAlt}"/>
  <image href="${escapeXml(cleanImg)}" x="${pad}" y="${pad}" width="${innerW}" height="${previewH}" clip-path="url(#gh-proj-clip)" preserveAspectRatio="xMidYMid slice"/>
  <rect x="${pad}" y="${pad}" width="${innerW}" height="${previewH}" rx="12" fill="none" stroke="${p.borderSubtle}" stroke-width="1"/>`
      : `  <rect x="${pad}" y="${pad}" width="${innerW}" height="${previewH}" rx="12" fill="${p.surfaceAlt}" stroke="${p.borderSubtle}" stroke-width="1"/>
  <g clip-path="url(#gh-proj-clip)" filter="url(#gh-proj-blur)">
    <ellipse cx="${Math.round(w * 0.25)}" cy="${Math.round(previewH * 0.35)}" rx="${Math.round(w * 0.28)}" ry="70" fill="${p.lilac}" opacity="${p.isDark ? '0.20' : '0.25'}"/>
    <ellipse cx="${Math.round(w * 0.78)}" cy="${Math.round(previewH * 0.75)}" rx="${Math.round(w * 0.24)}" ry="65" fill="${p.pink}" opacity="${p.isDark ? '0.18' : '0.22'}"/>
  </g>
  <rect x="${pad + 22}" y="${pad + 20}" width="${innerW - 44}" height="${previewH - 20}" rx="10" fill="${p.bg}" stroke="${p.border}" stroke-width="1"/>
  <circle cx="${pad + 38}" cy="${pad + 36}" r="4" fill="${p.pink}"/>
  <circle cx="${pad + 52}" cy="${pad + 36}" r="4" fill="${p.secondary}"/>
  <circle cx="${pad + 66}" cy="${pad + 36}" r="4" fill="${p.mint}"/>
  <text x="${Math.round(w / 2)}" y="${Math.round(pad + previewH * 0.56)}" text-anchor="middle" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="${isHalf ? 22 : 30}" font-weight="700" letter-spacing="-0.03em" fill="${p.text}">${cleanName}</text>
  <text x="${Math.round(w / 2)}" y="${Math.round(pad + previewH * 0.56 + 24)}" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="11.5" fill="${p.textDim}">${cleanCat}</text>`;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" fill="none">
  <defs>
    <clipPath id="gh-proj-clip"><rect x="${pad}" y="${pad}" width="${innerW}" height="${previewH}" rx="12"/></clipPath>
    <filter id="gh-proj-blur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="44"/></filter>
  </defs>
  <rect width="${w}" height="${h}" rx="16" fill="${p.bg}" stroke="${p.border}" stroke-width="1"/>
${coverContent}
  <g transform="translate(18, ${footerY})">
    <rect width="38" height="38" rx="10" fill="${p.surfaceHigh}" stroke="${p.border}" stroke-width="1"/>
    <text x="19" y="25" text-anchor="middle" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="17" font-weight="700" fill="${p.accent}">${initial}</text>
    <text x="50" y="16" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="14.5">
      <tspan font-weight="600" fill="${p.text}">${cleanName}</tspan>
      <tspan dx="5" font-weight="400" fill="${p.textDim}">\u00b7 ${cleanCat}</tspan>
    </text>
    <text x="50" y="34" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="12.5" font-weight="400" fill="${p.textDim}">${cleanDesc}</text>
  </g>
  <g transform="translate(${arrowX}, ${footerY + 2})">
    <circle cx="17" cy="17" r="17" fill="${p.surfaceAlt}" stroke="${p.border}" stroke-width="1"/>
    <path d="M13 21L21 13M21 13H15M21 13V19" stroke="${p.textMuted}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>`;
  }

  function buildSocialPillSvg(item, theme) {
    const p = getThemePalette(theme);
    const label = escapeXml(item.name);
    const pathD = getIconPath(item.name);
    const hasIcon = Boolean(pathD);
    const textWidth = Math.round(item.name.length * 7.8);
    const pillW = hasIcon ? Math.max(88, textWidth + 56) : Math.max(68, textWidth + 34);
    const pillH = 40;
    const iconGroup = hasIcon
      ? `<g transform="translate(15, 12) scale(0.667)"><path d="${pathD}" fill="${p.text}"/></g>`
      : '';
    const textX = hasIcon ? 38 : 17;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${pillW} ${pillH}" width="${pillW}" height="${pillH}" fill="none">
  <rect x="0.5" y="0.5" width="${pillW - 1}" height="${pillH - 1}" rx="20" fill="${p.surfaceAlt}" stroke="${p.border}" stroke-width="1"/>
  ${iconGroup}
  <text x="${textX}" y="24.5" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="13.5" font-weight="500" fill="${p.text}">${label}</text>
</svg>`;
  }

  function buildContactCardSvg(title, subtitle, rawLines, theme) {
    const p = getThemePalette(theme);
    const cleanTitle = escapeXml((title || '').trim() || 'Say hi.');
    const cleanSub = escapeXml((subtitle || '').trim() || "Tell me what's slowing you down.");
    const items = parseContactLines(rawLines);

    const padX = 32;
    const maxW = 820 - padX;
    const pillH = 38;
    const gapX = 10;
    const gapY = 12;
    let curX = padX;
    let curY = 76;
    let pillsSvg = '';

    items.forEach((item, idx) => {
      const label = escapeXml(item.name);
      const pathD = getIconPath(item.name);
      const hasIcon = Boolean(pathD);
      const textWidth = Math.round(item.name.length * 7.8);
      const pillW = hasIcon ? Math.max(88, textWidth + 54) : Math.max(68, textWidth + 32);

      if (curX + pillW > maxW && curX > padX) {
        curX = padX;
        curY += pillH + gapY;
      }

      const delay = (0.04 * idx).toFixed(3);
      const iconGroup = hasIcon
        ? `<g transform="translate(14, 11) scale(0.667)"><path d="${pathD}" fill="${p.text}"/></g>`
        : '';
      const textX = hasIcon ? 37 : 16;

      pillsSvg += `<a href="${escapeXml(item.url)}" target="_blank" rel="noopener noreferrer" class="gh-social-link">
    <g class="gh-pill-in" transform="translate(${curX}, ${curY})" style="animation-delay:${delay}s;">
      <rect width="${pillW}" height="${pillH}" rx="19" fill="${p.surfaceAlt}" stroke="${p.border}" stroke-width="1"/>
      ${iconGroup}
      <text x="${textX}" y="23.5" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="13" font-weight="500" fill="${p.text}">${label}</text>
    </g>
  </a>`;
      curX += pillW + gapX;
    });

    const h = curY + pillH + 30;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 ${h}" width="820" height="${h}" fill="none">
  <style>
    .gh-badge-link, .gh-social-link { cursor: pointer; text-decoration: none; }
    .gh-badge-link:hover rect, .gh-social-link:hover rect { opacity: 0.85; }
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

  function wrapQuoteLines(text, maxChars) {
    const words = String(text || '').trim().split(/\s+/).filter(Boolean);
    if (!words.length) return ['Simplicity is prerequisite for reliability.'];
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

  function buildDevQuoteSvg(quoteText, author, label, theme) {
    const p = getThemePalette(theme);
    const lines = wrapQuoteLines(quoteText || 'Within a computer, natural language is unnatural.', 58);
    const cleanAuthor = escapeXml((author || '').trim() || 'Alan Perlis');
    const cleanLabel = escapeXml((label || '').trim() || 'Random Dev Quote');
    const lineHeight = 32;
    const startY = 82;
    const authorY = startY + (lines.length - 1) * lineHeight + 42;
    const h = authorY + 32;

    const linesSvg = lines.map((line, i) => {
      const y = startY + i * lineHeight;
      const esc = escapeXml(line);
      const openQ = i === 0 ? `<tspan font-style="normal" font-weight="700" fill="${p.secondary}">\u201c</tspan>` : '';
      const closeQ = i === lines.length - 1 ? `<tspan font-style="normal" font-weight="700" fill="${p.secondary}">\u201d</tspan>` : '';
      return `  <text class="gh-q-in" x="34" y="${y}" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="22" font-weight="500" font-style="italic" letter-spacing="-0.015em" fill="${p.mint}" style="animation-delay:${(0.08 + i * 0.08).toFixed(2)}s;">${openQ}${esc}${closeQ}</text>`;
    }).join('\n');

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 ${h}" width="820" height="${h}" fill="none">
  <style>
    .gh-badge-link { cursor: pointer; text-decoration: none; }
    .gh-badge-link:hover rect { opacity: 0.85; }
    .gh-q-in { opacity: 0; animation: ghQuoteIn 0.5s cubic-bezier(0.2, 0, 0, 1) forwards; }
    @keyframes ghQuoteIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
  </style>
  <rect width="820" height="${h}" rx="16" fill="${p.bg}" stroke="${p.border}" stroke-width="1"/>
  <text x="34" y="36" font-family="'JetBrains Mono', monospace" font-size="11.5" font-weight="500" fill="${p.textDim}">${cleanLabel}</text>
  <a href="${FIXED_SITE_URL}" target="_blank" rel="noopener noreferrer" class="gh-badge-link">
    <g transform="translate(712, 20)">
      <rect width="76" height="24" rx="12" fill="${p.accentContainer}"/>
      <text x="38" y="16" text-anchor="middle" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="11.5" font-weight="600" fill="${p.onAccentContainer}">ghgraph</text>
    </g>
  </a>
${linesSvg}
  <text class="gh-q-in" x="786" y="${authorY}" text-anchor="end" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="16" font-weight="500" font-style="italic" fill="${p.pink}" style="animation-delay:0.26s;">\u2014 ${cleanAuthor}</text>
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

  function renderContactQuickPicks() {
    if (!contactQuickPicks || !contactItemsInput) return;
    const existing = new Set(parseContactLines(contactItemsInput.value).map(i => i.name.toLowerCase()));
    contactQuickPicks.innerHTML = '';
    QUICK_PICK_SOCIALS.forEach(s => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'stack-pick-chip' + (existing.has(s.name.toLowerCase()) ? ' active' : '');
      btn.textContent = s.name;
      btn.addEventListener('click', () => {
        const lines = contactItemsInput.value.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        const idx = lines.findIndex(l => (l.split('|')[0] || '').trim().toLowerCase() === s.name.toLowerCase());
        if (idx >= 0) {
          lines.splice(idx, 1);
        } else {
          const u = ((studioUsername ? studioUsername.value : '') || 'username').trim() || 'username';
          lines.push(`${s.name} | ${s.url.replace(/username/g, u)}`);
        }
        contactItemsInput.value = lines.join('\n');
        renderContactQuickPicks();
        syncDynamicContactIcons(contactItemsInput.value);
        updateStudioPreview();
      });
      contactQuickPicks.appendChild(btn);
    });
  }

  function getCardSvgByType(type, themeOverride) {
    const theme = themeOverride || currentStudioTheme;
    const username = (studioUsername ? studioUsername.value : '') || 'arhylsion';
    if (type === 'hero') {
      const avatarHref = heroAvatarDataUrl || (heroAvatarInput ? heroAvatarInput.value : '');
      return buildHeroBannerSvg(
        heroNameInput ? heroNameInput.value : 'Arhylsion',
        heroStatusInput ? heroStatusInput.value : '',
        heroHeadline1Input ? heroHeadline1Input.value : '',
        heroHeadline2Input ? heroHeadline2Input.value : '',
        avatarHref,
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
    if (type === 'project') {
      const imgHref = projImageDataUrl || (projImageInput ? projImageInput.value : '');
      return buildProjectCardSvg(
        projNameInput ? projNameInput.value : 'ghgraph',
        projCatInput ? projCatInput.value : '',
        projDescInput ? projDescInput.value : '',
        imgHref,
        currentProjWidth,
        theme
      );
    }
    if (type === 'contact') {
      return buildContactCardSvg(
        contactTitleInput ? contactTitleInput.value : 'Say hi.',
        contactSubtitleInput ? contactSubtitleInput.value : '',
        contactItemsInput ? contactItemsInput.value : '',
        theme
      );
    }
    if (type === 'quote') {
      return buildDevQuoteSvg(
        quoteTextInput ? quoteTextInput.value : '',
        quoteAuthorInput ? quoteAuthorInput.value : '',
        quoteLabelInput ? quoteLabelInput.value : 'Random Dev Quote',
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
    if (type === 'project') return `ghgraph-project-${slugifyName(projNameInput ? projNameInput.value : 'project')}`;
    if (type === 'contact') return 'ghgraph-contact';
    if (type === 'quote') return 'ghgraph-quote';
    return 'ghgraph';
  }

  function getActiveAssetPrefix() {
    return getAssetPrefixByType(currentStudioTab);
  }

  function getSelectedKitTypes() {
    const types = [];
    if (includeHeroCheck && includeHeroCheck.checked) types.push('hero');
    if (includeHeatmapCheck && includeHeatmapCheck.checked) types.push('heatmap');
    if (includeProjectCheck && includeProjectCheck.checked) types.push('project');
    if (includeStackCheck && includeStackCheck.checked) types.push('stack');
    if (includeQuoteCheck && includeQuoteCheck.checked) types.push('quote');
    if (includeContactCheck && includeContactCheck.checked) types.push('contact');
    return types.length ? types : [currentStudioTab];
  }

  function buildPictureSnippet(user, prefix, altText, hrefUrl, widthAttr) {
    const targetUrl = (hrefUrl || '').trim() || FIXED_SITE_URL;
    const widthVal = widthAttr || '100%';
    return `<a href="${targetUrl}">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/${prefix}-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="assets/${prefix}-light.svg">
    <img alt="${altText}" src="assets/${prefix}-dark.svg" width="${widthVal}">
  </picture>
</a>`;
  }

  function buildContactPillsMarkdown() {
    const title = (contactTitleInput ? contactTitleInput.value : 'Say hi.').trim() || 'Say hi.';
    const sub = (contactSubtitleInput ? contactSubtitleInput.value : '').trim();
    const headerBlock = `<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/ghgraph-contact-header-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/ghgraph-contact-header-light.svg">
  <img src="assets/ghgraph-contact-header-dark.svg" alt="${title} ${sub}" width="100%">
</picture>`;
    const items = parseContactLines(contactItemsInput ? contactItemsInput.value : '');
    const pillLines = items.map(item =>
      `<a href="${item.url}"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/s-${item.slug}-dark.svg"><img src="assets/s-${item.slug}-light.svg" alt="${item.name}" height="40"></picture></a>`
    ).join('\n');
    return `${headerBlock}\n\n${pillLines}`;
  }

  function buildKitMarkdown(user, types) {
    const u = (user || '').trim() || 'username';
    const blocks = types.map(type => {
      const prefix = getAssetPrefixByType(type);
      if (type === 'hero') {
        return buildPictureSnippet(u, prefix, `${u} \u2014 Profile Hero`, FIXED_SITE_URL, '100%');
      }
      if (type === 'stack') {
        return buildPictureSnippet(u, prefix, `${u}'s Tech Stack`, FIXED_SITE_URL, '100%');
      }
      if (type === 'project') {
        const pName = (projNameInput ? projNameInput.value : 'Project').trim() || 'Project';
        const pDesc = (projDescInput ? projDescInput.value : '').trim();
        const pUrl = (projUrlInput ? projUrlInput.value : FIXED_SITE_URL).trim() || FIXED_SITE_URL;
        const wAttr = currentProjWidth === 'half' ? '49%' : '100%';
        return buildPictureSnippet(u, prefix, `${pName}: ${pDesc}`, pUrl, wAttr);
      }
      if (type === 'contact') {
        if (currentContactMode === 'pills') {
          return buildContactPillsMarkdown();
        }
        return buildPictureSnippet(u, prefix, `Contact ${u}`, FIXED_SITE_URL, '100%');
      }
      if (type === 'quote') {
        return buildPictureSnippet(u, prefix, 'Random Dev Quote', FIXED_SITE_URL, '100%');
      }
      return buildPictureSnippet(u, prefix, `${u}'s Contribution Heatmap`, FIXED_SITE_URL, '100%');
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
      const tagMap = {
        heatmap: 'Animated Heatmap Preview',
        hero: 'Hero Banner Preview (Static)',
        stack: 'Tech Stack Preview (Dynamic Simple Icons)',
        project: currentProjWidth === 'half' ? 'Project Card Preview (49% Half Grid)' : 'Project Card Preview (100% Featured)',
        contact: currentContactMode === 'pills' ? 'Contact Preview (Clickable Social Pills)' : 'Contact Card Preview (Unified SVG)',
        quote: 'Dev Quote Preview (M3 Expressive)'
      };
      studioPreviewTag.textContent = tagMap[currentStudioTab] || 'Card Preview';
    }

    const embedTypes = currentEmbedScope === 'kit' ? getSelectedKitTypes() : [currentStudioTab];

    if (kitChecklistRow) {
      kitChecklistRow.toggleAttribute('hidden', currentEmbedScope !== 'kit');
    }

    if (readmeSnippetOutput) {
      readmeSnippetOutput.textContent = buildKitMarkdown(username, embedTypes);
    }

    if (requiredFilesHint) {
      const files = [];
      embedTypes.forEach(t => {
        if (t === 'contact' && currentContactMode === 'pills') {
          files.push('<code>assets/ghgraph-contact-header-{dark,light}.svg</code>');
          files.push('<code>assets/s-&lt;platform&gt;-{dark,light}.svg</code>');
        } else {
          const pfx = getAssetPrefixByType(t);
          files.push(`<code>assets/${pfx}-{dark,light}.svg</code>`);
        }
      });
      requiredFilesHint.innerHTML = `Required files in your repository: ${files.join(' \u00b7 ')}`;
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

    if (studioScopeGroup) {
      studioScopeGroup.toggleAttribute('hidden', currentStudioMode !== 'action');
    }

    if (workflowYamlOutput) {
      const statsFlag = showStats ? '' : ' --no-stats';
      const scopeFlag = currentWorkflowScope === 'private' ? ' --private' : ' --public';
      const tokenSecret = currentWorkflowScope === 'private' ? 'GH_PAT' : 'GITHUB_TOKEN';
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
          GITHUB_TOKEN: \${{ secrets.${tokenSecret} }}
        run: |
          curl -sSL -O https://raw.githubusercontent.com/arhylsion/ghgraph/main/ghgraph.py
          python3 ghgraph.py --card --username \${{ github.repository_owner }} --theme both --anim ${currentStudioAnim}${scopeFlag} --output assets/${statsFlag}
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
    if (currentStudioTab === 'contact' && currentContactMode === 'pills') {
      const title = contactTitleInput ? contactTitleInput.value : 'Say hi.';
      const sub = contactSubtitleInput ? contactSubtitleInput.value : '';
      const queue = [{ svg: buildSectionHeaderSvg(title, sub, theme), name: `ghgraph-contact-header-${theme}.svg` }];
      parseContactLines(contactItemsInput ? contactItemsInput.value : '').forEach(item => {
        queue.push({ svg: buildSocialPillSvg(item, theme), name: `s-${item.slug}-${theme}.svg` });
      });
      queue.forEach((entry, idx) => {
        setTimeout(() => downloadSvgFile(entry.svg, entry.name), idx * 160);
      });
      return;
    }
    downloadSvgFile(getActiveCardSvg(theme), `${getActiveAssetPrefix()}-${theme}.svg`);
  }

  async function triggerKitDownload() {
    if (stackItemsInput) await syncDynamicTechIcons(stackItemsInput.value);
    if (contactItemsInput) await syncDynamicContactIcons(contactItemsInput.value);
    const types = getSelectedKitTypes();
    const queue = [];
    types.forEach(type => {
      if (type === 'contact' && currentContactMode === 'pills') {
        const title = contactTitleInput ? contactTitleInput.value : 'Say hi.';
        const sub = contactSubtitleInput ? contactSubtitleInput.value : '';
        queue.push({ svg: buildSectionHeaderSvg(title, sub, 'dark'), name: 'ghgraph-contact-header-dark.svg' });
        queue.push({ svg: buildSectionHeaderSvg(title, sub, 'light'), name: 'ghgraph-contact-header-light.svg' });
        parseContactLines(contactItemsInput ? contactItemsInput.value : '').forEach(item => {
          queue.push({ svg: buildSocialPillSvg(item, 'dark'), name: `s-${item.slug}-dark.svg` });
          queue.push({ svg: buildSocialPillSvg(item, 'light'), name: `s-${item.slug}-light.svg` });
        });
      } else {
        const prefix = getAssetPrefixByType(type);
        queue.push({ svg: getCardSvgByType(type, 'dark'), name: `${prefix}-dark.svg` });
        queue.push({ svg: getCardSvgByType(type, 'light'), name: `${prefix}-light.svg` });
      }
    });
    queue.forEach((item, idx) => {
      setTimeout(() => downloadSvgFile(item.svg, item.name), idx * 170);
    });
  }

  function resizeImageFileToDataUrl(file, maxW, maxH, mime, quality, callback) {
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

  function selectStudioCard(cardId) {
    currentStudioTab = cardId;
    const cardMeta = STUDIO_CARDS.find(c => c.id === cardId) || STUDIO_CARDS[0];
    if (studioActiveCardPill) studioActiveCardPill.textContent = cardMeta.label;
    if (studioCardSearch) studioCardSearch.value = '';
    if (studioSearchMenu) studioSearchMenu.setAttribute('hidden', '');

    if (tabHeatmapControls) tabHeatmapControls.toggleAttribute('hidden', cardId !== 'heatmap');
    if (tabHeroControls) tabHeroControls.toggleAttribute('hidden', cardId !== 'hero');
    if (tabStackControls) tabStackControls.toggleAttribute('hidden', cardId !== 'stack');
    if (tabProjectControls) tabProjectControls.toggleAttribute('hidden', cardId !== 'project');
    if (tabContactControls) tabContactControls.toggleAttribute('hidden', cardId !== 'contact');
    if (tabQuoteControls) tabQuoteControls.toggleAttribute('hidden', cardId !== 'quote');

    if (cardId === 'stack' && stackItemsInput) syncDynamicTechIcons(stackItemsInput.value);
    if (cardId === 'contact' && contactItemsInput) syncDynamicContactIcons(contactItemsInput.value);
    updateStudioPreview();
  }

  function renderStudioSearchMenu(query) {
    if (!studioSearchMenu) return;
    const q = (query || '').trim().toLowerCase();
    const matches = STUDIO_CARDS.filter(c =>
      !q || c.label.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || c.id.includes(q)
    );
    studioSearchMenu.innerHTML = '';
    if (!matches.length) {
      const empty = document.createElement('div');
      empty.className = 'studio-search-option';
      empty.innerHTML = '<span class="search-opt-desc">No matching card found</span>';
      studioSearchMenu.appendChild(empty);
      return;
    }
    matches.forEach(card => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'studio-search-option' + (card.id === currentStudioTab ? ' active' : '');
      btn.dataset.card = card.id;
      btn.innerHTML = `<span class="search-opt-name">${card.label}</span><span class="search-opt-desc">${card.desc}</span>`;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        selectStudioCard(card.id);
      });
      studioSearchMenu.appendChild(btn);
    });
  }

  function openStudioModal() {
    if (profileStudioModal) {
      profileStudioModal.removeAttribute('hidden');
      updateStudioPreview();
      if (stackItemsInput) syncDynamicTechIcons(stackItemsInput.value);
      if (contactItemsInput) syncDynamicContactIcons(contactItemsInput.value);
    }
  }

  function closeStudioModal() {
    if (profileStudioModal) {
      profileStudioModal.setAttribute('hidden', '');
    }
  }

  function openWorkflowInfoModal(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const modal = document.getElementById('workflowInfoModal');
    if (modal) {
      modal.removeAttribute('hidden');
    }
  }

  function closeWorkflowInfoModal(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const modal = document.getElementById('workflowInfoModal');
    if (modal) {
      modal.setAttribute('hidden', '');
    }
  }

  function initProfileStudio() {
    if (openStudioBtn) openStudioBtn.addEventListener('click', openStudioModal);
    if (closeStudioBtn) closeStudioBtn.addEventListener('click', closeStudioModal);

    document.addEventListener('click', (e) => {
      if (e.target.closest && e.target.closest('#workflowInfoBtn')) {
        openWorkflowInfoModal(e);
        return;
      }
      if (e.target.closest && (e.target.closest('#closeWorkflowInfoBtn') || e.target.closest('#ackWorkflowInfoBtn'))) {
        closeWorkflowInfoModal(e);
        return;
      }
      if (workflowInfoModal && e.target === workflowInfoModal) {
        closeWorkflowInfoModal(e);
      }
    });

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

    if (studioCardSearch && studioSearchMenu) {
      studioCardSearch.addEventListener('focus', () => {
        renderStudioSearchMenu(studioCardSearch.value);
        studioSearchMenu.removeAttribute('hidden');
      });
      studioCardSearch.addEventListener('click', () => {
        renderStudioSearchMenu(studioCardSearch.value);
        studioSearchMenu.removeAttribute('hidden');
      });
      studioCardSearch.addEventListener('input', () => {
        renderStudioSearchMenu(studioCardSearch.value);
        studioSearchMenu.removeAttribute('hidden');
      });
      studioCardSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const first = studioSearchMenu.querySelector('.studio-search-option[data-card]');
          if (first) selectStudioCard(first.dataset.card);
        }
      });
      document.addEventListener('click', (e) => {
        if (studioSearchWrap && !studioSearchWrap.contains(e.target)) {
          studioSearchMenu.setAttribute('hidden', '');
        }
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

    [includeHeroCheck, includeHeatmapCheck, includeProjectCheck, includeStackCheck, includeQuoteCheck, includeContactCheck].forEach(chk => {
      if (chk) chk.addEventListener('change', updateStudioPreview);
    });

    if (downloadKitBtn) {
      downloadKitBtn.addEventListener('click', triggerKitDownload);
    }

    if (heroAvatarUploadBtn && heroAvatarFile) {
      heroAvatarUploadBtn.addEventListener('click', () => heroAvatarFile.click());
      heroAvatarFile.addEventListener('change', () => {
        const f = heroAvatarFile.files && heroAvatarFile.files[0];
        if (!f) return;
        resizeImageFileToDataUrl(f, 128, 128, 'image/png', 0.92, (dataUrl) => {
          heroAvatarDataUrl = dataUrl;
          if (heroAvatarInput) heroAvatarInput.value = f.name;
          if (heroAvatarClearBtn) heroAvatarClearBtn.removeAttribute('hidden');
          updateStudioPreview();
        });
      });
    }

    if (heroAvatarClearBtn) {
      heroAvatarClearBtn.addEventListener('click', () => {
        heroAvatarDataUrl = '';
        if (heroAvatarInput) heroAvatarInput.value = '';
        if (heroAvatarFile) heroAvatarFile.value = '';
        heroAvatarClearBtn.setAttribute('hidden', '');
        updateStudioPreview();
      });
    }

    if (heroAvatarInput) {
      heroAvatarInput.addEventListener('input', () => {
        heroAvatarDataUrl = '';
        if (heroAvatarClearBtn) heroAvatarClearBtn.toggleAttribute('hidden', !heroAvatarInput.value.trim());
        updateStudioPreview();
      });
    }

    if (projImageUploadBtn && projImageFile) {
      projImageUploadBtn.addEventListener('click', () => projImageFile.click());
      projImageFile.addEventListener('change', () => {
        const f = projImageFile.files && projImageFile.files[0];
        if (!f) return;
        resizeImageFileToDataUrl(f, 820, 420, 'image/jpeg', 0.85, (dataUrl) => {
          projImageDataUrl = dataUrl;
          if (projImageInput) projImageInput.value = f.name;
          if (projImageClearBtn) projImageClearBtn.removeAttribute('hidden');
          updateStudioPreview();
        });
      });
    }

    if (projImageClearBtn) {
      projImageClearBtn.addEventListener('click', () => {
        projImageDataUrl = '';
        if (projImageInput) projImageInput.value = '';
        if (projImageFile) projImageFile.value = '';
        projImageClearBtn.setAttribute('hidden', '');
        updateStudioPreview();
      });
    }

    if (projImageInput) {
      projImageInput.addEventListener('input', () => {
        projImageDataUrl = '';
        if (projImageClearBtn) projImageClearBtn.toggleAttribute('hidden', !projImageInput.value.trim());
        updateStudioPreview();
      });
    }

    if (downloadWorkHeaderBtn) {
      downloadWorkHeaderBtn.addEventListener('click', () => {
        downloadSvgFile(buildSectionHeaderSvg('Selected work.', 'Products, client sites and open source.', 'dark'), 'ghgraph-work-header-dark.svg');
        setTimeout(() => {
          downloadSvgFile(buildSectionHeaderSvg('Selected work.', 'Products, client sites and open source.', 'light'), 'ghgraph-work-header-light.svg');
        }, 180);
      });
    }

    if (projWidthPills) {
      const pills = projWidthPills.querySelectorAll('.studio-pill');
      pills.forEach(pill => {
        pill.addEventListener('click', () => {
          pills.forEach(p => {
            p.classList.remove('active');
            p.setAttribute('aria-selected', 'false');
          });
          pill.classList.add('active');
          pill.setAttribute('aria-selected', 'true');
          currentProjWidth = pill.dataset.width;
          updateStudioPreview();
        });
      });
    }

    if (contactModePills) {
      const pills = contactModePills.querySelectorAll('.studio-pill');
      pills.forEach(pill => {
        pill.addEventListener('click', () => {
          pills.forEach(p => {
            p.classList.remove('active');
            p.setAttribute('aria-selected', 'false');
          });
          pill.classList.add('active');
          pill.setAttribute('aria-selected', 'true');
          currentContactMode = pill.dataset.cmode;
          updateStudioPreview();
        });
      });
    }

    if (contactItemsInput) {
      contactItemsInput.addEventListener('input', () => {
        renderContactQuickPicks();
        updateStudioPreview();
        clearTimeout(contactFetchTimer);
        contactFetchTimer = setTimeout(() => {
          syncDynamicContactIcons(contactItemsInput.value);
        }, 320);
      });
    }

    if (shuffleQuoteBtn) {
      shuffleQuoteBtn.addEventListener('click', () => {
        quoteIdx = (quoteIdx + 1) % DEV_QUOTES.length;
        const q = DEV_QUOTES[quoteIdx];
        if (quoteTextInput) quoteTextInput.value = q.text;
        if (quoteAuthorInput) quoteAuthorInput.value = q.author;
        updateStudioPreview();
      });
    }

    renderContactQuickPicks();

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

    [
      heroNameInput, heroStatusInput, heroHeadline1Input, heroHeadline2Input,
      stackTitleInput, stackSubtitleInput,
      projNameInput, projCatInput, projDescInput, projUrlInput,
      contactTitleInput, contactSubtitleInput,
      quoteTextInput, quoteAuthorInput, quoteLabelInput
    ].forEach(el => {
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

    if (studioScopePills) {
      const pills = studioScopePills.querySelectorAll('.studio-pill');
      pills.forEach(pill => {
        pill.addEventListener('click', () => {
          pills.forEach(p => {
            p.classList.remove('active');
            p.setAttribute('aria-selected', 'false');
          });
          pill.classList.add('active');
          pill.setAttribute('aria-selected', 'true');
          currentWorkflowScope = pill.dataset.scope;
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
