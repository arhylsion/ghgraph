import {
  WEEKS,
  DAYS,
  MONTH_SHORT,
  STUDIO_CARDS,
  DEV_QUOTES,
  QUICK_PICK_TECHS,
  QUICK_PICK_SOCIALS,
  QUICK_PICK_PROJECT_ICONS
} from '../constants.js';
import { downloadSvgFile, resizeImageFileToDataUrl } from '../utils.js';
import {
  BUILTIN_PROJECT_ICONS,
  FALLBACK_SOCIAL_ICONS,
  remoteIconCache,
  toSimpleIconSlug,
  fetchIconPathBySlug,
  getIconPath,
  isImageHref
} from '../icons.js';
import { getPaintedGrid } from '../painter.js';
import { buildProfileCardSvg } from '../svg/heatmap.js';
import { buildHeroBannerSvg } from '../svg/hero.js';
import { buildTechStackSvg } from '../svg/stack.js';
import { buildSectionHeaderSvg, buildProjectCardSvg, getProjectMonogram } from '../svg/project.js';
import { parseContactLines, buildSocialPillSvg, buildContactCardSvg } from '../svg/contact.js';
import { buildDevQuoteSvg } from '../svg/quote.js';
import {
  projectItems,
  studioState,
  getSelectedProject,
  getProjectAssetSlug,
  addNewProjectItem,
  duplicateSelectedProjectItem,
  deleteProjectItemById,
  reorderProjectItems,
  moveProjectItemByOffset,
  toggleProjectItemWidth
} from './state.js';
import { renderProjectIconSuggestMenu, renderProjectBentoCanvas } from './bento.js';
import { getAssetPrefixByType, buildKitMarkdown, buildWorkflowYaml } from './export.js';

