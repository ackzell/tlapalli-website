<script setup lang="ts">
  import { computed } from 'vue';
  import { useWebHaptics } from 'web-haptics/vue';

  import { useEditor } from '@/composables/useEditor';
  import { useResolvedColorMode } from '@/composables/useResolvedColorMode';
  import { useThemeVariant } from '@/composables/useThemeVariant';

  const { trigger } = useWebHaptics();
  const { editorId, availableEditors, setEditor } = useEditor({ defaultEditor: 'vscode' });
  const { variant } = useThemeVariant({ defaultVariant: 'obsidian' });
  const { resolvedMode } = useResolvedColorMode();


  const groupClass = computed(() => {
    const mode = resolvedMode.value.toLowerCase();
    return `border-${variant.value}-${mode}-ui-border`;
  });


  const activeClass = computed(() => {
    const mode = resolvedMode.value.toLowerCase();
    return `text-${variant.value}-${mode}-ui-widgetBg bg-${variant.value}-${mode}-ui-foreground opacity-100`;
  });


  const idleClass = computed(() => {
    const mode = resolvedMode.value.toLowerCase();
    return `bg-${variant.value}-${mode}-ui-bg text-${variant.value}-${mode}-ui-foreground opacity-45 hover:opacity-100`;
  });
</script>

<template>
  <div
    role="group"
    aria-label="Choose which editor theme to explore"
    class="editor-switcher flex items-center gap-1 border-solid border-1 rounded-md p-1"
    :class="groupClass"
  >
    <button
      v-for="item in availableEditors"
      :key="item.id"
      type="button"
      class="editor-switcher-button cursor-pointer border-none rounded-sm px-2 py-0.5 text-sm font-mono"
      :class="editorId === item.id ? activeClass : idleClass"
      :aria-pressed="editorId === item.id"
      :aria-label="`Explore the ${item.label} theme`"
      :title="item.label"
      @click="
        trigger();
        setEditor(item.id);
      "
    >
      {{ item.label }}
    </button>
  </div>
</template>

<style scoped>
  .editor-switcher {
    background: transparent;
    pointer-events: initial;
  }

  .editor-switcher-button {
    transition:
      color 220ms ease,
      background-color 220ms ease,
      opacity 220ms ease,
      transform 220ms ease;
  }

  .editor-switcher-button:hover {
    transform: translateY(-0.5px);
  }
</style>
