import { QUICK_PICK_PROJECT_ICONS } from '../constants.js';
import { BUILTIN_PROJECT_ICONS, remoteIconCache, toSimpleIconSlug } from '../icons.js';
import { buildSectionHeaderSvg, buildProjectCardSvg } from '../svg/project.js';
import { projectItems, studioState, getSelectedProject } from './state.js';

export function renderProjectIconSuggestMenu(container, query, onPick) {
  if (!container) return 0;
  const proj = getSelectedProject();
  const activeSlug = proj && !proj.iconDataUrl ? toSimpleIconSlug(proj.iconValue || '') : '';
  const q = String(query || '').trim().toLowerCase();
  const matches = QUICK_PICK_PROJECT_ICONS.filter(item =>
    !q || item.label.toLowerCase().includes(q) || item.slug.includes(q)
  );
  container.innerHTML = '';

  if (!matches.length) {
    container.setAttribute('hidden', '');
    return 0;
  }

  matches.forEach(item => {
    const pathD = BUILTIN_PROJECT_ICONS[item.slug] || remoteIconCache.get(item.slug) || '';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'studio-suggest-item' + (activeSlug === item.slug ? ' active' : '');
    btn.dataset.icon = item.slug;
    const svgMarkup = pathD
      ? `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${pathD}"/></svg>`
      : '';
    btn.innerHTML = `<span class="studio-suggest-left">${svgMarkup}<span>${item.label}</span></span><span class="studio-suggest-meta">${item.slug}</span>`;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      onPick(item.slug);
    });
    container.appendChild(btn);
  });

  return matches.length;
}

export function renderProjectBentoCanvas(container, options) {
  if (!container) return;
  const {
    workTitle,
    workSubtitle,
    onSelect,
    onToggleWidth,
    onMoveOffset,
    onDelete,
    onReorder,
    onAdd
  } = options;

  container.innerHTML = '';

  const headerWrap = document.createElement('div');
  headerWrap.className = 'bento-header-preview';
  headerWrap.innerHTML = buildSectionHeaderSvg(workTitle, workSubtitle, studioState.theme);
  container.appendChild(headerWrap);

  const gridWrap = document.createElement('div');
  gridWrap.className = 'bento-grid';

  projectItems.forEach((proj, idx) => {
    const tile = document.createElement('div');
    const isSelected = proj.id === studioState.selectedProjectId;
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
      onToggleWidth(proj.id);
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
      onMoveOffset(proj.id, -1);
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
      onMoveOffset(proj.id, 1);
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
      onDelete(proj.id);
    });
    controls.appendChild(removeBtn);

    const svgHolder = document.createElement('div');
    svgHolder.className = 'bento-tile-svg';
    svgHolder.innerHTML = buildProjectCardSvg(proj, studioState.theme);

    tile.appendChild(controls);
    tile.appendChild(svgHolder);

    tile.addEventListener('click', () => onSelect(proj.id));

    tile.addEventListener('dragstart', (e) => {
      studioState.dragProjectId = proj.id;
      tile.classList.add('dragging');
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', proj.id);
      }
    });

    tile.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (studioState.dragProjectId && studioState.dragProjectId !== proj.id) {
        tile.classList.add('drag-over');
      }
    });

    tile.addEventListener('dragleave', () => {
      tile.classList.remove('drag-over');
    });

    tile.addEventListener('drop', (e) => {
      e.preventDefault();
      tile.classList.remove('drag-over');
      const sourceId = studioState.dragProjectId || (e.dataTransfer ? e.dataTransfer.getData('text/plain') : '');
      if (sourceId && sourceId !== proj.id) {
        onReorder(sourceId, proj.id);
      }
    });

    tile.addEventListener('dragend', () => {
      studioState.dragProjectId = null;
      tile.classList.remove('dragging');
      tile.classList.remove('drag-over');
    });

    gridWrap.appendChild(tile);
  });

  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.className = 'bento-add-tile';
  addBtn.textContent = '+ Add Project Card to Bento Layout';
  addBtn.addEventListener('click', onAdd);
  gridWrap.appendChild(addBtn);

  container.appendChild(gridWrap);
}
