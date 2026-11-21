import { WEEKS, DAYS, LEVEL_COMMITS, START_DATE } from './constants.js';

const grid = Array.from({ length: WEEKS }, () => new Array(DAYS).fill(0));
let isMouseDown = false;
let isTouching = false;
let touchPaintLvl = 3;
let touchStartX = 0;
let touchStartY = 0;
let isHorizontalSwiping = false;
let onGridChangeCallback = null;

export function getPaintedGrid() {
  return grid;
}

export function getCellDate(col, row) {
  const d = new Date(START_DATE);
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
  }
  if (commits === 1) {
    return `1 contribution on ${dateFormatted}`;
  }
  return `${commits} contributions on ${dateFormatted}`;
}

export function initPainter(onGridChange) {
  onGridChangeCallback = onGridChange || null;
  const gridCanvas = document.getElementById('gridCanvas');
  const commandOutput = document.getElementById('commandOutput');
  const copyLiveCmdBtn = document.getElementById('copyLiveCmdBtn');
  const clearGridBtn = document.getElementById('clearGridBtn');
  const statsCounter = document.getElementById('statsCounter');

  function setCellLevel(c, r, lvl) {
    grid[c][r] = lvl;
    if (!gridCanvas) return;
    const cell = gridCanvas.children[c * DAYS + r];
    if (cell) {
      cell.dataset.level = lvl;
      cell.title = getTooltipText(c, r, lvl);
    }
  }

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
        statsCounter.textContent = `${totalCommits} contributions \u00b7 ${activeDays.length} active days`;
      }
    }

    if (typeof onGridChangeCallback === 'function') {
      onGridChangeCallback();
    }

    if (!commandOutput) return;

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

  function cycleCell(c, r) {
    const next = (grid[c][r] + 1) % 5;
    setCellLevel(c, r, next);
    updateCommand();
    return next;
  }

  function syncAllCellDoms() {
    if (!gridCanvas) return;
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

  if (gridCanvas) {
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
  }

  window.addEventListener('mouseup', () => {
    isMouseDown = false;
  });

  window.addEventListener('touchend', () => {
    isTouching = false;
    isHorizontalSwiping = false;
  });

  if (copyLiveCmdBtn && commandOutput) {
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
    clearGridBtn.title = 'Clear all cells';
    clearGridBtn.addEventListener('click', clearGrid);
  }

  updateCommand();
}
