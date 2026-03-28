<script setup lang="ts"></script>
<template>
  <section
    p-4
    rounded-lg
    lg:border-none
    data-section-reveal
    flex
    flex-col
    lg:flex-row
    items-center
    justify-evenly
    gap-8
    flex-wrap
  >
    <slot />
  </section>
</template>
