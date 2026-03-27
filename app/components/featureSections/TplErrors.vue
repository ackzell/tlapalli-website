<script setup lang="ts">
  import TplVariantModeImageSwap from '@/components/shared/TplVariantModeImageSwap.vue';
</script>

<template>
  <section>
    <h2 data-scroll-reveal data-reveal-role="heading" data-reveal-style="snap-up">Tamed Errors</h2>
    <p data-scroll-reveal data-reveal-role="paragraph" data-reveal-style="snap-up">
      Errors will still be visible, but the <em>squigly underlines</em> follow the same hue as the
      text for this theme*.
    </p>
    <p data-scroll-reveal data-reveal-role="paragraph" data-reveal-style="snap-up">
      If you pair the theme with the excellent
      <a
        href="https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens"
        class="text-accent hover:underline"
        target="_blank"
        rel="noopener"
        >Error Lens</a
      >
      extension, you will have more control on how you want your errors to yell at you.
    </p>

    <p data-scroll-reveal data-reveal-role="paragraph" data-reveal-style="snap-up" line-height-none>
      *<small
        >Except for the `fireOpal` themes, where error related UI elements are white for the dark
        version and dark gray for the light version.</small
      >
    </p>
  </section>

  <div
    class="errors-preview-shell"
    data-scroll-reveal
    data-reveal-role="image"
    data-reveal-direction="up"
  >
    <TplVariantModeImageSwap
      image-section="errors"
      alt="Preview of error styling for the selected theme variant."
      sizes="100vw sm:60vw md:70vw lg:50vw xl:720px"
    />
  </div>
</template>

<style scoped>
  em {
    text-decoration-line: underline;
    text-decoration-style: wavy;
  }

  .errors-preview-shell {
    -webkit-mask-image:
      linear-gradient(to top, transparent 5%, black 60%),
      linear-gradient(to right, transparent 0%, black 10%, black 93%, transparent 100%);
    -webkit-mask-composite: source-in; /* Safari uses different keyword */
    mask-image:
      linear-gradient(to top, transparent 5%, black 60%),
      linear-gradient(to right, transparent 0%, black 10%, black 93%, transparent 100%);
    mask-composite: intersect;
  }
</style>
