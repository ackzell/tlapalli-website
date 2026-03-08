<script setup lang="ts">
const colorMode = useColorMode()

const logoPalette = {
   lapis: {
      dark: { bg: '#050909', fg: '#3d5f7f', mid: '#4d6f90' },
      light: { bg: '#f2f5f8', fg: '#80a2c2', mid: '#b2d2e3' }
   },
   amethyst: {
      dark: { bg: '#060407', fg: '#9482ac', mid: '#9d89b7' },
      light: { bg: '#faf8fb', fg: '#a087c0', mid: '#cbb2e3' }
   },
   gold: {
      dark: { bg: '#0a0509', fg: '#7f5f3d', mid: '#906f4d' },
      light: { bg: '#faf8f6', fg: '#b1997f', mid: '#e1d2bd' }
   },
   turquoise: {
      dark: { bg: '#070a0d', fg: '#3d7f7d', mid: '#4d8d8e' },
      light: { bg: '#f6fafa', fg: '#689897', mid: '#b2e5e3' }
   },
   quartz: {
      dark: { bg: '#0a0509', fg: '#7f3d5f', mid: '#90496b' },
      light: { bg: '#faf5f9', fg: '#bb779a', mid: '#e5b2d2' }
   },
   jade: {
      dark: { bg: '#070b09', fg: '#3d7f5f', mid: '#4d906f' },
      light: { bg: '#f4f8f6', fg: '#74a890', mid: '#b2e5c3' }
   },
   fireOpal: {
      dark: { bg: '#090705', fg: '#904040', mid: '#9f5151' },
      light: { bg: '#f8f3f3', fg: '#c36969', mid: '#e5b2b2' }
   },
   obsidian: {
      dark: { bg: '#0d0d0d', fg: '#5e5c5a', mid: '#ddd9d4' },
      light: { bg: '#fdfdfd', fg: '#a3a3a3', mid: '#dfdfdf' }
   }
}

type Variant = keyof typeof logoPalette;

function logoColor(variant: Variant, shade: 'bg' | 'fg' | 'mid') {
   const mode = colorMode.value === 'light' ? 'light' : 'dark'
   return logoPalette[variant][mode][shade]
}
</script>

