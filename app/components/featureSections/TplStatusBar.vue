<script setup lang="ts">
  import TplVariantModeImageSwap from '@/components/shared/TplVariantModeImageSwap.vue';
</script>

<template>
  <section>
    <h2 data-scroll-reveal data-reveal-role="heading" data-reveal-style="crisp">Status Bar</h2>

    <p data-scroll-reveal data-reveal-role="paragraph" data-reveal-style="crisp">
      A minimalistic approach was taken to keep uniform both background and foreground (text) color
      across all elements in the status bar, so it feels integrated but it doesn't compete with the
      editor content.
    </p>
  </section>

  <div
    class="preview-shell"
    data-scroll-reveal
    data-reveal-role="image"
    data-reveal-style="float-up"
  >
    <TplVariantModeImageSwap
      image-section="statusBar"
      alt="Preview of status bar styling for the selected theme variant."
      densities="x1 x3"
    />
  </div>
</template>

<style scoped>
  .preview-shell {
    -webkit-mask-image: linear-gradient(to bottom, transparent 25%, black 80%);
    mask-image: linear-gradient(to bottom, transparent 25%, black 80%);
  }

  ::v-deep .preview-image {
    height: 6rem;
  }
</style>
