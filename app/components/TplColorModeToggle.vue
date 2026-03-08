<script lang="ts" setup>
const colorMode = useColorMode()

function toggleMode() {
  colorMode.preference = colorMode.value === 'light' ? 'dark' : 'light'
}

</script>

<template>
  <button
    p-2
    hover="bg-active"
    bg-transparent
    border-none
    cursor-pointer
    @click="toggleMode"
  >
  <div
  text-xl
  i-mynaui:sun 
  hover:i-mynaui:sun-solid 
  dark:i-mynaui:moon 
  dark:text-white
  dark:hover:i-mynaui:moon-solid
  dark:hover:text-white
  />
  </button>
</template>