export function initProfileStudio() {
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
  const stackSuggestWrap = document.getElementById('stackSuggestWrap');
  const stackItemsInput = document.getElementById('stackItemsInput');
  const stackSuggestMenu = document.getElementById('stackSuggestMenu');
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
  const projIconSuggestWrap = document.getElementById('projIconSuggestWrap');
  const projIconInput = document.getElementById('projIconInput');
  const projIconFile = document.getElementById('projIconFile');
  const projIconUploadBtn = document.getElementById('projIconUploadBtn');
  const projIconClearBtn = document.getElementById('projIconClearBtn');
  const projIconStatus = document.getElementById('projIconStatus');
  const projIconSuggestMenu = document.getElementById('projIconSuggestMenu');
  const projImageInput = document.getElementById('projImageInput');
  const projImageFile = document.getElementById('projImageFile');
  const projImageUploadBtn = document.getElementById('projImageUploadBtn');
  const projImageClearBtn = document.getElementById('projImageClearBtn');
  const projectBentoCanvas = document.getElementById('projectBentoCanvas');
  const contactTitleInput = document.getElementById('contactTitleInput');
  const contactSubtitleInput = document.getElementById('contactSubtitleInput');
  const contactModePills = document.getElementById('contactModePills');
  const contactSuggestWrap = document.getElementById('contactSuggestWrap');
  const contactItemsInput = document.getElementById('contactItemsInput');
  const contactSuggestMenu = document.getElementById('contactSuggestMenu');
  const contactIconStatus = document.getElementById('contactIconStatus');
  const quoteTextInput = document.getElementById('quoteTextInput');
  const quoteAuthorInput = document.getElementById('quoteAuthorInput');
  const quoteLabelInput = document.getElementById('quoteLabelInput');
  const shuffleQuoteBtn = document.getElementById('shuffleQuoteBtn');
  const studioPreviewTag = document.getElementById('studioPreviewTag');
  const studioSvgPreview = document.getElementById('studioSvgPreview');
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
  const workflowInfoModal = document.getElementById('workflowInfoModal');
  const staticNotePanel = document.getElementById('staticNotePanel');
  const downloadDarkSvgBtn = document.getElementById('downloadDarkSvgBtn');
  const downloadLightSvgBtn = document.getElementById('downloadLightSvgBtn');
  const copySvgRawBtn = document.getElementById('copySvgRawBtn');

  let iconFetchTimer = null;
  let contactFetchTimer = null;
  let projIconFetchTimer = null;

  async function syncDynamicTechIcons(itemsCsv) {
    const items = (itemsCsv || '').split(',').map(s => s.trim()).filter(Boolean);
    if (!items.length) {
      if (stackIconStatus) stackIconStatus.textContent = '';
      if (studioState.tab === 'stack') updateStudioPreview();
      return;
    }
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

    if (studioState.tab === 'stack') {
      updateStudioPreview();
    }
  }

  async function syncDynamicContactIcons(text) {
    const items = parseContactLines(text);
    if (!items.length) {
      if (contactIconStatus) contactIconStatus.textContent = '';
      if (studioState.tab === 'contact') updateStudioPreview();
      return;
    }
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

    if (studioState.tab === 'contact') {
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
      projIconStatus.textContent = `Icon "${raw}" not found \u2014 showing monogram`;
    }
  }

  function pickProjectIconSlug(slug) {
    const cur = getSelectedProject();
    if (!cur) return;
    cur.iconValue = slug;
    cur.iconDataUrl = '';
    if (projIconInput) projIconInput.value = slug;
    if (projIconFile) projIconFile.value = '';
    if (projIconSuggestMenu) projIconSuggestMenu.setAttribute('hidden', '');
    updateProjectIconStatus();
    updateStudioPreview();
  }

  function openProjIconSuggest(query) {
    if (!projIconSuggestMenu) return;
    const count = renderProjectIconSuggestMenu(projIconSuggestMenu, query, pickProjectIconSlug);
    if (count > 0) {
      projIconSuggestMenu.removeAttribute('hidden');
    } else {
      projIconSuggestMenu.setAttribute('hidden', '');
    }
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
    if (projIconSuggestMenu && !projIconSuggestMenu.hasAttribute('hidden') && projIconInput) {
      openProjIconSuggest(projIconInput.value);
    }
    if (studioState.tab === 'project') {
      updateStudioPreview();
    }
  }

  function syncProjectInspectorFromState() {
    const proj = getSelectedProject();
    if (!proj) return;
    const idx = projectItems.findIndex(p => p.id === proj.id);
    if (projEditingLabel) {
      const displayName = (proj.name || '').trim() || `Project ${idx + 1}`;
      projEditingLabel.textContent = `Editing: ${displayName} (${idx + 1} of ${projectItems.length})`;
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
  }

  function applyStackSuggestion(tech) {
    if (!stackItemsInput) return;
    const rawParts = stackItemsInput.value.split(',');
    rawParts[rawParts.length - 1] = tech;
    const cleanList = [];
    const seen = new Set();
    rawParts.map(s => s.trim()).filter(Boolean).forEach(item => {
      const key = item.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        cleanList.push(item);
      }
    });
    stackItemsInput.value = cleanList.join(', ') + ', ';
    if (stackSuggestMenu) stackSuggestMenu.setAttribute('hidden', '');
    syncDynamicTechIcons(stackItemsInput.value);
    updateStudioPreview();
  }

  function openStackSuggest() {
    if (!stackSuggestMenu || !stackItemsInput) return;
    const rawParts = stackItemsInput.value.split(',');
    const token = (rawParts[rawParts.length - 1] || '').trim().toLowerCase();
    const existing = new Set(rawParts.slice(0, -1).map(s => s.trim().toLowerCase()).filter(Boolean));
    const matches = QUICK_PICK_TECHS.filter(tech =>
      !existing.has(tech.toLowerCase()) && (!token || tech.toLowerCase().includes(token))
    ).slice(0, 8);

    stackSuggestMenu.innerHTML = '';
    if (!matches.length) {
      stackSuggestMenu.setAttribute('hidden', '');
      return;
    }

    matches.forEach(tech => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'studio-suggest-item';
      btn.dataset.value = tech;
      btn.innerHTML = `<span class="studio-suggest-left"><span>${tech}</span></span><span class="studio-suggest-meta">${toSimpleIconSlug(tech)}</span>`;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        applyStackSuggestion(tech);
      });
      stackSuggestMenu.appendChild(btn);
    });
    stackSuggestMenu.removeAttribute('hidden');
  }

  function applyContactSuggestion(social) {
    if (!contactItemsInput) return;
    const u = ((studioUsername ? studioUsername.value : '') || 'username').trim() || 'username';
    const formatted = `${social.name} | ${social.url.replace(/username/g, u)}`;
    const lines = contactItemsInput.value.split(/\r?\n/);
    if (!lines.length || lines[lines.length - 1].includes('|')) {
      lines.push(formatted);
    } else {
      lines[lines.length - 1] = formatted;
    }
    contactItemsInput.value = lines.filter((l, i) => l.trim() || i === lines.length - 1).join('\n');
    if (contactSuggestMenu) contactSuggestMenu.setAttribute('hidden', '');
    syncDynamicContactIcons(contactItemsInput.value);
    updateStudioPreview();
  }

  function openContactSuggest() {
    if (!contactSuggestMenu || !contactItemsInput) return;
    const lines = contactItemsInput.value.split(/\r?\n/);
    const currentLine = (lines[lines.length - 1] || '').trim();
    if (currentLine.includes('|')) {
      contactSuggestMenu.setAttribute('hidden', '');
      return;
    }
    const q = currentLine.toLowerCase();
    const existing = new Set(parseContactLines(contactItemsInput.value).map(i => i.name.toLowerCase()));
    const matches = QUICK_PICK_SOCIALS.filter(s =>
      !existing.has(s.name.toLowerCase()) && (!q || s.name.toLowerCase().includes(q))
    ).slice(0, 6);

    contactSuggestMenu.innerHTML = '';
    if (!matches.length) {
      contactSuggestMenu.setAttribute('hidden', '');
      return;
    }

    matches.forEach(s => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'studio-suggest-item';
      btn.dataset.value = s.name;
      btn.innerHTML = `<span class="studio-suggest-left"><span>${s.name}</span></span><span class="studio-suggest-meta">${s.url}</span>`;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        applyContactSuggestion(s);
      });
      contactSuggestMenu.appendChild(btn);
    });
    contactSuggestMenu.removeAttribute('hidden');
  }

  function getCardSvgByType(type, themeOverride) {
    const theme = themeOverride || studioState.theme;
    const username = (studioUsername ? studioUsername.value : '').trim() || 'username';
    if (type === 'hero') {
      const avatarHref = studioState.heroAvatarDataUrl || (heroAvatarInput ? heroAvatarInput.value : '');
      return buildHeroBannerSvg(
        heroNameInput ? heroNameInput.value : '',
        heroStatusInput ? heroStatusInput.value : '',
        heroHeadline1Input ? heroHeadline1Input.value : '',
        heroHeadline2Input ? heroHeadline2Input.value : '',
        avatarHref,
        theme
      );
    }
    if (type === 'stack') {
      return buildTechStackSvg(
        stackTitleInput ? stackTitleInput.value : '',
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
        contactTitleInput ? contactTitleInput.value : '',
        contactSubtitleInput ? contactSubtitleInput.value : '',
        contactItemsInput ? contactItemsInput.value : '',
        theme
      );
    }
    if (type === 'quote') {
      return buildDevQuoteSvg(
        quoteTextInput ? quoteTextInput.value : '',
        quoteAuthorInput ? quoteAuthorInput.value : '',
        quoteLabelInput ? quoteLabelInput.value : '',
        theme
      );
    }
    const showStats = studioStatsToggle ? studioStatsToggle.checked : true;
    return buildProfileCardSvg(username, theme, showStats, studioState.anim, getPaintedGrid(), studioState.fetchedState);
  }

  function getSelectedKitTypes() {
    const types = [];
    if (includeHeroCheck && includeHeroCheck.checked) types.push('hero');
    if (includeHeatmapCheck && includeHeatmapCheck.checked) types.push('heatmap');
    if (includeProjectCheck && includeProjectCheck.checked) types.push('project');
    if (includeStackCheck && includeStackCheck.checked) types.push('stack');
    if (includeQuoteCheck && includeQuoteCheck.checked) types.push('quote');
    if (includeContactCheck && includeContactCheck.checked) types.push('contact');
    return types.length ? types : [studioState.tab];
  }

  function updateStudioPreview() {
    if (!studioSvgPreview) return;
    const username = (studioUsername ? studioUsername.value : '').trim() || 'username';
    const showStats = studioStatsToggle ? studioStatsToggle.checked : true;
    const isProjectTab = studioState.tab === 'project';

    if (isProjectTab && projectBentoCanvas) {
      studioSvgPreview.setAttribute('hidden', '');
      projectBentoCanvas.removeAttribute('hidden');
      renderProjectBentoCanvas(projectBentoCanvas, {
        workTitle: workTitleInput ? workTitleInput.value : '',
        workSubtitle: workSubtitleInput ? workSubtitleInput.value : '',
        onSelect: (id) => {
          if (studioState.selectedProjectId !== id) {
            studioState.selectedProjectId = id;
            syncProjectInspectorFromState();
            updateStudioPreview();
          }
        },
        onToggleWidth: (id) => {
          studioState.selectedProjectId = id;
          toggleProjectItemWidth(id);
          syncProjectInspectorFromState();
          updateStudioPreview();
        },
        onMoveOffset: (id, delta) => {
          studioState.selectedProjectId = id;
          if (moveProjectItemByOffset(id, delta)) {
            syncProjectInspectorFromState();
            updateStudioPreview();
          }
        },
        onDelete: (id) => {
          if (deleteProjectItemById(id)) {
            syncProjectInspectorFromState();
            updateStudioPreview();
          }
        },
        onReorder: (fromId, toId) => {
          if (reorderProjectItems(fromId, toId)) {
            syncProjectInspectorFromState();
            updateStudioPreview();
          }
        },
        onAdd: () => {
          addNewProjectItem();
          syncProjectInspectorFromState();
          updateStudioPreview();
        }
      });
    } else {
      if (projectBentoCanvas) projectBentoCanvas.setAttribute('hidden', '');
      studioSvgPreview.removeAttribute('hidden');
      studioSvgPreview.innerHTML = getCardSvgByType(studioState.tab, studioState.theme);
    }

    if (studioPreviewTag) {
      const tagMap = {
        heatmap: 'Animated Heatmap Preview',
        hero: 'Hero Banner Preview (Static)',
        stack: 'Tech Stack Preview (Dynamic Simple Icons)',
        project: `Interactive Bento Canvas (${projectItems.length} ${projectItems.length === 1 ? 'Project' : 'Projects'} \u00b7 Drag to Reorder)`,
        contact: studioState.contactMode === 'pills' ? 'Contact Preview (Clickable Social Pills)' : 'Contact Card Preview (Unified SVG)',
        quote: 'Dev Quote Preview (M3 Expressive)'
      };
      studioPreviewTag.textContent = tagMap[studioState.tab] || 'Card Preview';
    }

    const embedTypes = studioState.embedScope === 'kit' ? getSelectedKitTypes() : [studioState.tab];

    if (kitChecklistRow) {
      kitChecklistRow.toggleAttribute('hidden', studioState.embedScope !== 'kit');
    }

    if (readmeSnippetOutput) {
      readmeSnippetOutput.textContent = buildKitMarkdown(username, embedTypes, {
        workTitle: workTitleInput ? workTitleInput.value : '',
        workSub: workSubtitleInput ? workSubtitleInput.value : '',
        contactMode: studioState.contactMode,
        contactTitle: contactTitleInput ? contactTitleInput.value : '',
        contactSub: contactSubtitleInput ? contactSubtitleInput.value : '',
        contactRawLines: contactItemsInput ? contactItemsInput.value : ''
      });
    }

    if (requiredFilesHint) {
      const files = [];
      embedTypes.forEach(t => {
        if (t === 'project') {
          files.push('<code>assets/ghgraph-work-header-{dark,light}.svg</code>');
          projectItems.forEach((proj, idx) => {
            files.push(`<code>assets/${getProjectAssetSlug(proj, idx)}-{dark,light}.svg</code>`);
          });
        } else if (t === 'contact' && studioState.contactMode === 'pills') {
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
      if (studioState.tab === 'heatmap' && studioState.mode === 'action') {
        workflowPanel.style.display = 'block';
        staticNotePanel.setAttribute('hidden', '');
      } else {
        workflowPanel.style.display = 'none';
        staticNotePanel.removeAttribute('hidden');
      }
    }

    if (studioScopeGroup) {
      studioScopeGroup.toggleAttribute('hidden', studioState.mode !== 'action');
    }

    if (workflowYamlOutput) {
      workflowYamlOutput.textContent = buildWorkflowYaml(studioState.anim, studioState.workflowScope, showStats);
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

      studioState.fetchedState = {
        username: rawUser,
        grid: newGrid,
        monthCols,
        totalCommits,
        activeDays
      };

      if (usePaintedBtn) usePaintedBtn.removeAttribute('hidden');
      if (fetchStatusText) {
        fetchStatusText.textContent = `Loaded @${rawUser}: ${totalCommits} contributions \u00b7 ${activeDays} active days`;
      }
      updateStudioPreview();
    } catch {
      if (fetchStatusText) {
        fetchStatusText.textContent = `Could not fetch @${rawUser} \u2014 showing painted canvas`;
      }
    } finally {
      fetchContribBtn.disabled = false;
      fetchContribBtn.textContent = 'Fetch';
    }
  }

  function triggerSvgDownload(theme) {
    if (studioState.tab === 'project') {
      const workTitle = workTitleInput ? workTitleInput.value : '';
      const workSub = workSubtitleInput ? workSubtitleInput.value : '';
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
    if (studioState.tab === 'contact' && studioState.contactMode === 'pills') {
      const title = contactTitleInput ? contactTitleInput.value : '';
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
    downloadSvgFile(getCardSvgByType(studioState.tab, theme), `${getAssetPrefixByType(studioState.tab)}-${theme}.svg`);
  }

  async function triggerKitDownload() {
    if (stackItemsInput) await syncDynamicTechIcons(stackItemsInput.value);
    if (contactItemsInput) await syncDynamicContactIcons(contactItemsInput.value);
    await syncDynamicProjectIcons();
    const types = getSelectedKitTypes();
    const queue = [];
    types.forEach(type => {
      if (type === 'project') {
        const workTitle = workTitleInput ? workTitleInput.value : '';
        const workSub = workSubtitleInput ? workSubtitleInput.value : '';
        queue.push({ svg: buildSectionHeaderSvg(workTitle, workSub, 'dark'), name: 'ghgraph-work-header-dark.svg' });
        queue.push({ svg: buildSectionHeaderSvg(workTitle, workSub, 'light'), name: 'ghgraph-work-header-light.svg' });
        projectItems.forEach((proj, idx) => {
          const slug = getProjectAssetSlug(proj, idx);
          queue.push({ svg: buildProjectCardSvg(proj, 'dark'), name: `${slug}-dark.svg` });
          queue.push({ svg: buildProjectCardSvg(proj, 'light'), name: `${slug}-light.svg` });
        });
      } else if (type === 'contact' && studioState.contactMode === 'pills') {
        const title = contactTitleInput ? contactTitleInput.value : '';
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

  function selectStudioCard(cardId) {
    studioState.tab = cardId;
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
      btn.className = 'studio-search-option' + (card.id === studioState.tab ? ' active' : '');
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
    if (modal) modal.removeAttribute('hidden');
  }

  function closeWorkflowInfoModal(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const modal = document.getElementById('workflowInfoModal');
    if (modal) modal.setAttribute('hidden', '');
  }

  function wirePillGroup(container, dataKey, onSelect) {
    if (!container) return;
    const pills = container.querySelectorAll('.studio-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => {
          p.classList.remove('active');
          p.setAttribute('aria-selected', 'false');
        });
        pill.classList.add('active');
        pill.setAttribute('aria-selected', 'true');
        onSelect(pill.dataset[dataKey]);
        updateStudioPreview();
      });
    });
  }

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
    const openSearch = () => {
      renderStudioSearchMenu(studioCardSearch.value);
      studioSearchMenu.removeAttribute('hidden');
    };
    studioCardSearch.addEventListener('focus', openSearch);
    studioCardSearch.addEventListener('click', openSearch);
    studioCardSearch.addEventListener('input', openSearch);
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

  wirePillGroup(embedScopePills, 'scope', (val) => { studioState.embedScope = val; });
  wirePillGroup(studioThemePills, 'theme', (val) => { studioState.theme = val; });
  wirePillGroup(studioAnimPills, 'anim', (val) => { studioState.anim = val; });
  wirePillGroup(studioModePills, 'mode', (val) => { studioState.mode = val; });
  wirePillGroup(studioScopePills, 'scope', (val) => { studioState.workflowScope = val; });
  wirePillGroup(contactModePills, 'cmode', (val) => { studioState.contactMode = val; });
  wirePillGroup(projWidthPills, 'width', (val) => {
    const cur = getSelectedProject();
    if (cur) cur.width = val;
  });

  [includeHeroCheck, includeHeatmapCheck, includeProjectCheck, includeStackCheck, includeQuoteCheck, includeContactCheck].forEach(chk => {
    if (chk) chk.addEventListener('change', updateStudioPreview);
  });

  if (downloadKitBtn) downloadKitBtn.addEventListener('click', triggerKitDownload);

  if (heroAvatarUploadBtn && heroAvatarFile) {
    heroAvatarUploadBtn.addEventListener('click', () => heroAvatarFile.click());
    heroAvatarFile.addEventListener('change', () => {
      const f = heroAvatarFile.files && heroAvatarFile.files[0];
      if (!f) return;
      resizeImageFileToDataUrl(f, 128, 128, 'image/png', 0.92, (dataUrl) => {
        studioState.heroAvatarDataUrl = dataUrl;
        if (heroAvatarInput) heroAvatarInput.value = f.name;
        if (heroAvatarClearBtn) heroAvatarClearBtn.removeAttribute('hidden');
        updateStudioPreview();
      });
    });
  }

  if (heroAvatarClearBtn) {
    heroAvatarClearBtn.addEventListener('click', () => {
      studioState.heroAvatarDataUrl = '';
      if (heroAvatarInput) heroAvatarInput.value = '';
      if (heroAvatarFile) heroAvatarFile.value = '';
      heroAvatarClearBtn.setAttribute('hidden', '');
      updateStudioPreview();
    });
  }

  if (heroAvatarInput) {
    heroAvatarInput.addEventListener('input', () => {
      studioState.heroAvatarDataUrl = '';
      if (heroAvatarClearBtn) heroAvatarClearBtn.toggleAttribute('hidden', !heroAvatarInput.value.trim());
      updateStudioPreview();
    });
  }

  if (addProjectBtn) {
    addProjectBtn.addEventListener('click', () => {
      addNewProjectItem();
      syncProjectInspectorFromState();
      updateStudioPreview();
    });
  }

  if (dupProjectBtn) {
    dupProjectBtn.addEventListener('click', () => {
      duplicateSelectedProjectItem();
      syncProjectInspectorFromState();
      updateStudioPreview();
    });
  }

  if (delProjectBtn) {
    delProjectBtn.addEventListener('click', () => {
      const cur = getSelectedProject();
      if (cur && deleteProjectItemById(cur.id)) {
        syncProjectInspectorFromState();
        updateStudioPreview();
      }
    });
  }

  if (projNameInput) {
    projNameInput.addEventListener('input', () => {
      const cur = getSelectedProject();
      if (!cur) return;
      cur.name = projNameInput.value;
      const idx = projectItems.findIndex(p => p.id === cur.id);
      if (projEditingLabel) {
        const displayName = (cur.name || '').trim() || `Project ${idx + 1}`;
        projEditingLabel.textContent = `Editing: ${displayName} (${idx + 1} of ${projectItems.length})`;
      }
      updateProjectIconStatus();
      updateStudioPreview();
    });
  }

  const projectFieldBindings = [
    [projCatInput, 'category'],
    [projDescInput, 'desc'],
    [projUrlInput, 'url'],
    [projYearInput, 'year']
  ];
  projectFieldBindings.forEach(([el, key]) => {
    if (!el) return;
    el.addEventListener('input', () => {
      const cur = getSelectedProject();
      if (!cur) return;
      cur[key] = el.value;
      updateStudioPreview();
    });
  });

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
        if (projIconSuggestMenu) projIconSuggestMenu.setAttribute('hidden', '');
        updateProjectIconStatus();
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
      if (projIconSuggestMenu) projIconSuggestMenu.setAttribute('hidden', '');
      updateProjectIconStatus();
      updateStudioPreview();
    });
  }

  if (projIconInput) {
    const showIconSuggest = () => openProjIconSuggest(projIconInput.value);
    projIconInput.addEventListener('focus', showIconSuggest);
    projIconInput.addEventListener('click', showIconSuggest);
    projIconInput.addEventListener('input', () => {
      const cur = getSelectedProject();
      if (!cur) return;
      cur.iconDataUrl = '';
      cur.iconValue = projIconInput.value;
      updateProjectIconStatus();
      openProjIconSuggest(projIconInput.value);
      updateStudioPreview();
      clearTimeout(projIconFetchTimer);
      projIconFetchTimer = setTimeout(() => {
        syncDynamicProjectIcons();
      }, 320);
    });
    projIconInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && projIconSuggestMenu && !projIconSuggestMenu.hasAttribute('hidden')) {
        const first = projIconSuggestMenu.querySelector('.studio-suggest-item[data-icon]');
        if (first) {
          e.preventDefault();
          pickProjectIconSlug(first.dataset.icon);
        }
      } else if (e.key === 'Escape' && projIconSuggestMenu) {
        projIconSuggestMenu.setAttribute('hidden', '');
      }
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

  if (contactItemsInput) {
    contactItemsInput.addEventListener('focus', openContactSuggest);
    contactItemsInput.addEventListener('click', openContactSuggest);
    contactItemsInput.addEventListener('input', () => {
      openContactSuggest();
      updateStudioPreview();
      clearTimeout(contactFetchTimer);
      contactFetchTimer = setTimeout(() => {
        syncDynamicContactIcons(contactItemsInput.value);
      }, 320);
    });
    contactItemsInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && contactSuggestMenu) {
        contactSuggestMenu.setAttribute('hidden', '');
      }
    });
  }

  if (shuffleQuoteBtn) {
    shuffleQuoteBtn.addEventListener('click', () => {
      studioState.quoteIdx = (studioState.quoteIdx + 1) % DEV_QUOTES.length;
      const q = DEV_QUOTES[studioState.quoteIdx];
      if (quoteTextInput) quoteTextInput.value = q.text;
      if (quoteAuthorInput) quoteAuthorInput.value = q.author;
      updateStudioPreview();
    });
  }

  if (fetchContribBtn) fetchContribBtn.addEventListener('click', fetchUserContributions);

  if (usePaintedBtn) {
    usePaintedBtn.addEventListener('click', () => {
      studioState.fetchedState = null;
      usePaintedBtn.setAttribute('hidden', '');
      if (fetchStatusText) fetchStatusText.textContent = 'Using painted canvas';
      updateStudioPreview();
    });
  }

  if (studioUsername) {
    studioUsername.addEventListener('input', updateStudioPreview);
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
    stackItemsInput.addEventListener('focus', openStackSuggest);
    stackItemsInput.addEventListener('click', openStackSuggest);
    stackItemsInput.addEventListener('input', () => {
      openStackSuggest();
      updateStudioPreview();
      clearTimeout(iconFetchTimer);
      iconFetchTimer = setTimeout(() => {
        syncDynamicTechIcons(stackItemsInput.value);
      }, 320);
    });
    stackItemsInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && stackSuggestMenu && !stackSuggestMenu.hasAttribute('hidden')) {
        const first = stackSuggestMenu.querySelector('.studio-suggest-item[data-value]');
        if (first) {
          e.preventDefault();
          applyStackSuggestion(first.dataset.value);
        }
      } else if (e.key === 'Escape' && stackSuggestMenu) {
        stackSuggestMenu.setAttribute('hidden', '');
      }
    });
  }

  document.addEventListener('click', (e) => {
    if (stackSuggestMenu && stackSuggestWrap && !stackSuggestWrap.contains(e.target)) {
      stackSuggestMenu.setAttribute('hidden', '');
    }
    if (projIconSuggestMenu && projIconSuggestWrap && !projIconSuggestWrap.contains(e.target)) {
      projIconSuggestMenu.setAttribute('hidden', '');
    }
    if (contactSuggestMenu && contactSuggestWrap && !contactSuggestWrap.contains(e.target)) {
      contactSuggestMenu.setAttribute('hidden', '');
    }
  });

  if (studioStatsToggle) studioStatsToggle.addEventListener('change', updateStudioPreview);
  if (downloadDarkSvgBtn) downloadDarkSvgBtn.addEventListener('click', () => triggerSvgDownload('dark'));
  if (downloadLightSvgBtn) downloadLightSvgBtn.addEventListener('click', () => triggerSvgDownload('light'));

  if (copySvgRawBtn) {
    copySvgRawBtn.addEventListener('click', () => {
      const svgCode = getCardSvgByType(studioState.tab, studioState.theme);
      navigator.clipboard.writeText(svgCode).then(() => {
        const btnSpan = copySvgRawBtn.querySelector('span');
        if (btnSpan) {
          const old = btnSpan.textContent;
          btnSpan.textContent = 'Copied!';
          setTimeout(() => { btnSpan.textContent = old; }, 1800);
        }
      });
    });
  }

  syncProjectInspectorFromState();
  updateStudioPreview();

  return { updateStudioPreview };
}
