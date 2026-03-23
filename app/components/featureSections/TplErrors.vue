<script setup lang="ts">
import TplVariantModeImageSwap from '@/components/shared/TplVariantModeImageSwap.vue'
</script>

        
<template>

      <section max-w-md>
        <h2>Errors shouldn't stress you out</h2>
        <p>
          Errors will still be visible, but the <em>squigly underlines</em> follow the same hue as the text for this theme*.
        </p>
        <p>
          If you pair the theme with the excellent <a href="https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens" class="text-accent hover:underline" target="_blank" rel="noopener">Error Lens</a> extension, you will have more control on how you want your errors to yell at you.
        </p>

        *<small>Except for the `fireOpal` themes, where error related UI elements are white for the dark version and dark gray for the light version.</small>
    </section>

       

       <div class="errors-preview-shell">
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
  width: min(100%, 720px);
  max-width: 100%;
  min-width: 320px;
  flex: 1 1 320px;
  /* aspect-ratio: 2045 / 1530; */
  /* flex: 0 0 auto; */
  /* transform: perspective(1200px) rotateX(45deg) rotateY(18deg) rotate(-18deg); */
  transform-origin: center center;
  will-change: transform, mask-image, -webkit-mask-image;
 
  -webkit-mask-image: linear-gradient(to top, transparent 5%, black 60%);
  mask-image: linear-gradient(to top, transparent 5%, black 60%);

}

</style>