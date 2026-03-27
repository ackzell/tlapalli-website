<script setup lang="ts">
  import TplVariantModeImageSwap from '@/components/shared/TplVariantModeImageSwap.vue';
</script>

<template>
  <section>
    <h2 data-scroll-reveal data-reveal-role="heading" data-reveal-style="lift-soft">AI Chat</h2>

    <p data-scroll-reveal data-reveal-role="paragraph" data-reveal-style="lift-soft">
      The AI chat panel inherits the color palette of the theme. It should be easy to interact with
      it and perform the usual actions like typing messages, clicking buttons, and reading
      responses, without any color related issues.
    </p>
  </section>

  <div
    class="preview-shell"
    data-scroll-reveal
    data-reveal-role="image"
    data-reveal-style="drift-left"
  >
    <TplVariantModeImageSwap
      image-section="aiChat"
      alt="Preview of AI chat styling for the selected theme variant."
      sizes="300px"
      densities="x1 x2"
    />
  </div>
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

    -webkit-mask-image: linear-gradient(to left, transparent 2px, black 40%);
    mask-image: linear-gradient(to left, transparent 2px, black 40%);
  }
</style>
