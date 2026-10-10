import { computed, onMounted } from 'vue';

import { editorList } from '~/models/editors';
import { themePalette, type LogoVariant } from '~/models/variants';

import {
  type VariantImageMode,
  type VariantImageSection,
  useVariantImage,
} from './useVariantImage';

import type { EditorId } from '~/models/editors';

// How many images we fetch at once. Kept low so the preload does not starve the
// images that are actually on screen during the intro.
const PRELOAD_CONCURRENCY = 6;

const LOADED_KEY = 'variantPreload:loadedUrls';
const STARTED_KEY = 'variantPreload:started';

let preloadStarted = false;

const VARIANTS = Object.keys(themePalette) as LogoVariant[];

function variantSections(editorId: EditorId): VariantImageSection[] {
  const sections: VariantImageSection[] = ['variants'];
  const editor = editorList.find((candidate) => candidate.id === editorId);
  if (editor) {
    sections.push(...editor.sections);
  }
  return sections;
}

export function useVariantPreload() {
  const { variantImageSrc } = useVariantImage();
  const { editorId } = useEditor({ defaultEditor: 'vscode' });
  const { resolvedMode } = useResolvedColorMode();

  const loadedUrls = useState<Record<string, true>>(LOADED_KEY, () => ({}));
  const started = useState<boolean>(STARTED_KEY, () => false);

  const mode = computed<VariantImageMode>(() =>
    resolvedMode.value === 'Dark' ? 'Dark' : 'Light',
  );

  const urlsFor = (editor: EditorId, imageMode: VariantImageMode) => {
    const urls: string[] = [];
    for (const section of variantSections(editor)) {
      for (const variant of VARIANTS) {
        urls.push(variantImageSrc(editor, section, variant, imageMode));
      }
    }
    return urls;
  };

  // The "active set" is what the current editor + color mode needs. Switching
  // variants is only gated on this, so it unlocks as fast as possible while the
  // rest of the variants/modes/editors keep warming in the background.
  const activeUrls = computed(() => urlsFor(editorId.value, mode.value));
  const total = computed(() => activeUrls.value.length);
  const loaded = computed(
    () => activeUrls.value.filter((url) => loadedUrls.value[url]).length,
  );
  const ready = computed(() => total.value > 0 && loaded.value >= total.value);
  const percent = computed(() =>
    total.value > 0 ? Math.min(100, Math.round((loaded.value / total.value) * 100)) : 0,
  );

  if (import.meta.client && !preloadStarted) {
    preloadStarted = true;

    onMounted(() => {
      if (started.value) {
        return;
      }
      started.value = true;

      const currentEditor = editorId.value;
      const currentMode: VariantImageMode = resolvedMode.value === 'Dark' ? 'Dark' : 'Light';
      const otherMode: VariantImageMode = currentMode === 'Dark' ? 'Light' : 'Dark';

      // Warm the active set first, then the other color mode, then other editors.
      const queue: string[] = [];
      const seen = new Set<string>();
      const enqueue = (urls: string[]) => {
        for (const url of urls) {
          if (seen.has(url)) {
            continue;
          }
          seen.add(url);
          queue.push(url);
        }
      };

      enqueue(urlsFor(currentEditor, currentMode));
      enqueue(urlsFor(currentEditor, otherMode));
      for (const editor of editorList) {
        if (editor.id === currentEditor) {
          continue;
        }
        enqueue(urlsFor(editor.id, currentMode));
        enqueue(urlsFor(editor.id, otherMode));
      }

      if (queue.length === 0) {
        return;
      }

      let cursor = 0;
      const loadNext = () => {
        if (cursor >= queue.length) {
          return;
        }
        const url = queue[cursor++];
        const image = new Image();
        const settle = () => {
          loadedUrls.value[url] = true;
          loadNext();
        };
        image.addEventListener('load', settle, { once: true });
        image.addEventListener('error', settle, { once: true });
        image.src = url;
      };

      for (let index = 0; index < PRELOAD_CONCURRENCY; index++) {
        loadNext();
      }
    });
  }

  return {
    loaded,
    total,
    started,
    ready,
    percent,
  };
}
