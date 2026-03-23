<script setup lang="ts">
  import { useLogoColor } from '@/composables/useLogoColor';

  const { variant } = useThemeVariant({ defaultVariant: 'obsidian' });
  const { logoColor } = useLogoColor();
</script>

<template>
  <div id="current-gem" flex="~" items-center>
    <svg viewBox="110 110 128 128" version="1.1" xmlns="http://www.w3.org/2000/svg" class="w-16">
      <g id="layer1" transform="translate(224.52412,-46.047909)">
        <g id="g45170" transform="translate(22.19,288.814)">
          <g class="current-gem outline-none" tabindex="0">
            <path
              id="path37862"
              :style="{
                fill: logoColor(variant, 'bg'),
                fillOpacity: 1,
                stroke: logoColor(variant, 'fg'),
                strokeWidth: 0.725715,
                strokeDasharray: 'none',
                strokeDashoffset: 0,
                strokeOpacity: 1,
                paintOrder: 'normal',
              }"
              d="m -2372.2505,406.59142 65.8811,31.72668 16.2713,71.28919 -45.5911,57.16949 -73.1226,0 -45.5911,-57.16949 16.2713,-71.28919 z"
              transform="matrix(0.67128102,0,0,-0.65537035,1517.7119,250.40573)"
            />
            <path
              id="path37864"
              :style="{
                fill: logoColor(variant, 'fg'),
                fillOpacity: 1,
                stroke: 'none',
                strokeWidth: 1.91996,
                strokeDasharray: 'none',
                strokeDashoffset: 0,
                strokeOpacity: 1,
                paintOrder: 'normal',
              }"
              d="m -2372.2505,406.59142 65.8811,31.72668 16.2713,71.28919 -45.5911,57.16949 -73.1226,0 -45.5911,-57.16949 16.2713,-71.28919 z"
              transform="matrix(0.50746735,0,0,-0.49543943,1129.105,171.90259)"
            />
            <path
              id="path37866"
              :style="{
                fill: logoColor(variant, 'mid'),
                fillOpacity: 1,
                stroke: 'none',
                strokeWidth: 1.73456,
                strokeDasharray: 'none',
                strokeDashoffset: 0,
                strokeOpacity: 1,
                paintOrder: 'normal',
              }"
              d="m -2372.2505,429.15437 32.9406,-6.69961 15.3001,29.93111 25.7761,21.57682 -13.8616,30.62387 -0.7984,33.60547 -32.5852,8.25624 -26.7716,20.32851 -26.7716,-20.32852 -32.5852,-8.25622 -0.7984,-33.60548 -13.8616,-30.62386 25.7761,-21.57683 15.3002,-29.93111 z"
              transform="matrix(0.50537183,-0.2388018,-0.24426634,-0.49410366,1244.1907,-395.21253)"
            />
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
  #current-gem path {
    transition:
      fill 260ms ease,
      stroke 260ms ease,
      fill-opacity 260ms ease,
      stroke-opacity 260ms ease;
  }
</style>
