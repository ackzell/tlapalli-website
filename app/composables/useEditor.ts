import { computed } from 'vue';

import type { EditorId, EditorTheme } from '~/models/editors';
import { editorList, editorRegistry } from '~/models/editors';

type UseEditorOptions = {
  defaultEditor?: EditorId;
  persist?: boolean;
  cookieKey?: string;
};

const SELECTED_EDITOR_STATE_KEY = 'selectedEditor';
const SELECTED_EDITOR_COOKIE_KEY = 'selected_editor';
const DEFAULT_EDITOR: EditorId = 'vscode';

const isEditorId = (value: unknown): value is EditorId =>
  typeof value === 'string' && value in editorRegistry;

export const useEditor = (options: UseEditorOptions = {}) => {
  const {
    defaultEditor = DEFAULT_EDITOR,
    persist = true,
    cookieKey = SELECTED_EDITOR_COOKIE_KEY,
  } = options;

  const cookie = persist ? useCookie<EditorId>(cookieKey, { sameSite: 'lax' }) : null;

  const editorId = useState<EditorId>(SELECTED_EDITOR_STATE_KEY, () => {
    const initial = cookie?.value ?? defaultEditor;
    return isEditorId(initial) ? initial : DEFAULT_EDITOR;
  });

  const setEditor = (nextEditor: EditorId) => {
    editorId.value = isEditorId(nextEditor) ? nextEditor : DEFAULT_EDITOR;
  };

  const editor = computed<EditorTheme>(() => editorRegistry[editorId.value]);
  const availableEditors = editorList;

  useHead(() => ({
    htmlAttrs: {
      'data-editor': editorId.value,
    },
  }));

  if (persist) {
    watch(
      editorId,
      (value) => {
        cookie!.value = value;
      },
      { immediate: true },
    );
  }

  return {
    editorId,
    editor,
    availableEditors,
    setEditor,
  };
};