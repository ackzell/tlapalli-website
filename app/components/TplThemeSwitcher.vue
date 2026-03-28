<script setup lang="ts">
  import { useThemeVariant } from '../composables/useThemeVariant';
  import { useResolvedColorMode } from '@/composables/useResolvedColorMode';

  const { setVariant } = useThemeVariant({ defaultVariant: 'obsidian' });
  const { resolvedMode } = useResolvedColorMode();
</script>

<template>
  <div v-if="resolvedMode === 'Dark'" class="flex justify-center gap-2">
    <button class="btn-tpl-obsidian" @click="setVariant('obsidian')">Obsidian</button>
    <button class="btn-tpl-gold" @click="setVariant('gold')">Gold</button>
    <button class="btn-tpl-turquoise" @click="setVariant('turquoise')">Turquoise</button>
    <button class="btn-tpl-quartz" @click="setVariant('quartz')">Quartz</button>
    <button class="btn-tpl-lapisLazuli" @click="setVariant('lapisLazuli')">lapisLazuli</button>
    <button class="btn-tpl-amethyst" @click="setVariant('amethyst')">Amethyst</button>
    <button class="btn-tpl-jade" @click="setVariant('jade')">Jade</button>
    <button class="btn-tpl-fireOpal" @click="setVariant('fireOpal')">Fire Opal</button>
  </div>

  <div v-if="resolvedMode === 'Light'" class="flex justify-center gap-2">
    <button class="btn-tpl-obsidian-light" @click="setVariant('obsidian')">Obsidian</button>
    <button class="btn-tpl-gold-light" @click="setVariant('gold')">Gold</button>
    <button class="btn-tpl-turquoise-light" @click="setVariant('turquoise')">Turquoise</button>
    <button class="btn-tpl-quartz-light" @click="setVariant('quartz')">Quartz</button>
    <button class="btn-tpl-lapisLazuli-light" @click="setVariant('lapisLazuli')">
      lapisLazuli
    </button>
    <button class="btn-tpl-amethyst-light" @click="setVariant('amethyst')">Amethyst</button>
    <button class="btn-tpl-jade-light" @click="setVariant('jade')">Jade</button>
    <button class="btn-tpl-fireOpal-light" @click="setVariant('fireOpal')">Fire Opal</button>
  </div>
</template>

<style scoped></style>
