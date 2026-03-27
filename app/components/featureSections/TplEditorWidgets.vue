<script setup lang="ts">
  import TplVariantModeImageSwap from '@/components/shared/TplVariantModeImageSwap.vue';
</script>

<template>
  <section>
    <h2>Editor Widgets</h2>
    <p>
      Tooltips, popovers and other UI components called "editor widgets" have a slight contrast
      against the editor's background so it is easier to distinguish their contents from the code
      below them.
    </p>
  </section>

  <div class="preview-shell">
    <TplVariantModeImageSwap
      image-section="editorWidgets"
      alt="Preview of editor widgets styling for the selected theme variant."
      sizes="100vw sm:60vw md:70vw lg:50vw 2xl:720px"
      densities="x1 x2"
    />
  </div>
</template>

<style scoped>
  .preview-shell {
    -webkit-mask-image: linear-gradient(
      to bottom,
      transparent 0%,
      black 20%,
      black 80%,
      transparent 100%
    );
    mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
  }
</style>
