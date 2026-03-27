<script setup lang="ts">
  import TplVariantModeImageSwap from '@/components/shared/TplVariantModeImageSwap.vue';
</script>

<template>
  <div
    class="preview-shell"
    data-scroll-reveal
    data-reveal-role="image"
    data-reveal-direction="left"
    data-reveal-size="tall"
  >
    <TplVariantModeImageSwap
      image-section="extensions"
      alt="Preview of extensions panel styling for the selected theme variant."
      sizes="300px"
      densities="x1 x2"
    />
  </div>

  <section>
    <h2 data-scroll-reveal data-reveal-role="heading" data-reveal-style="lift-soft">Extensions</h2>

    <p data-scroll-reveal data-reveal-role="paragraph" data-reveal-style="lift-soft">
      A glimpse of the extensions panel, where you can see everything remains consistent and user
      friendly, without sacrificing legibility in either dark or light themes.
    </p>
  </section>
</template>

<style scoped>
  .preview-shell {
    width: min(15vw, 300px);
    min-width: 300px;
    aspect-ratio: 868 / 2170;
    flex: 0 0 auto;
    /* transform: perspective(1200px) rotateX(45deg) rotateY(18deg) rotate(-18deg); */
    transform-origin: center center;
    will-change: transform;

    -webkit-mask-image: linear-gradient(to right, transparent 2px, black 40%);
    mask-image: linear-gradient(to right, transparent 2px, black 40%);
  }
</style>
