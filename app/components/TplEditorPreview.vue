<script setup lang="ts">
  import TplVariantModeImageSwap from '@/components/shared/TplVariantModeImageSwap.vue';
</script>

<template>
  <TplVariantModeImageSwap
    class="editor-preview"
    image-section="variants"
    alt="Preview of the Tlapalli VSCode theme variant."
  >
    <template #image="{ src, alt }">
      <NuxtImg
        :src="src"
        :alt="alt"
        class="preview-image"
        sizes="sm:70vw md:80vw"
        densities="x1 x3"
      />
    </template>
  </TplVariantModeImageSwap>
</template>

<style scoped>
  .preview-image {
    display: block;
    width: 100%;
    max-width: 100%;
    height: auto;
  }
</style>