<template>
<!-- Created with Inkscape (http://www.inkscape.org/) -->

<svg
   id="svg44547"
   width="33%"
   height="33%"
   viewBox="0 0 343.95834 343.95834"
   version="1.1"
   sodipodi:docname="logo.svg"
   inkscape:version="1.2.2 (b0a84865, 2022-12-01)"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.0.dtd"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <sodipodi:namedview
     id="namedview44549"
     pagecolor="#ffffff"
     bordercolor="#000000"
     borderopacity="0.25"
     inkscape:showpageshadow="2"
     inkscape:pageopacity="0.0"
     inkscape:pagecheckerboard="0"
     inkscape:deskcolor="#d1d1d1"
     inkscape:document-units="mm"
     showgrid="false"
     inkscape:zoom="0.64522713"
     inkscape:cx="704.40312"
     inkscape:cy="674.95612"
     inkscape:window-width="1728"
     inkscape:window-height="1057"
     inkscape:window-x="0"
     inkscape:window-y="32"
     inkscape:window-maximized="0"
     inkscape:current-layer="g45170" />
  <defs
     id="defs44544" />
  <g
     id="layer1"
     inkscape:label="Layer 1"
     inkscape:groupmode="layer"
     transform="translate(224.52412,-46.047909)">
    <g
       id="g45170"
       transform="translate(22.652542,284.41525)">
      <rect
         id="rect37816"
         style="fill:#0000;fill-opacity:1;stroke:#904040;stroke-width:0;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;paint-order:normal"
         width="343.95834"
         height="343.95834"
         x="-247.17667"
         y="-238.36734"
         rx="7.6093784e-05"
         ry="9.4053615e-07" />

      <!-- Lapis -->
      <g id="g47482">
        <path
           id="path37818"
           sodipodi:type="star"
          :style="{ fill: logoColor('lapis', 'bg'), fillOpacity: 1, stroke: logoColor('lapis', 'fg'), strokeWidth: 2.78701, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, paintOrder: 'normal' }"
           inkscape:flatsided="true"
           sodipodi:sides="7"
           sodipodi:cx="-2372.2505"
           sodipodi:cy="490.85654"
           sodipodi:r1="84.265114"
           sodipodi:r2="75.920242"
           sodipodi:arg1="-1.5707963"
           sodipodi:arg2="-1.1219974"
           inkscape:rounded="0"
           inkscape:randomized="0"
           d="m -2372.2505,406.59142 65.8811,31.72668 16.2713,71.28919 -45.5911,57.16949 -73.1226,0 -45.5911,-57.16949 16.2713,-71.28919 z"
           inkscape:transform-center-x="-1.1633478e-05"
           inkscape:transform-center-y="-2.5987569"
           transform="matrix(-0.36604391,0.17647988,-0.17647988,-0.36604391,-812.21096,620.52509)" />
        <path
           id="path37820"
           sodipodi:type="star"
          :style="{ fill: logoColor('lapis', 'fg'), fillOpacity: 1, stroke: 'none', strokeWidth: 0.264583, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, paintOrder: 'normal' }"
           inkscape:flatsided="true"
           sodipodi:sides="7"
           sodipodi:cx="-2372.2505"
           sodipodi:cy="490.85654"
           sodipodi:r1="84.265114"
           sodipodi:r2="75.920242"
           sodipodi:arg1="-1.5707963"
           sodipodi:arg2="-1.1219974"
           inkscape:rounded="0"
           inkscape:randomized="0"
           d="m -2372.2505,406.59142 65.8811,31.72668 16.2713,71.28919 -45.5911,57.16949 -73.1226,0 -45.5911,-57.16949 16.2713,-71.28919 z"
           inkscape:transform-center-x="-1.9984193e-05"
           inkscape:transform-center-y="-1.9645844"
           transform="matrix(-0.27671771,0.13341325,-0.13341325,-0.27671771,-621.44635,474.51384)" />
        <path
           id="path37822"
           sodipodi:type="star"
           :style="{ fill: logoColor('lapis', 'mid'), fillOpacity: 1, stroke: 'none', strokeWidth: 0.264594, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, paintOrder: 'normal' }"
           inkscape:flatsided="false"
           sodipodi:sides="7"
           sodipodi:cx="-2372.2505"
           sodipodi:cy="490.85654"
           sodipodi:r1="60.7854"
           sodipodi:r2="75.877029"
           sodipodi:arg1="-1.5707963"
           sodipodi:arg2="-1.1242978"
           inkscape:rounded="0"
           inkscape:randomized="0"
           d="m -2372.2505,430.07114 32.7645,-7.653 14.7595,30.53932 26.4116,20.84472 -14.6742,30.58038 0.1703,33.64594 -33.0579,7.59379 -26.1992,21.11108 -26.5484,-21.11108 -32.8403,-7.32086 -0.047,-33.91887 -14.7519,-30.24003 26.4894,-21.18507 14.4449,-30.38785 z"
           inkscape:transform-center-x="-1.7850573"
           inkscape:transform-center-y="-5.6730748"
           transform="matrix(-0.33988022,-5.155935e-4,1.4284337e-4,-0.3401893,-836.83165,188.02663)" />
      </g>

      <!-- Amethyst -->
      <path
         id="path37824"
         sodipodi:type="star"
         :style="{ fill: logoColor('amethyst', 'bg'), fillOpacity: 1, stroke: logoColor('amethyst', 'fg'), strokeWidth: 2.78701, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, paintOrder: 'normal' }"
         inkscape:flatsided="true"
         sodipodi:sides="7"
         sodipodi:cx="-2372.2505"
         sodipodi:cy="490.85654"
         sodipodi:r1="84.265114"
         sodipodi:r2="75.920242"
         sodipodi:arg1="-1.5707963"
         sodipodi:arg2="-1.1219974"
         inkscape:rounded="0"
         inkscape:randomized="0"
         d="m -2372.2505,406.59142 65.8811,31.72668 16.2713,71.28919 -45.5911,57.16949 -73.1226,0 -45.5911,-57.16949 16.2713,-71.28919 z"
         inkscape:transform-center-x="-5.6923585e-05"
         inkscape:transform-center-y="-2.5987484"
         transform="matrix(-0.36622852,-0.17609647,0.17609647,-0.36622852,-1075.0178,-215.73679)" />
      <path
         id="path37826"
         sodipodi:type="star"
         :style="{ fill: logoColor('amethyst', 'fg'), fillOpacity: 1, stroke: 'none', strokeWidth: 0.264583, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, paintOrder: 'normal' }"
         inkscape:flatsided="true"
         sodipodi:sides="7"
         sodipodi:cx="-2372.2505"
         sodipodi:cy="490.85654"
         sodipodi:r1="84.265114"
         sodipodi:r2="75.920242"
         sodipodi:arg1="-1.5707963"
         sodipodi:arg2="-1.1219974"
         inkscape:rounded="0"
         inkscape:randomized="0"
         d="m -2372.2505,406.59142 65.8811,31.72668 16.2713,71.28919 -45.5911,57.16949 -73.1226,0 -45.5911,-57.16949 16.2713,-71.28919 z"
         inkscape:transform-center-x="-1.6072387e-05"
         inkscape:transform-center-y="-1.9645685"
         transform="matrix(-0.27685726,-0.1331234,0.1331234,-0.27685726,-841.91314,-157.66244)" />
      <path
         id="path37828"
         sodipodi:type="star"
         :style="{ fill: logoColor('amethyst', 'mid'), fillOpacity: 1, stroke: 'none', strokeWidth: 0.264594, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, paintOrder: 'normal' }"
         inkscape:flatsided="false"
         sodipodi:sides="7"
         sodipodi:cx="-2372.2505"
         sodipodi:cy="490.85654"
         sodipodi:r1="60.7854"
         sodipodi:r2="75.877029"
         sodipodi:arg1="-1.5707963"
         sodipodi:arg2="-1.1242978"
         inkscape:rounded="0"
         inkscape:randomized="0"
         d="m -2372.2505,430.07114 32.7645,-7.653 14.7595,30.53932 26.4116,20.84472 -14.6742,30.58038 0.1703,33.64594 -33.0579,7.59379 -26.1992,21.11108 -26.5484,-21.11108 -32.8403,-7.32086 -0.047,-33.91887 -14.7519,-30.24003 26.4894,-21.18507 14.4449,-30.38785 z"
         inkscape:transform-center-x="-1.785065"
         inkscape:transform-center-y="-5.6730623"
         transform="matrix(-0.21154855,-0.26601888,0.26602804,-0.21203268,-752.27091,-504.69267)" />

      <!-- gold -->
      <path
         id="path37830"
         sodipodi:type="star"
          :style="{
            fill: logoColor('gold', 'bg'), 
            fillOpacity:1, 
            stroke: logoColor('gold', 'fg'), 
            strokeWidth:2.78701, 
            strokeDasharray:'none', 
            strokeDashoffset:0, 
            strokeOpacity:1,
            paintOrder:'normal'
         }"
         inkscape:flatsided="true"
         sodipodi:sides="7"
         sodipodi:cx="-2372.2505"
         sodipodi:cy="490.85654"
         sodipodi:r1="84.265114"
         sodipodi:r2="75.920242"
         sodipodi:arg1="-1.5707963"
         sodipodi:arg2="-1.1219974"
         inkscape:rounded="0"
         inkscape:randomized="0"
         d="m -2372.2505,406.59142 65.8811,31.72668 16.2713,71.28919 -45.5911,57.16949 -73.1226,0 -45.5911,-57.16949 16.2713,-71.28919 z"
         inkscape:transform-center-x="-9.0264991e-06"
         inkscape:transform-center-y="-2.5987524"
         transform="matrix(0.40636596,0,0,0.40636596,888.81157,-372.91671)" />
      <path
         id="path37832"
         sodipodi:type="star"
           :style="{
            fill: logoColor('gold', 'fg'), 
            fillOpacity:1, 
            stroke:'none', 
            strokeWidth:0.264583, 
            strokeDasharray:'none', 
            strokeDashoffset:0, 
            strokeOpacity:1, 
            paintOrder:'normal'
         }"
         inkscape:flatsided="true"
         sodipodi:sides="7"
         sodipodi:cx="-2372.2505"
         sodipodi:cy="490.85654"
         sodipodi:r1="84.265114"
         sodipodi:r2="75.920242"
         sodipodi:arg1="-1.5707963"
         sodipodi:arg2="-1.1219974"
         inkscape:rounded="0"
         inkscape:randomized="0"
         d="m -2372.2505,406.59142 65.8811,31.72668 16.2713,71.28919 -45.5911,57.16949 -73.1226,0 -45.5911,-57.16949 16.2713,-71.28919 z"
         inkscape:transform-center-x="-8.8269039e-06"
         inkscape:transform-center-y="-1.9645759"
         transform="matrix(0.30719991,0,0,0.30719991,653.5648,-324.24038)" />
      <path
         id="path37834"
         sodipodi:type="star"
         :style="{ 
            fill: logoColor('gold', 'mid'), 
            fillOpacity: 1, stroke: 'none', strokeWidth: 0.264594, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, paintOrder: 'normal' }"
         inkscape:flatsided="false"
         sodipodi:sides="7"
         sodipodi:cx="-2372.2505"
         sodipodi:cy="490.85654"
         sodipodi:r1="60.7854"
         sodipodi:r2="75.877029"
         sodipodi:arg1="-1.5707963"
         sodipodi:arg2="-1.1242978"
         inkscape:rounded="0"
         inkscape:randomized="0"
         d="m -2372.2505,430.07114 32.7645,-7.653 14.7595,30.53932 26.4116,20.84472 -14.6742,30.58038 0.1703,33.64594 -33.0579,7.59379 -26.1992,21.11108 -26.5484,-21.11108 -32.8403,-7.32086 -0.047,-33.91887 -14.7519,-30.24003 26.4894,-21.18507 14.4449,-30.38785 z"
         inkscape:transform-center-x="-1.7850514"
         inkscape:transform-center-y="-5.6730642"
         transform="matrix(0.30593137,0.14807035,-0.14786881,0.30637165,723.16029,27.359121)" />

      <!-- Turquoise -->
      <path
         id="path37836"
         sodipodi:type="star"
         :style="{ fill: logoColor('turquoise', 'bg'), fillOpacity: 1, stroke: logoColor('turquoise', 'fg'), strokeWidth: 2.78701, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, paintOrder: 'normal' }"
         inkscape:flatsided="true"
         sodipodi:sides="7"
         sodipodi:cx="-2372.2505"
         sodipodi:cy="490.85654"
         sodipodi:r1="84.265114"
         sodipodi:r2="75.920242"
         sodipodi:arg1="-1.5707963"
         sodipodi:arg2="-1.1219974"
         inkscape:rounded="0"
         inkscape:randomized="0"
         d="m -2372.2505,406.59142 65.8811,31.72668 16.2713,71.28919 -45.5911,57.16949 -73.1226,0 -45.5911,-57.16949 16.2713,-71.28919 z"
         inkscape:transform-center-x="-1.1942666e-05"
         inkscape:transform-center-y="-2.598742"
         transform="matrix(0.25341256,0.31767179,-0.31767179,0.25341256,762.36269,494.50036)" />
      <path
         id="path37838"
         sodipodi:type="star"
         :style="{ fill: logoColor('turquoise', 'fg'), fillOpacity: 1, stroke: 'none', strokeWidth: 0.264583, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, paintOrder: 'normal' }"
         inkscape:flatsided="true"
         sodipodi:sides="7"
         sodipodi:cx="-2372.2505"
         sodipodi:cy="490.85654"
         sodipodi:r1="84.265114"
         sodipodi:r2="75.920242"
         sodipodi:arg1="-1.5707963"
         sodipodi:arg2="-1.1219974"
         inkscape:rounded="0"
         inkscape:randomized="0"
         d="m -2372.2505,406.59142 65.8811,31.72668 16.2713,71.28919 -45.5911,57.16949 -73.1226,0 -45.5911,-57.16949 16.2713,-71.28919 z"
         inkscape:transform-center-x="-1.2864136e-05"
         inkscape:transform-center-y="-1.9645826"
         transform="matrix(0.19157193,0.2401499,-0.2401499,0.19157193,577.60907,340.95388)" />
      <path
         id="path37840"
         sodipodi:type="star"
         :style="{ fill: logoColor('turquoise', 'mid'), fillOpacity: 1, stroke: 'none', strokeWidth: 0.264594, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, paintOrder: 'normal' }"
         inkscape:flatsided="false"
         sodipodi:sides="7"
         sodipodi:cx="-2372.2505"
         sodipodi:cy="490.85654"
         sodipodi:r1="60.7854"
         sodipodi:r2="75.877029"
         sodipodi:arg1="-1.5707963"
         sodipodi:arg2="-1.1242978"
         inkscape:rounded="0"
         inkscape:randomized="0"
         d="m -2372.2505,430.07114 32.7645,-7.653 14.7595,30.53932 26.4116,20.84472 -14.6742,30.58038 0.1703,33.64594 -33.0579,7.59379 -26.1992,21.11108 -26.5484,-21.11108 -32.8403,-7.32086 -0.047,-33.91887 -14.7519,-30.24003 26.4894,-21.18507 14.4449,-30.38785 z"
         inkscape:transform-center-x="-1.7850452"
         inkscape:transform-center-y="-5.6730757"
         transform="matrix(0.07502862,0.33149591,-0.33171442,0.07546073,346.15059,614.61914)" />

      <!-- quartz -->
      <path
         id="path37842"
         sodipodi:type="star"
         :style="{ fill: logoColor('quartz', 'bg'), fillOpacity: 1, stroke: logoColor('quartz', 'fg'), strokeWidth: 2.78701, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, paintOrder: 'normal' }"
         inkscape:flatsided="true"
         sodipodi:sides="7"
         sodipodi:cx="-2372.2505"
         sodipodi:cy="490.85654"
         sodipodi:r1="84.265114"
         sodipodi:r2="75.920242"
         sodipodi:arg1="-1.5707963"
         sodipodi:arg2="-1.1219974"
         inkscape:rounded="0"
         inkscape:randomized="0"
         d="m -2372.2505,406.59142 65.8811,31.72668 16.2713,71.28919 -45.5911,57.16949 -73.1226,0 -45.5911,-57.16949 16.2713,-71.28919 z"
         inkscape:transform-center-x="-9.7329513e-06"
         inkscape:transform-center-y="-2.5987609"
         transform="matrix(-0.09030639,0.39620456,-0.39620456,-0.09030639,5.4152038,936.57751)" />
      <path
         id="path37844"
         sodipodi:type="star"
         
         :style="{ fill: logoColor('quartz', 'fg'), fillOpacity: 1, stroke: 'none', strokeWidth: 0.264583, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, paintOrder: 'normal' }"
         inkscape:flatsided="true"
         sodipodi:sides="7"
         sodipodi:cx="-2372.2505"
         sodipodi:cy="490.85654"
         sodipodi:r1="84.265114"
         sodipodi:r2="75.920242"
         sodipodi:arg1="-1.5707963"
         sodipodi:arg2="-1.1219974"
         inkscape:rounded="0"
         inkscape:randomized="0"
         d="m -2372.2505,406.59142 65.8811,31.72668 16.2713,71.28919 -45.5911,57.16949 -73.1226,0 -45.5911,-57.16949 16.2713,-71.28919 z"
         inkscape:transform-center-x="-1.7159964e-05"
         inkscape:transform-center-y="-1.9645639"
         transform="matrix(-0.0682688,0.2995182,-0.2995182,-0.0682688,10.234791,696.39593)" />
      <path
         id="path37846"
         sodipodi:type="star"
         :style="{ fill: logoColor('quartz', 'mid'), fillOpacity: 1, stroke: 'none', strokeWidth: 0.264594, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, paintOrder: 'normal' }"
         
         inkscape:flatsided="false"
         sodipodi:sides="7"
         sodipodi:cx="-2372.2505"
         sodipodi:cy="490.85654"
         sodipodi:r1="60.7854"
         sodipodi:r2="75.877029"
         sodipodi:arg1="-1.5707963"
         sodipodi:arg2="-1.1242978"
         inkscape:rounded="0"
         inkscape:randomized="0"
         d="m -2372.2505,430.07114 32.7645,-7.653 14.7595,30.53932 26.4116,20.84472 -14.6742,30.58038 0.1703,33.64594 -33.0579,7.59379 -26.1992,21.11108 -26.5484,-21.11108 -32.8403,-7.32086 -0.047,-33.91887 -14.7519,-30.24003 26.4894,-21.18507 14.4449,-30.38785 z"
         inkscape:transform-center-x="-1.7850684"
         inkscape:transform-center-y="-5.673069"
         transform="matrix(-0.21235467,0.26537583,-0.2658499,-0.21225601,-348.03892,686.11548)" />

      <!-- jade -->
      <path
         id="path37848"
         sodipodi:type="star"
        :style="{
            fill: logoColor('jade', 'bg'), 
            fillOpacity:1,
            stroke: logoColor('jade', 'fg'),
            strokeWidth:2.78701,
            strokeDasharray:'none',
            strokeDashoffset:0,
            strokeOpacity:1,
            paintOrder:'normal'
           }"
         inkscape:flatsided="true"
         sodipodi:sides="7"
         sodipodi:cx="-2372.2505"
         sodipodi:cy="490.85654"
         sodipodi:r1="84.265114"
         sodipodi:r2="75.920242"
         sodipodi:arg1="-1.5707963"
         sodipodi:arg2="-1.1219974"
         inkscape:rounded="0"
         inkscape:randomized="0"
         d="m -2372.2505,406.59142 65.8811,31.72668 16.2713,71.28919 -45.5911,57.16949 -73.1226,0 -45.5911,-57.16949 16.2713,-71.28919 z"
         inkscape:transform-center-x="-3.0021457e-05"
         inkscape:transform-center-y="-2.5987509"
         transform="matrix(-0.09072125,-0.39610977,0.39610977,-0.09072125,-585.16814,-942.68176)" />
      <path
         id="path37850"
         sodipodi:type="star"
         :style="{ fill: logoColor('jade', 'fg'), fillOpacity: 1, stroke: 'none', strokeWidth: 0.264583, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, paintOrder: 'normal' }"
         inkscape:flatsided="true"
         sodipodi:sides="7"
         sodipodi:cx="-2372.2505"
         sodipodi:cy="490.85654"
         sodipodi:r1="84.265114"
         sodipodi:r2="75.920242"
         sodipodi:arg1="-1.5707963"
         sodipodi:arg2="-1.1219974"
         inkscape:rounded="0"
         inkscape:randomized="0"
         d="m -2372.2505,406.59142 65.8811,31.72668 16.2713,71.28919 -45.5911,57.16949 -73.1226,0 -45.5911,-57.16949 16.2713,-71.28919 z"
         inkscape:transform-center-x="-1.9746613e-05"
         inkscape:transform-center-y="-1.9645727"
         transform="matrix(-0.06858242,-0.29944655,0.29944655,-0.06858242,-485.20152,-724.23943)" />
      <path
         id="path37852"
         sodipodi:type="star"
         :style="{ fill: logoColor('jade', 'mid'), fillOpacity: 1, stroke: 'none', strokeWidth: 0.264594, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, paintOrder: 'normal' }"
         inkscape:flatsided="false"
         sodipodi:sides="7"
         sodipodi:cx="-2372.2505"
         sodipodi:cy="490.85654"
         sodipodi:r1="60.7854"
         sodipodi:r2="75.877029"
         sodipodi:arg1="-1.5707963"
         sodipodi:arg2="-1.1242978"
         inkscape:rounded="0"
         inkscape:randomized="0"
         d="m -2372.2505,430.07114 32.7645,-7.653 14.7595,30.53932 26.4116,20.84472 -14.6742,30.58038 0.1703,33.64594 -33.0579,7.59379 -26.1992,21.11108 -26.5484,-21.11108 -32.8403,-7.32086 -0.047,-33.91887 -14.7519,-30.24003 26.4894,-21.18507 14.4449,-30.38785 z"
         inkscape:transform-center-x="-1.7850713"
         inkscape:transform-center-y="-5.6730598"
         transform="matrix(0.07603401,-0.33126675,0.33165093,0.07573928,-158.0131,-870.57299)" />

      <!-- fire opal -->
      <path
         id="path37854"
         sodipodi:type="star"
         :style="{ fill: logoColor('fireOpal', 'bg'), fillOpacity: 1, stroke: logoColor('fireOpal', 'fg'), strokeWidth: 2.78701, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, paintOrder: 'normal' }"
         inkscape:flatsided="true"
         sodipodi:sides="7"
         sodipodi:cx="-2372.2505"
         sodipodi:cy="490.85654"
         sodipodi:r1="84.265114"
         sodipodi:r2="75.920242"
         sodipodi:arg1="-1.5707963"
         sodipodi:arg2="-1.1219974"
         inkscape:rounded="0"
         inkscape:randomized="0"
         d="m -2372.2505,406.59142 65.8811,31.72668 16.2713,71.28919 -45.5911,57.16949 -73.1226,0 -45.5911,-57.16949 16.2713,-71.28919 z"
         inkscape:transform-center-x="-2.3482406e-05"
         inkscape:transform-center-y="-2.5987352"
         transform="matrix(0.25307975,-0.31793699,0.31793699,0.25307975,288.5861,-1013.0752)" />
      <path
         id="path37856"
         sodipodi:type="star"
         :style="{ fill: logoColor('fireOpal', 'fg'), fillOpacity: 1, stroke: 'none', strokeWidth: 0.264583, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, paintOrder: 'normal' }"
         inkscape:flatsided="true"
         sodipodi:sides="7"
         sodipodi:cx="-2372.2505"
         sodipodi:cy="490.85654"
         sodipodi:r1="84.265114"
         sodipodi:r2="75.920242"
         sodipodi:arg1="-1.5707963"
         sodipodi:arg2="-1.1219974"
         inkscape:rounded="0"
         inkscape:randomized="0"
         d="m -2372.2505,406.59142 65.8811,31.72668 16.2713,71.28919 -45.5911,57.16949 -73.1226,0 -45.5911,-57.16949 16.2713,-71.28919 z"
         inkscape:transform-center-x="-9.7826985e-06"
         inkscape:transform-center-y="-1.9645898"
         transform="matrix(0.19132035,-0.24035038,0.24035038,0.19132035,180.16124,-798.70533)" />
      <path
         id="path37858"
         sodipodi:type="star"
         :style="{ fill: logoColor('fireOpal', 'mid'), fillOpacity: 1, stroke: 'none', strokeWidth: 0.264594, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, paintOrder: 'normal' }"
         inkscape:flatsided="false"
         sodipodi:sides="7"
         sodipodi:cx="-2372.2505"
         sodipodi:cy="490.85654"
         sodipodi:r1="60.7854"
         sodipodi:r2="75.877029"
         sodipodi:arg1="-1.5707963"
         sodipodi:arg2="-1.1242978"
         inkscape:rounded="0"
         inkscape:randomized="0"
         d="m -2372.2505,430.07114 32.7645,-7.653 14.7595,30.53932 26.4116,20.84472 -14.6742,30.58038 0.1703,33.64594 -33.0579,7.59379 -26.1992,21.11108 -26.5484,-21.11108 -32.8403,-7.32086 -0.047,-33.91887 -14.7519,-30.24003 26.4894,-21.18507 14.4449,-30.38785 z"
         inkscape:transform-center-x="-1.7850603"
         inkscape:transform-center-y="-5.6730705"
         transform="matrix(0.3063792,-0.14714148,0.14761148,0.30649573,498.59265,-634.18437)" />

      <!-- OBSIDIAN -->
      <path
         id="path37860"
         :style="{ 
            fill: logoColor('obsidian', 'bg'), 
            fillOpacity: 1, 
            stroke: colorMode.value === 'dark' ? '#fbf1f1' : '#0d0d0d', 
            strokeWidth: 1, 
            strokeDasharray: 'none', 
            strokeOpacity: 0.15 
        }"
         inkscape:transform-center-x="-2.7662399e-05"
         inkscape:transform-center-y="7.9191513"
         d="m -138.28767,-201.38037 13.48616,64.67353 -26.74893,32.74726 -65.40941,1.23099 61.58018,31.096306 8.64547,36.979119 -42.14766,54.941317 67.37859,-30.899859 28.362823,13.3350213 17.942894,72.3126257 17.953881,-72.35657 28.310005,-13.310255 67.420729,30.919037 -42.2112734,-55.024053 8.6149903,-36.848838 61.6742161,-31.143851 -65.4935767,-1.23249 -26.6818353,-32.66451 13.503226,-64.75478 -41.766556,50.39799 h -42.647674 z" />
      <path
         id="path37862"
         sodipodi:type="star"
         :style="{ 
            fill: logoColor('obsidian', 'bg'), 
            fillOpacity: 1, 
            stroke: logoColor('obsidian', 'fg'), 
            strokeWidth: 0.725715, 
            strokeDasharray: 'none', 
            strokeDashoffset: 0,
            strokeOpacity: 1,
            paintOrder: 'normal' 
        }"
         inkscape:flatsided="true"
         sodipodi:sides="7"
         sodipodi:cx="-2372.2505"
         sodipodi:cy="490.85654"
         sodipodi:r1="84.265114"
         sodipodi:r2="75.920242"
         sodipodi:arg1="-1.5707963"
         sodipodi:arg2="-1.1219974"
         inkscape:rounded="0"
         inkscape:randomized="0"
         d="m -2372.2505,406.59142 65.8811,31.72668 16.2713,71.28919 -45.5911,57.16949 -73.1226,0 -45.5911,-57.16949 16.2713,-71.28919 z"
         inkscape:transform-center-y="-2.5987538"
         transform="matrix(0.67128102,0,0,-0.65537035,1517.7119,250.40573)" />
      <path
         id="path37864"
         sodipodi:type="star"
         :style="{ 
            fill: logoColor('obsidian', 'fg'), 
            fillOpacity: 1, 
            stroke: 'none', 
            strokeWidth: 1.91996, 
            strokeDasharray: 'none', 
            strokeDashoffset: 0, 
            strokeOpacity: 1, 
            paintOrder: 'normal' 
         }"
         inkscape:flatsided="true"
         sodipodi:sides="7"
         sodipodi:cx="-2372.2505"
         sodipodi:cy="490.85654"
         sodipodi:r1="84.265114"
         sodipodi:r2="75.920242"
         sodipodi:arg1="-1.5707963"
         sodipodi:arg2="-1.1219974"
         inkscape:rounded="0"
         inkscape:randomized="0"
         d="m -2372.2505,406.59142 65.8811,31.72668 16.2713,71.28919 -45.5911,57.16949 -73.1226,0 -45.5911,-57.16949 16.2713,-71.28919 z"
         inkscape:transform-center-x="-4.8974723e-05"
         inkscape:transform-center-y="-1.9645756"
         transform="matrix(0.50746735,0,0,-0.49543943,1129.105,171.90259)" />
      <path
         id="path37866"
         sodipodi:type="star"
         :style="{ 
            fill: logoColor('obsidian', 'mid'), 
            fillOpacity: colorMode.value === 'dark' ? 0.133333 : 1, 
            stroke: 'none', 
            strokeWidth: 1.73456, 
            strokeDasharray: 'none', 
            strokeDashoffset: 0, 
            strokeOpacity: 1, 
            paintOrder: 'normal' 
         }"
         inkscape:flatsided="false"
         sodipodi:sides="7"
         sodipodi:cx="-2372.2505"
         sodipodi:cy="490.85654"
         sodipodi:r1="61.702164"
         sodipodi:r2="75.920242"
         sodipodi:arg1="-1.5707963"
         sodipodi:arg2="-1.1219974"
         inkscape:rounded="0"
         inkscape:randomized="0"
         d="m -2372.2505,429.15437 32.9406,-6.69961 15.3001,29.93111 25.7761,21.57682 -13.8616,30.62387 -0.7984,33.60547 -32.5852,8.25624 -26.7716,20.32851 -26.7716,-20.32852 -32.5852,-8.25622 -0.7984,-33.60548 -13.8616,-30.62386 25.7761,-21.57683 15.3002,-29.93111 z"
         inkscape:transform-center-x="-1.7850486"
         inkscape:transform-center-y="-5.6730751"
         transform="matrix(0.50537183,-0.2388018,-0.24426634,-0.49410366,1244.1907,-395.21253)" />
    </g>
  </g>
</svg>

</template>