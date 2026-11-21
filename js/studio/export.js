import { parseContactLines } from '../svg/contact.js';
import { projectItems, getSelectedProject, getProjectAssetSlug } from './state.js';

export function getAssetPrefixByType(type) {
  if (type === 'hero') return 'ghgraph-hero';
  if (type === 'stack') return 'ghgraph-stack';
  if (type === 'project') {
    const sel = getSelectedProject();
    const idx = projectItems.findIndex(p => p.id === (sel ? sel.id : ''));
    return getProjectAssetSlug(sel, idx >= 0 ? idx : 0);
  }
  if (type === 'contact') return 'ghgraph-contact';
  if (type === 'quote') return 'ghgraph-quote';
  if (type === 'waka') return 'ghgraph-waka';
  return 'ghgraph';
}

export function buildPictureSnippet(prefix, altText, hrefUrl, widthAttr) {
  const targetUrl = (hrefUrl || '').trim();
  const widthVal = widthAttr || '100%';
  const pic = `<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/${prefix}-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/${prefix}-light.svg">
  <img alt="${altText}" src="assets/${prefix}-dark.svg" width="${widthVal}">
</picture>`;
  if (!targetUrl) return pic;
  return `<a href="${targetUrl}">\n${pic.split('\n').map(l => `  ${l}`).join('\n')}\n</a>`;
}

export function buildProjectSectionMarkdown(workTitle, workSub) {
  const title = (workTitle || '').trim() || 'Selected work.';
  const sub = (workSub || '').trim();
  const altHeader = sub ? `${title} ${sub}` : title;
  const headerBlock = `<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/ghgraph-work-header-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/ghgraph-work-header-light.svg">
  <img src="assets/ghgraph-work-header-dark.svg" alt="${altHeader}" width="100%">
</picture>`;

  const cardLines = projectItems.map((proj, idx) => {
    const slug = getProjectAssetSlug(proj, idx);
    const href = (proj.url || '').trim();
    const wAttr = proj.width === 'half' ? '49%' : '100%';
    const pName = (proj.name || '').trim() || `Project ${idx + 1}`;
    const pDesc = (proj.desc || '').trim();
    const alt = pDesc ? `${pName}: ${pDesc}` : pName;
    const pic = `<picture><source media="(prefers-color-scheme: dark)" srcset="assets/${slug}-dark.svg"><source media="(prefers-color-scheme: light)" srcset="assets/${slug}-light.svg"><img src="assets/${slug}-dark.svg" alt="${alt}" width="${wAttr}"></picture>`;
    return href ? `<a href="${href}">${pic}</a>` : pic;
  }).join('\n');

  return `${headerBlock}\n\n${cardLines}`;
}

export function buildContactPillsMarkdown(contactTitle, contactSub, rawLines) {
  const title = (contactTitle || 'Say hi.').trim() || 'Say hi.';
  const sub = (contactSub || '').trim();
  const headerBlock = `<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/ghgraph-contact-header-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/ghgraph-contact-header-light.svg">
  <img src="assets/ghgraph-contact-header-dark.svg" alt="${title} ${sub}" width="100%">
</picture>`;
  const items = parseContactLines(rawLines);
  const pillLines = items.map(item => {
    const pic = `<picture><source media="(prefers-color-scheme: dark)" srcset="assets/s-${item.slug}-dark.svg"><img src="assets/s-${item.slug}-light.svg" alt="${item.name}" height="40"></picture>`;
    return item.url ? `<a href="${item.url}">${pic}</a>` : pic;
  }).join('\n');
  return pillLines ? `${headerBlock}\n\n${pillLines}` : headerBlock;
}

export function buildKitMarkdown(user, types, ctx) {
  const u = (user || '').trim() || 'username';
  const blocks = types.map(type => {
    const prefix = getAssetPrefixByType(type);
    if (type === 'hero') {
      return buildPictureSnippet(prefix, `${u} \u2014 Profile Hero`, '', '100%');
    }
    if (type === 'stack') {
      return buildPictureSnippet(prefix, `${u}'s Tech Stack`, '', '100%');
    }
    if (type === 'project') {
      return buildProjectSectionMarkdown(ctx.workTitle, ctx.workSub);
    }
    if (type === 'contact') {
      if (ctx.contactMode === 'pills') {
        return buildContactPillsMarkdown(ctx.contactTitle, ctx.contactSub, ctx.contactRawLines);
      }
      return buildPictureSnippet(prefix, `Contact ${u}`, '', '100%');
    }
    if (type === 'quote') {
      return buildPictureSnippet(prefix, 'Dev Quote', '', '100%');
    }
    if (type === 'waka') {
      return buildPictureSnippet(prefix, `${u}'s WakaTime Metrics`, '', '100%');
    }
    return buildPictureSnippet(prefix, `${u}'s Contribution Heatmap`, '', '100%');
  });
  return blocks.join('\n\n<br>\n\n');
}

export function buildWakaWorkflowYaml(range, limit, scale, style, showSummary, title, subtitle) {
  const safeRange = range || 'all_time';
  const safeLimit = Math.max(1, Math.min(10, Number(limit) || 5));
  const scaleFlag = scale === 'relative' ? ' --waka-scale relative' : ' --waka-scale percent';
  const styleVal = style === 'blocks' || style === 'braille' ? style : 'bar';
  const styleFlag = styleVal !== 'bar' ? ` --waka-style ${styleVal}` : '';
  const statsFlag = showSummary ? '' : ' --no-stats';
  const cleanTitle = (title || '').trim().replace(/"/g, '\\"');
  const cleanSub = (subtitle || '').trim().replace(/"/g, '\\"');
  const titleFlag = cleanTitle ? ` --waka-title "${cleanTitle}"` : '';
  const subFlag = cleanSub ? ` --waka-subtitle "${cleanSub}"` : '';

  return `name: Refresh WakaTime Metrics

on:
  schedule:
    - cron: '0 */2 * * *'
  workflow_dispatch:

permissions:
  contents: write

jobs:
  sync-waka:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Generate WakaTime Metrics Cards
        env:
          WAKATIME_API_KEY: \${{ secrets.WAKATIME_API_KEY }}
        run: |
          curl -sSL -O https://raw.githubusercontent.com/arhylsion/ghgraph/main/ghgraph.py
          python3 ghgraph.py --waka --waka-range ${safeRange} --waka-limit ${safeLimit}${scaleFlag}${styleFlag}${titleFlag}${subFlag} --theme both --output assets/${statsFlag}
          rm -f ghgraph.py

      - name: Commit and push changes
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add assets/
          git diff --staged --quiet || (git commit -m "chore: sync wakatime metrics cards" && git push)`;
}

export function buildWorkflowYaml(anim, workflowScope, showStats) {
  const statsFlag = showStats ? '' : ' --no-stats';
  const scopeFlag = workflowScope === 'private' ? ' --private' : ' --public';
  const tokenSecret = workflowScope === 'private' ? 'GH_PAT' : 'GITHUB_TOKEN';
  return `name: Refresh Profile Heatmap

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
          python3 ghgraph.py --card --username \${{ github.repository_owner }} --theme both --anim ${anim}${scopeFlag} --output assets/${statsFlag}
          rm -f ghgraph.py

      - name: Commit and push changes
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add assets/
          git diff --staged --quiet || (git commit -m "chore: sync profile contribution heatmap" && git push)`;
}
