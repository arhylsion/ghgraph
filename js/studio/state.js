import { slugifyName } from '../utils.js';

export const projectItems = [
  {
    id: 'proj-1',
    name: '',
    category: '',
    desc: '',
    year: '',
    url: '',
    width: 'full',
    iconValue: '',
    iconDataUrl: '',
    coverValue: '',
    coverDataUrl: ''
  }
];

export const studioState = {
  tab: 'heatmap',
  theme: 'dark',
  anim: 'ripple',
  mode: 'action',
  workflowScope: 'public',
  embedScope: 'kit',
  contactMode: 'card',
  heroAvatarDataUrl: '',
  fetchedState: null,
  selectedProjectId: projectItems[0].id,
  nextProjectSeq: 2,
  dragProjectId: null,
  quoteIdx: -1
};

export function getSelectedProject() {
  let found = projectItems.find(p => p.id === studioState.selectedProjectId);
  if (!found && projectItems.length) {
    found = projectItems[0];
    studioState.selectedProjectId = found.id;
  }
  return found;
}

export function getProjectAssetSlug(proj, idx) {
  const rawName = (proj && proj.name || '').trim();
  const base = rawName ? `card-${slugifyName(rawName)}` : `card-project-${idx + 1}`;
  let count = 0;
  for (let i = 0; i <= idx && i < projectItems.length; i++) {
    const otherName = (projectItems[i].name || '').trim();
    const otherBase = otherName ? `card-${slugifyName(otherName)}` : `card-project-${i + 1}`;
    if (otherBase === base) count++;
  }
  return count > 1 ? `${base}-${count}` : base;
}

export function addNewProjectItem() {
  const num = studioState.nextProjectSeq++;
  const newProj = {
    id: `proj-${num}`,
    name: '',
    category: '',
    desc: '',
    year: '',
    url: '',
    width: 'half',
    iconValue: '',
    iconDataUrl: '',
    coverValue: '',
    coverDataUrl: ''
  };
  projectItems.push(newProj);
  studioState.selectedProjectId = newProj.id;
  return newProj;
}

export function duplicateSelectedProjectItem() {
  const cur = getSelectedProject();
  if (!cur) return null;
  const idx = projectItems.findIndex(p => p.id === cur.id);
  const num = studioState.nextProjectSeq++;
  const copy = {
    ...cur,
    id: `proj-${num}`,
    name: cur.name ? `${cur.name} Copy` : ''
  };
  projectItems.splice(idx + 1, 0, copy);
  studioState.selectedProjectId = copy.id;
  return copy;
}

export function deleteProjectItemById(id) {
  if (projectItems.length <= 1) return false;
  const idx = projectItems.findIndex(p => p.id === id);
  if (idx < 0) return false;
  projectItems.splice(idx, 1);
  if (studioState.selectedProjectId === id) {
    const nextIdx = Math.min(idx, projectItems.length - 1);
    studioState.selectedProjectId = projectItems[nextIdx].id;
  }
  return true;
}

export function reorderProjectItems(fromId, toId) {
  if (!fromId || !toId || fromId === toId) return false;
  const fromIdx = projectItems.findIndex(p => p.id === fromId);
  const toIdx = projectItems.findIndex(p => p.id === toId);
  if (fromIdx < 0 || toIdx < 0) return false;
  const [moved] = projectItems.splice(fromIdx, 1);
  projectItems.splice(toIdx, 0, moved);
  return true;
}

export function moveProjectItemByOffset(id, delta) {
  const idx = projectItems.findIndex(p => p.id === id);
  const next = idx + delta;
  if (idx < 0 || next < 0 || next >= projectItems.length) return false;
  const [moved] = projectItems.splice(idx, 1);
  projectItems.splice(next, 0, moved);
  return true;
}

export function toggleProjectItemWidth(id) {
  const target = projectItems.find(p => p.id === id);
  if (!target) return false;
  target.width = target.width === 'full' ? 'half' : 'full';
  return true;
}
