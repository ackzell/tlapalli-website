<script setup lang="ts">
  import TplVariantModeImageSwap from '@/components/shared/TplVariantModeImageSwap.vue';
</script>

<template>
  <section max-w-md>
    <h2>Status Bar</h2>

    <p>
      A minimalistic approach to the status bar will enable you to focus on what matters most to
      you.
    </p>
  </section>

  <div class="preview-shell">
    <TplVariantModeImageSwap
      image-section="statusBar"
      alt="Preview of status bar styling for the selected theme variant."
      sizes="sm:70vw md:80vw"
      densities="x1 x3"
    />
  </div>
</template>

<style scoped>
  .preview-shell {
    max-width: 100%;
    min-width: 100%;
    aspect-ratio: 3456 / 241;
    flex: 1 1 100%;
    /* transform: perspective(1200px) rotateX(45deg) rotateY(18deg) rotate(-18deg); */
    transform-origin: center center;
    will-change: transform;

    -webkit-mask-image: linear-gradient(to bottom, transparent 5%, black 40%);
    mask-image: linear-gradient(to bottom, transparent 5%, black 40%);
  }
</style>
