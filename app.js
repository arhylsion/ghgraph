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
  const workTitleInput = document.getElementById('workTitleInput');
  const workSubtitleInput = document.getElementById('workSubtitleInput');
  const projEditingLabel = document.getElementById('projEditingLabel');
  const addProjectBtn = document.getElementById('addProjectBtn');
  const dupProjectBtn = document.getElementById('dupProjectBtn');
  const delProjectBtn = document.getElementById('delProjectBtn');
  const projNameInput = document.getElementById('projNameInput');
  const projCatInput = document.getElementById('projCatInput');
  const projDescInput = document.getElementById('projDescInput');
  const projUrlInput = document.getElementById('projUrlInput');
  const projYearInput = document.getElementById('projYearInput');
  const projWidthPills = document.getElementById('projWidthPills');
  const projIconInput = document.getElementById('projIconInput');
  const projIconFile = document.getElementById('projIconFile');
  const projIconUploadBtn = document.getElementById('projIconUploadBtn');
  const projIconClearBtn = document.getElementById('projIconClearBtn');
  const projIconStatus = document.getElementById('projIconStatus');
  const projIconPicker = document.getElementById('projIconPicker');
  const projImageInput = document.getElementById('projImageInput');
  const projImageFile = document.getElementById('projImageFile');
  const projImageUploadBtn = document.getElementById('projImageUploadBtn');
  const projImageClearBtn = document.getElementById('projImageClearBtn');
  const projectBentoCanvas = document.getElementById('projectBentoCanvas');
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
    { id: 'project', label: 'Project', desc: 'Drag-and-drop bento work canvas & icon picker' },
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

  const BUILTIN_PROJECT_ICONS = {
    sparkles: 'M12 2l2.1 5.9L20 10l-5.9 2.1L12 18l-2.1-5.9L4 10l5.9-2.1L12 2zm7 13l1.1 2.9L23 19l-2.9 1.1L19 23l-1.1-2.9L15 19l2.9-1.1L19 15z',
    terminal: 'M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zm4.3 4.3a1 1 0 0 0 0 1.4L9.6 13l-2.3 2.3a1 1 0 1 0 1.4 1.4l3-3a1 1 0 0 0 0-1.4l-3-3a1 1 0 0 0-1.4 0zM12 16a1 1 0 1 0 0 2h5a1 1 0 1 0 0-2h-5z',
    code: 'M8.7 16.7a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4l4-4a1 1 0 1 1 1.4 1.4L5.4 12l3.3 3.3a1 1 0 0 1 0 1.4zm6.6 0a1 1 0 0 1 0-1.4L18.6 12l-3.3-3.3a1 1 0 1 1 1.4-1.4l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-1.4 0zM13.9 5.3a1 1 0 0 1 .8 1.2l-3.4 12a1 1 0 1 1-1.9-.6l3.4-12a1 1 0 0 1 1.1-.6z',
    globe: FALLBACK_SOCIAL_ICONS.website,
    layers: 'M12 2L2 7l10 5 10-5-10-5zm0 12.6L4.2 10.7 2 11.8l10 5 10-5-2.2-1.1L12 14.6zm0 4.4l-7.8-3.9L2 16.2l10 5 10-5-2.2-1.1L12 19z',
    mobile: 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 3v13h10V5H7zm4 14.5a1 1 0 1 0 2 0 1 1 0 0 0-2 0z',
    desktop: 'M3 4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-6v2h3a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2h3v-2H5a2 2 0 0 1-2-2V4zm2 1v10h14V5H5z',
    cube: 'M12 2l9 5v10l-9 5-9-5V7l9-5zm0 2.3L5.6 7.8 12 11.4l6.4-3.6L12 4.3zM5 9.8v6.1l6 3.3v-6.1L5 9.8zm8 9.4l6-3.3V9.8l-6 3.3v6.1z',
    bolt: 'M13 2L4 14h7l-1 8 10-12h-7l0-8z',
    palette: 'M12 2a10 10 0 0 0 0 20c1.4 0 2.3-1 2.3-2.1 0-.6-.2-1.1-.6-1.5-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.3A4.5 4.5 0 0 0 22 10.6C22 5.8 17.5 2 12 2zM6.5 11.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z',
    database: 'M12 3C7 3 3 4.8 3 7v10c0 2.2 4 4 9 4s9-1.8 9-4V7c0-2.2-4-4-9-4zm0 2c4.1 0 7 1.3 7 2s-2.9 2-7 2-7-1.3-7-2 2.9-2 7-2zm-7 5.2c1.7 1.1 4.3 1.8 7 1.8s5.3-.7 7-1.8V12c0 .7-2.9 2-7 2s-7-1.3-7-2v-1.8zm0 5c1.7 1.1 4.3 1.8 7 1.8s5.3-.7 7-1.8V17c0 .7-2.9 2-7 2s-7-1.3-7-2v-1.8z',
    rocket: 'M14.5 2.3c3.3-.5 6.2.4 7.2 1.4 1 1 1.9 3.9 1.4 7.2-.6 3.5-2.8 6.4-5.4 8.3l-2.6-2.6-2.5 2.5-3.9-3.9 2.5-2.5-2.6-2.6c1.9-2.6 4.8-4.8 8.3-5.4zM16 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM4.5 15.5l4 4c-1.5 1.5-4.5 2.2-6 2.3.1-1.5.8-4.5 2-6.3z'
  };

  const QUICK_PICK_PROJECT_ICONS = [
    { slug: 'sparkles', label: 'Sparkles' },
    { slug: 'terminal', label: 'Terminal' },
    { slug: 'code', label: 'Code' },
    { slug: 'globe', label: 'Web' },
    { slug: 'layers', label: 'Layers' },
    { slug: 'mobile', label: 'Mobile' },
    { slug: 'desktop', label: 'Desktop' },
    { slug: 'cube', label: '3D' },
    { slug: 'bolt', label: 'Bolt' },
    { slug: 'palette', label: 'Design' },
    { slug: 'database', label: 'Data' },
    { slug: 'rocket', label: 'Rocket' },
    { slug: 'github', label: 'GitHub' },
    { slug: 'react', label: 'React' },
    { slug: 'nextdotjs', label: 'Next.js' },
    { slug: 'figma', label: 'Figma' },
    { slug: 'apple', label: 'macOS' },
    { slug: 'openai', label: 'AI' },
    { slug: 'vercel', label: 'Vercel' },
    { slug: 'rust', label: 'Rust' }
  ];

  const projectItems = [
    {
      id: 'proj-1',
      name: 'ghgraph',
      category: 'CLI & Profile README Studio',
      desc: 'Back-dated GitHub contribution graph painter and M3 Expressive profile kit generator.',
      year: '2026',
      url: 'https://arhylsion.github.io/ghgraph/',
      width: 'full',
      iconValue: 'github',
      iconDataUrl: '',
      coverValue: '',
      coverDataUrl: ''
    },
    {
      id: 'proj-2',
      name: 'Studio Workspace',
      category: 'Web App',
      desc: 'Realtime design system tokens & component previewer.',
      year: '2026',
      url: 'https://github.com/arhylsion',
      width: 'half',
      iconValue: 'sparkles',
      iconDataUrl: '',
      coverValue: '',
      coverDataUrl: ''
    },
    {
      id: 'proj-3',
      name: 'Dev Toolkit',
      category: 'Open Source',
      desc: 'Fast terminal utilities and developer automations.',
      year: '2026',
      url: 'https://github.com/arhylsion',
      width: 'half',
      iconValue: 'terminal',
      iconDataUrl: '',
      coverValue: '',
      coverDataUrl: ''
    }
  ];

  let selectedProjectId = projectItems[0].id;
  let nextProjectSeq = 4;
  let dragProjectId = null;

  let currentStudioTab = 'heatmap';
  let currentStudioTheme = 'dark';
  let currentStudioAnim = 'ripple';
  let currentStudioMode = 'action';
  let currentWorkflowScope = 'public';
  let currentEmbedScope = 'kit';
  let currentContactMode = 'card';
  let heroAvatarDataUrl = '';
  let fetchedState = null;
  let iconFetchTimer = null;
  let contactFetchTimer = null;
  let projIconFetchTimer = null;
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
    if (BUILTIN_PROJECT_ICONS[slug]) return BUILTIN_PROJECT_ICONS[slug];
    if (remoteIconCache.has(slug) && remoteIconCache.get(slug)) {
      return remoteIconCache.get(slug);
    }
    if (FALLBACK_SOCIAL_ICONS[slug]) return FALLBACK_SOCIAL_ICONS[slug];
    return null;
  }

  function isImageHref(val) {
    const v = String(val || '').trim();
    if (!v) return false;
    return /^(data:image\/|https?:\/\/)/i.test(v) || /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(v) || v.includes('/');
  }

  function getSelectedProject() {
    let found = projectItems.find(p => p.id === selectedProjectId);
    if (!found && projectItems.length) {
      found = projectItems[0];
      selectedProjectId = found.id;
    }
    return found;
  }

  function getProjectAssetSlug(proj, idx) {
    const base = `card-${slugifyName(proj ? proj.name : 'project')}`;
    let count = 0;
    for (let i = 0; i <= idx && i < projectItems.length; i++) {
      if (`card-${slugifyName(projectItems[i].name)}` === base) count++;
    }
    return count > 1 ? `${base}-${count}` : base;
  }

  function getProjectMonogram(name) {
    const words = String(name || '').trim().split(/[\s|/_-]+/).filter(Boolean);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    const clean = (name || '').trim();
    return clean ? clean.slice(0, 2).toUpperCase() : 'PR';
  }

  async function syncDynamicProjectIcons() {
    const slugs = new Set();
    QUICK_PICK_PROJECT_ICONS.forEach(item => {
      if (!BUILTIN_PROJECT_ICONS[item.slug]) slugs.add(item.slug);
    });
    projectItems.forEach(p => {
      const val = (p.iconValue || '').trim();
      if (val && !p.iconDataUrl && !isImageHref(val)) {
        const s = toSimpleIconSlug(val);
        if (s && !BUILTIN_PROJECT_ICONS[s] && !FALLBACK_SOCIAL_ICONS[s]) slugs.add(s);
      }
    });

    const missing = [...slugs].filter(s => !remoteIconCache.has(s));
    if (missing.length > 0) {
      if (projIconStatus) projIconStatus.textContent = `Loading ${missing.length} icon(s)...`;
      await Promise.all(missing.map(fetchIconPathBySlug));
    }

    updateProjectIconStatus();
    renderProjectIconPicker();
    if (currentStudioTab === 'project') {
      updateStudioPreview();
    }
  }

  function updateProjectIconStatus() {
    if (!projIconStatus) return;
    const proj = getSelectedProject();
    if (!proj) return;
    if (proj.iconDataUrl) {
      projIconStatus.textContent = 'Using uploaded custom logo';
      return;
    }
    const raw = (proj.iconValue || '').trim();
    if (!raw) {
      projIconStatus.textContent = `Using monogram (${getProjectMonogram(proj.name)})`;
      return;
    }
    if (isImageHref(raw)) {
      projIconStatus.textContent = `Using image path: ${raw}`;
      return;
    }
    const slug = toSimpleIconSlug(raw);
    if (BUILTIN_PROJECT_ICONS[slug]) {
      projIconStatus.textContent = `Built-in icon: ${slug}`;
    } else if (remoteIconCache.get(slug) || FALLBACK_SOCIAL_ICONS[slug]) {
      projIconStatus.textContent = `Simple Icons: ${slug}`;
    } else {
      projIconStatus.textContent = `Icon "${raw}" not found — showing monogram`;
    }
  }

  function renderProjectIconPicker() {
    if (!projIconPicker) return;
    const proj = getSelectedProject();
    const activeSlug = proj && !proj.iconDataUrl ? toSimpleIconSlug(proj.iconValue || '') : '';
    projIconPicker.innerHTML = '';

    QUICK_PICK_PROJECT_ICONS.forEach(item => {
      const pathD = BUILTIN_PROJECT_ICONS[item.slug] || remoteIconCache.get(item.slug) || '';
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'proj-icon-btn' + (activeSlug === item.slug ? ' active' : '');
      btn.dataset.icon = item.slug;
      const svgMarkup = pathD
        ? `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${pathD}"/></svg>`
        : '';
      btn.innerHTML = `${svgMarkup}<span>${item.label}</span>`;
      btn.addEventListener('click', () => {
        const cur = getSelectedProject();
        if (!cur) return;
        cur.iconValue = item.slug;
        cur.iconDataUrl = '';
        if (projIconInput) projIconInput.value = item.slug;
        if (projIconFile) projIconFile.value = '';
        updateProjectIconStatus();
        renderProjectIconPicker();
        updateStudioPreview();
      });
      projIconPicker.appendChild(btn);
    });
  }

  function syncProjectInspectorFromState() {
    const proj = getSelectedProject();
    if (!proj) return;
    const idx = projectItems.findIndex(p => p.id === proj.id);
    if (projEditingLabel) {
      projEditingLabel.textContent = `Editing: ${proj.name || 'Untitled'} (${idx + 1} of ${projectItems.length})`;
    }
    if (delProjectBtn) {
      delProjectBtn.disabled = projectItems.length <= 1;
    }
    if (projNameInput) projNameInput.value = proj.name;
    if (projCatInput) projCatInput.value = proj.category;
    if (projDescInput) projDescInput.value = proj.desc;
    if (projUrlInput) projUrlInput.value = proj.url;
    if (projYearInput) projYearInput.value = proj.year;
    if (projIconInput) projIconInput.value = proj.iconValue;
    if (projImageInput) projImageInput.value = proj.coverValue;
    if (projImageClearBtn) {
      projImageClearBtn.toggleAttribute('hidden', !(proj.coverDataUrl || (proj.coverValue || '').trim()));
    }
    if (projWidthPills) {
      const pills = projWidthPills.querySelectorAll('.studio-pill');
      pills.forEach(pill => {
        const isActive = pill.dataset.width === proj.width;
        pill.classList.toggle('active', isActive);
        pill.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    }
    updateProjectIconStatus();
    renderProjectIconPicker();
  }

  function addNewProject() {
    const num = nextProjectSeq++;
    const newProj = {
      id: `proj-${num}`,
      name: `Project ${num}`,
      category: 'Web App',
      desc: 'Built with clean architecture and thoughtful design.',
      year: String(new Date().getFullYear()),
      url: 'https://github.com/arhylsion',
      width: 'half',
      iconValue: 'rocket',
      iconDataUrl: '',
      coverValue: '',
      coverDataUrl: ''
    };
    projectItems.push(newProj);
    selectedProjectId = newProj.id;
    syncProjectInspectorFromState();
    updateStudioPreview();
  }

  function duplicateSelectedProject() {
    const cur = getSelectedProject();
    if (!cur) return;
    const idx = projectItems.findIndex(p => p.id === cur.id);
    const num = nextProjectSeq++;
    const copy = {
      ...cur,
      id: `proj-${num}`,
      name: `${cur.name} Copy`
    };
    projectItems.splice(idx + 1, 0, copy);
    selectedProjectId = copy.id;
    syncProjectInspectorFromState();
    updateStudioPreview();
  }

  function deleteProjectById(id) {
    if (projectItems.length <= 1) return;
    const idx = projectItems.findIndex(p => p.id === id);
    if (idx < 0) return;
    projectItems.splice(idx, 1);
    if (selectedProjectId === id) {
      const nextIdx = Math.min(idx, projectItems.length - 1);
      selectedProjectId = projectItems[nextIdx].id;
    }
    syncProjectInspectorFromState();
    updateStudioPreview();
  }

  function reorderProjects(fromId, toId) {
    if (!fromId || !toId || fromId === toId) return;
    const fromIdx = projectItems.findIndex(p => p.id === fromId);
    const toIdx = projectItems.findIndex(p => p.id === toId);
    if (fromIdx < 0 || toIdx < 0) return;
    const [moved] = projectItems.splice(fromIdx, 1);
    projectItems.splice(toIdx, 0, moved);
    syncProjectInspectorFromState();
    updateStudioPreview();
  }

  function moveProjectByOffset(id, delta) {
    const idx = projectItems.findIndex(p => p.id === id);
    const next = idx + delta;
    if (idx < 0 || next < 0 || next >= projectItems.length) return;
    const [moved] = projectItems.splice(idx, 1);
    projectItems.splice(next, 0, moved);
    syncProjectInspectorFromState();
    updateStudioPreview();
  }

  function toggleProjectWidth(id) {
    const target = projectItems.find(p => p.id === id);
    if (!target) return;
    target.width = target.width === 'full' ? 'half' : 'full';
    syncProjectInspectorFromState();
    updateStudioPreview();
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

  function buildProjectCardSvg(proj, theme) {
    const item = proj || getSelectedProject() || projectItems[0];
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

    const rawName = (item.name || '').trim() || 'Project';
    const cleanName = escapeXml(rawName);
    const cleanCat = escapeXml((item.category || '').trim() || 'Web App');
    const cleanYear = escapeXml((item.year || '').trim());
    const maxDescChars = isHalf ? 36 : 92;
    const rawDesc = (item.desc || '').trim() || 'Built with clean architecture and thoughtful design.';
    const trimmedDesc = rawDesc.length > maxDescChars ? rawDesc.slice(0, maxDescChars - 1).trim() + '\u2026' : rawDesc;
    const cleanDesc = escapeXml(trimmedDesc);
    const cleanImg = (item.coverDataUrl || item.coverValue || '').trim();
    const footerY = pad + previewH + 18;
    const arrowX = w - 52;

    const iconHref = item.iconDataUrl || (isImageHref(item.iconValue) ? item.iconValue.trim() : '');
    const iconPath = iconHref ? null : getIconPath(item.iconValue || '');
    const monogram = escapeXml(getProjectMonogram(rawName));

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

    const titleLine = isHalf
      ? `    <text x="50" y="16" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="14.5" font-weight="600" fill="${p.text}">${cleanName}</text>`
      : `    <text x="50" y="16" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="14.5">
      <tspan font-weight="600" fill="${p.text}">${cleanName}</tspan>
      <tspan dx="5" font-weight="400" fill="${p.textDim}">\u00b7 ${cleanCat}</tspan>
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

  function renderProjectBentoCanvas() {
    if (!projectBentoCanvas) return;
    const workTitle = workTitleInput ? workTitleInput.value : 'Selected work.';
    const workSub = workSubtitleInput ? workSubtitleInput.value : 'Products, client sites and open source.';

    projectBentoCanvas.innerHTML = '';

    const headerWrap = document.createElement('div');
    headerWrap.className = 'bento-header-preview';
    headerWrap.innerHTML = buildSectionHeaderSvg(workTitle, workSub, currentStudioTheme);
    projectBentoCanvas.appendChild(headerWrap);

    const gridWrap = document.createElement('div');
    gridWrap.className = 'bento-grid';

    projectItems.forEach((proj, idx) => {
      const tile = document.createElement('div');
      const isSelected = proj.id === selectedProjectId;
      tile.className = `bento-tile ${proj.width === 'full' ? 'span-full' : 'span-half'}${isSelected ? ' selected' : ''}`;
      tile.draggable = true;
      tile.dataset.projId = proj.id;

      const controls = document.createElement('div');
      controls.className = 'bento-tile-controls';

      const grip = document.createElement('span');
      grip.className = 'bento-drag-handle';
      grip.textContent = '\u22ee\u22ee';
      grip.title = 'Drag to reorder';
      controls.appendChild(grip);

      const spanBtn = document.createElement('button');
      spanBtn.type = 'button';
      spanBtn.className = 'bento-ctrl-btn';
      spanBtn.textContent = proj.width === 'full' ? '100%' : '49%';
      spanBtn.title = 'Toggle full (100%) or half (49%) card width';
      spanBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedProjectId = proj.id;
        toggleProjectWidth(proj.id);
      });
      controls.appendChild(spanBtn);

      const prevBtn = document.createElement('button');
      prevBtn.type = 'button';
      prevBtn.className = 'bento-ctrl-btn';
      prevBtn.textContent = '\u2190';
      prevBtn.title = 'Move earlier';
      prevBtn.disabled = idx === 0;
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedProjectId = proj.id;
        moveProjectByOffset(proj.id, -1);
      });
      controls.appendChild(prevBtn);

      const nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.className = 'bento-ctrl-btn';
      nextBtn.textContent = '\u2192';
      nextBtn.title = 'Move later';
      nextBtn.disabled = idx === projectItems.length - 1;
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedProjectId = proj.id;
        moveProjectByOffset(proj.id, 1);
      });
      controls.appendChild(nextBtn);

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'bento-ctrl-btn danger';
      removeBtn.textContent = '\u00d7';
      removeBtn.title = 'Remove project';
      removeBtn.disabled = projectItems.length <= 1;
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteProjectById(proj.id);
      });
      controls.appendChild(removeBtn);

      const svgHolder = document.createElement('div');
      svgHolder.className = 'bento-tile-svg';
      svgHolder.innerHTML = buildProjectCardSvg(proj, currentStudioTheme);

      tile.appendChild(controls);
      tile.appendChild(svgHolder);

      tile.addEventListener('click', () => {
        if (selectedProjectId !== proj.id) {
          selectedProjectId = proj.id;
          syncProjectInspectorFromState();
          updateStudioPreview();
        }
      });

      tile.addEventListener('dragstart', (e) => {
        dragProjectId = proj.id;
        tile.classList.add('dragging');
        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', proj.id);
        }
      });

      tile.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (dragProjectId && dragProjectId !== proj.id) {
          tile.classList.add('drag-over');
        }
      });

      tile.addEventListener('dragleave', () => {
        tile.classList.remove('drag-over');
      });

      tile.addEventListener('drop', (e) => {
        e.preventDefault();
        tile.classList.remove('drag-over');
        const sourceId = dragProjectId || (e.dataTransfer ? e.dataTransfer.getData('text/plain') : '');
        if (sourceId && sourceId !== proj.id) {
          reorderProjects(sourceId, proj.id);
        }
      });

      tile.addEventListener('dragend', () => {
        dragProjectId = null;
        tile.classList.remove('dragging');
        tile.classList.remove('drag-over');
      });

      gridWrap.appendChild(tile);
    });

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'bento-add-tile';
    addBtn.textContent = '+ Add Project Card to Bento Layout';
    addBtn.addEventListener('click', addNewProject);
    gridWrap.appendChild(addBtn);

    projectBentoCanvas.appendChild(gridWrap);
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
      return buildProjectCardSvg(getSelectedProject(), theme);
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
    if (type === 'project') {
      const sel = getSelectedProject();
      const idx = projectItems.findIndex(p => p.id === (sel ? sel.id : ''));
      return getProjectAssetSlug(sel, idx >= 0 ? idx : 0);
    }
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

  function buildProjectSectionMarkdown() {
    const title = (workTitleInput ? workTitleInput.value : 'Selected work.').trim() || 'Selected work.';
    const sub = (workSubtitleInput ? workSubtitleInput.value : 'Products, client sites and open source.').trim();
    const headerBlock = `<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/ghgraph-work-header-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/ghgraph-work-header-light.svg">
  <img src="assets/ghgraph-work-header-dark.svg" alt="${title} ${sub}" width="100%">
</picture>`;

    const cardLines = projectItems.map((proj, idx) => {
      const slug = getProjectAssetSlug(proj, idx);
      const href = (proj.url || '').trim() || FIXED_SITE_URL;
      const wAttr = proj.width === 'half' ? '49%' : '100%';
      const alt = `${(proj.name || 'Project').trim()}: ${(proj.desc || '').trim()}`;
      return `<a href="${href}"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/${slug}-dark.svg"><source media="(prefers-color-scheme: light)" srcset="assets/${slug}-light.svg"><img src="assets/${slug}-dark.svg" alt="${alt}" width="${wAttr}"></picture></a>`;
    }).join('\n');

    return `${headerBlock}\n\n${cardLines}`;
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
        return buildProjectSectionMarkdown();
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
    const isProjectTab = currentStudioTab === 'project';

    if (isProjectTab && projectBentoCanvas) {
      studioSvgPreview.setAttribute('hidden', '');
      projectBentoCanvas.removeAttribute('hidden');
      renderProjectBentoCanvas();
    } else {
      if (projectBentoCanvas) projectBentoCanvas.setAttribute('hidden', '');
      studioSvgPreview.removeAttribute('hidden');
      studioSvgPreview.innerHTML = getActiveCardSvg(currentStudioTheme);
    }

    if (studioPreviewTag) {
      const tagMap = {
        heatmap: 'Animated Heatmap Preview',
        hero: 'Hero Banner Preview (Static)',
        stack: 'Tech Stack Preview (Dynamic Simple Icons)',
        project: `Interactive Bento Canvas (${projectItems.length} ${projectItems.length === 1 ? 'Project' : 'Projects'} · Drag to Reorder)`,
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
        if (t === 'project') {
          files.push('<code>assets/ghgraph-work-header-{dark,light}.svg</code>');
          projectItems.forEach((proj, idx) => {
            files.push(`<code>assets/${getProjectAssetSlug(proj, idx)}-{dark,light}.svg</code>`);
          });
        } else if (t === 'contact' && currentContactMode === 'pills') {
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
    if (currentStudioTab === 'project') {
      const workTitle = workTitleInput ? workTitleInput.value : 'Selected work.';
      const workSub = workSubtitleInput ? workSubtitleInput.value : 'Products, client sites and open source.';
      const queue = [{ svg: buildSectionHeaderSvg(workTitle, workSub, theme), name: `ghgraph-work-header-${theme}.svg` }];
      projectItems.forEach((proj, idx) => {
        const slug = getProjectAssetSlug(proj, idx);
        queue.push({ svg: buildProjectCardSvg(proj, theme), name: `${slug}-${theme}.svg` });
      });
      queue.forEach((entry, idx) => {
        setTimeout(() => downloadSvgFile(entry.svg, entry.name), idx * 160);
      });
      return;
    }
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
    await syncDynamicProjectIcons();
    const types = getSelectedKitTypes();
    const queue = [];
    types.forEach(type => {
      if (type === 'project') {
        const workTitle = workTitleInput ? workTitleInput.value : 'Selected work.';
        const workSub = workSubtitleInput ? workSubtitleInput.value : 'Products, client sites and open source.';
        queue.push({ svg: buildSectionHeaderSvg(workTitle, workSub, 'dark'), name: 'ghgraph-work-header-dark.svg' });
        queue.push({ svg: buildSectionHeaderSvg(workTitle, workSub, 'light'), name: 'ghgraph-work-header-light.svg' });
        projectItems.forEach((proj, idx) => {
          const slug = getProjectAssetSlug(proj, idx);
          queue.push({ svg: buildProjectCardSvg(proj, 'dark'), name: `${slug}-dark.svg` });
          queue.push({ svg: buildProjectCardSvg(proj, 'light'), name: `${slug}-light.svg` });
        });
      } else if (type === 'contact' && currentContactMode === 'pills') {
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
    if (cardId === 'project') {
      syncProjectInspectorFromState();
      syncDynamicProjectIcons();
    }
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
      syncProjectInspectorFromState();
      updateStudioPreview();
      if (stackItemsInput) syncDynamicTechIcons(stackItemsInput.value);
      if (contactItemsInput) syncDynamicContactIcons(contactItemsInput.value);
      syncDynamicProjectIcons();
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

    if (addProjectBtn) addProjectBtn.addEventListener('click', addNewProject);
    if (dupProjectBtn) dupProjectBtn.addEventListener('click', duplicateSelectedProject);
    if (delProjectBtn) {
      delProjectBtn.addEventListener('click', () => {
        const cur = getSelectedProject();
        if (cur) deleteProjectById(cur.id);
      });
    }

    if (projNameInput) {
      projNameInput.addEventListener('input', () => {
        const cur = getSelectedProject();
        if (!cur) return;
        cur.name = projNameInput.value;
        const idx = projectItems.findIndex(p => p.id === cur.id);
        if (projEditingLabel) projEditingLabel.textContent = `Editing: ${cur.name || 'Untitled'} (${idx + 1} of ${projectItems.length})`;
        updateProjectIconStatus();
        updateStudioPreview();
      });
    }

    if (projCatInput) {
      projCatInput.addEventListener('input', () => {
        const cur = getSelectedProject();
        if (!cur) return;
        cur.category = projCatInput.value;
        updateStudioPreview();
      });
    }

    if (projDescInput) {
      projDescInput.addEventListener('input', () => {
        const cur = getSelectedProject();
        if (!cur) return;
        cur.desc = projDescInput.value;
        updateStudioPreview();
      });
    }

    if (projUrlInput) {
      projUrlInput.addEventListener('input', () => {
        const cur = getSelectedProject();
        if (!cur) return;
        cur.url = projUrlInput.value;
        updateStudioPreview();
      });
    }

    if (projYearInput) {
      projYearInput.addEventListener('input', () => {
        const cur = getSelectedProject();
        if (!cur) return;
        cur.year = projYearInput.value;
        updateStudioPreview();
      });
    }

    if (projIconUploadBtn && projIconFile) {
      projIconUploadBtn.addEventListener('click', () => projIconFile.click());
      projIconFile.addEventListener('change', () => {
        const f = projIconFile.files && projIconFile.files[0];
        const cur = getSelectedProject();
        if (!f || !cur) return;
        resizeImageFileToDataUrl(f, 96, 96, 'image/png', 0.92, (dataUrl) => {
          cur.iconDataUrl = dataUrl;
          cur.iconValue = f.name;
          if (projIconInput) projIconInput.value = f.name;
          updateProjectIconStatus();
          renderProjectIconPicker();
          updateStudioPreview();
        });
      });
    }

    if (projIconClearBtn) {
      projIconClearBtn.addEventListener('click', () => {
        const cur = getSelectedProject();
        if (!cur) return;
        cur.iconDataUrl = '';
        cur.iconValue = '';
        if (projIconInput) projIconInput.value = '';
        if (projIconFile) projIconFile.value = '';
        updateProjectIconStatus();
        renderProjectIconPicker();
        updateStudioPreview();
      });
    }

    if (projIconInput) {
      projIconInput.addEventListener('input', () => {
        const cur = getSelectedProject();
        if (!cur) return;
        cur.iconDataUrl = '';
        cur.iconValue = projIconInput.value;
        updateProjectIconStatus();
        renderProjectIconPicker();
        updateStudioPreview();
        clearTimeout(projIconFetchTimer);
        projIconFetchTimer = setTimeout(() => {
          syncDynamicProjectIcons();
        }, 320);
      });
    }

    if (projImageUploadBtn && projImageFile) {
      projImageUploadBtn.addEventListener('click', () => projImageFile.click());
      projImageFile.addEventListener('change', () => {
        const f = projImageFile.files && projImageFile.files[0];
        const cur = getSelectedProject();
        if (!f || !cur) return;
        resizeImageFileToDataUrl(f, 820, 420, 'image/jpeg', 0.85, (dataUrl) => {
          cur.coverDataUrl = dataUrl;
          cur.coverValue = f.name;
          if (projImageInput) projImageInput.value = f.name;
          if (projImageClearBtn) projImageClearBtn.removeAttribute('hidden');
          updateStudioPreview();
        });
      });
    }

    if (projImageClearBtn) {
      projImageClearBtn.addEventListener('click', () => {
        const cur = getSelectedProject();
        if (!cur) return;
        cur.coverDataUrl = '';
        cur.coverValue = '';
        if (projImageInput) projImageInput.value = '';
        if (projImageFile) projImageFile.value = '';
        projImageClearBtn.setAttribute('hidden', '');
        updateStudioPreview();
      });
    }

    if (projImageInput) {
      projImageInput.addEventListener('input', () => {
        const cur = getSelectedProject();
        if (!cur) return;
        cur.coverDataUrl = '';
        cur.coverValue = projImageInput.value;
        if (projImageClearBtn) projImageClearBtn.toggleAttribute('hidden', !projImageInput.value.trim());
        updateStudioPreview();
      });
    }

    if (projWidthPills) {
      const pills = projWidthPills.querySelectorAll('.studio-pill');
      pills.forEach(pill => {
        pill.addEventListener('click', () => {
          const cur = getSelectedProject();
          if (!cur) return;
          pills.forEach(p => {
            p.classList.remove('active');
            p.setAttribute('aria-selected', 'false');
          });
          pill.classList.add('active');
          pill.setAttribute('aria-selected', 'true');
          cur.width = pill.dataset.width;
          updateStudioPreview();
        });
      });
    }

    syncProjectInspectorFromState();

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
      workTitleInput, workSubtitleInput,
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
