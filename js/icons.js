import { SIMPLE_ICONS_CDN } from './constants.js';

export const SIMPLE_ICON_ALIASES = {
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

export const FALLBACK_SOCIAL_ICONS = {
  luma: 'M12 2.2l2.6 6.2 6.2 2.6-6.2 2.6L12 19.8l-2.6-6.2-6.2-2.6 6.2-2.6L12 2.2z',
  email: 'M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11zm2.2-.5L12 11.2 18.8 6H5.2zm13.8 2.1l-6.4 4.9a1 1 0 0 1-1.2 0L5 8.1v9.4c0 .3.2.5.5.5h13c.3 0 .5-.2.5-.5V8.1z',
  website: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.9 9h-3.1a15.7 15.7 0 0 0-1.4-5.1A8 8 0 0 1 18.9 11zM12 4.1c1 1.4 1.8 3.9 2 6.9h-4c.2-3 1-5.5 2-6.9zM4.2 14a8.2 8.2 0 0 1 0-4h3.3a17 17 0 0 0 0 4H4.2zm.9 2h3.1a15.7 15.7 0 0 0 1.4 5.1A8 8 0 0 1 5.1 16zm3.1-8H5.1a8 8 0 0 1 4.5-5.1A15.7 15.7 0 0 0 8.2 8zm3.8 11.9c-1-1.4-1.8-3.9-2-6.9h4c-.2 3-1 5.5-2 6.9zm2.4-.8A15.7 15.7 0 0 0 15.8 14h3.1a8 8 0 0 1-4.5 5.1zM16.5 14a17 17 0 0 0 0-4h3.3a8.2 8.2 0 0 1 0 4h-3.3z'
};

export const BUILTIN_PROJECT_ICONS = {
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

export const remoteIconCache = new Map();

export function toSimpleIconSlug(name) {
  const clean = String(name || '').trim().toLowerCase();
  if (!clean) return '';
  if (SIMPLE_ICON_ALIASES[clean]) return SIMPLE_ICON_ALIASES[clean];
  return clean
    .replace(/\+/g, 'plus')
    .replace(/#/g, 'sharp')
    .replace(/\./g, 'dot')
    .replace(/[^a-z0-9]/g, '');
}

export async function fetchIconPathBySlug(slug) {
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

export function getIconPath(name) {
  const slug = toSimpleIconSlug(name);
  if (!slug) return null;
  if (BUILTIN_PROJECT_ICONS[slug]) return BUILTIN_PROJECT_ICONS[slug];
  if (remoteIconCache.has(slug) && remoteIconCache.get(slug)) {
    return remoteIconCache.get(slug);
  }
  if (FALLBACK_SOCIAL_ICONS[slug]) return FALLBACK_SOCIAL_ICONS[slug];
  return null;
}

export function isImageHref(val) {
  const v = String(val || '').trim();
  if (!v) return false;
  return /^(data:image\/|https?:\/\/)/i.test(v) || /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(v) || v.includes('/');
}
