import { wireCopyButtons } from './utils.js';
import { initTheme, initTosDrawer, initOsSwitcher, initRepoInfoPopover } from './theme.js';
import { initPainter } from './painter.js';
import { initProfileStudio } from './studio/studio.js';

initTheme();
initTosDrawer();
initOsSwitcher();
initRepoInfoPopover();

let studioApi = null;
initPainter(() => {
  if (studioApi) studioApi.updateStudioPreview();
});
studioApi = initProfileStudio();
wireCopyButtons();
