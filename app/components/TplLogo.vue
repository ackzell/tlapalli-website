<script setup lang="ts">
import type { LogoVariant } from '@/models/variants'

const colorMode = useColorMode()
const { variant } = useThemeVariant({ defaultVariant: 'obsidian' })
const { logoColor } = useLogoColor()
const emit = defineEmits<{
    (event: 'select-variant', variant: LogoVariant): void
}>()

type Variant = LogoVariant

function selectVariant(variant: Variant) {
    emit('select-variant', variant)
}

function onGemKeydown(event: KeyboardEvent, variant: Variant) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        emit('select-variant', variant)
    }
}
</script>

<template>
    <svg id="svg44547" class="tpl-logo-svg" viewBox="0 0 344 344" version="1.1" xmlns="http://www.w3.org/2000/svg"
        xmlns:svg="http://www.w3.org/2000/svg">
        <g id="layer1" transform="translate(224.52412,-46.047909)">
            <g id="g45170" transform="translate(22.19,288.814)">
                <!-- lapisLazuli -->
                <g id="g47482" class="gem gem-lapisLazuli" role="button" tabindex="0" @click="selectVariant('lapisLazuli')"
                    @keydown="onGemKeydown($event, 'lapisLazuli')">
                    <path id="path37818"
                        :style="{ fill: logoColor('lapisLazuli', 'bg'), fillOpacity: 1, stroke: logoColor('lapisLazuli', 'fg'), strokeWidth: 2.78701, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, paintOrder: 'normal' }"
                        d="m -2372.2505,406.59142 65.8811,31.72668 16.2713,71.28919 -45.5911,57.16949 -73.1226,0 -45.5911,-57.16949 16.2713,-71.28919 z"
                        transform="matrix(-0.36604391,0.17647988,-0.17647988,-0.36604391,-812.21096,620.52509)" />
                    <path id="path37820"
                        :style="{ fill: logoColor('lapisLazuli', 'fg'), fillOpacity: 1, stroke: 'none', strokeWidth: 0.264583, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, paintOrder: 'normal' }"
                        d="m -2372.2505,406.59142 65.8811,31.72668 16.2713,71.28919 -45.5911,57.16949 -73.1226,0 -45.5911,-57.16949 16.2713,-71.28919 z"
                        transform="matrix(-0.27671771,0.13341325,-0.13341325,-0.27671771,-621.44635,474.51384)" />
                    <path id="path37822"
                        :style="{ fill: logoColor('lapisLazuli', 'mid'), fillOpacity: 1, stroke: 'none', strokeWidth: 0.264594, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, paintOrder: 'normal' }"
                        d="m -2372.2505,430.07114 32.7645,-7.653 14.7595,30.53932 26.4116,20.84472 -14.6742,30.58038 0.1703,33.64594 -33.0579,7.59379 -26.1992,21.11108 -26.5484,-21.11108 -32.8403,-7.32086 -0.047,-33.91887 -14.7519,-30.24003 26.4894,-21.18507 14.4449,-30.38785 z"
                        transform="matrix(-0.33988022,-5.155935e-4,1.4284337e-4,-0.3401893,-836.83165,188.02663)" />
                </g>

                <!-- Amethyst -->
                <g id="amethyst-gem" class="gem gem-amethyst" role="button" tabindex="0"
                    @click="selectVariant('amethyst')" @keydown="onGemKeydown($event, 'amethyst')">
                    <path id="path37824"
                        :style="{ fill: logoColor('amethyst', 'bg'), fillOpacity: 1, stroke: logoColor('amethyst', 'fg'), strokeWidth: 2.78701, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, paintOrder: 'normal' }"
                        d="m -2372.2505,406.59142 65.8811,31.72668 16.2713,71.28919 -45.5911,57.16949 -73.1226,0 -45.5911,-57.16949 16.2713,-71.28919 z"
                        transform="matrix(-0.36622852,-0.17609647,0.17609647,-0.36622852,-1075.0178,-215.73679)" />
                    <path id="path37826"
                        :style="{ fill: logoColor('amethyst', 'fg'), fillOpacity: 1, stroke: 'none', strokeWidth: 0.264583, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, paintOrder: 'normal' }"
                        d="m -2372.2505,406.59142 65.8811,31.72668 16.2713,71.28919 -45.5911,57.16949 -73.1226,0 -45.5911,-57.16949 16.2713,-71.28919 z"
                        transform="matrix(-0.27685726,-0.1331234,0.1331234,-0.27685726,-841.91314,-157.66244)" />
                    <path id="path37828"
                        :style="{ fill: logoColor('amethyst', 'mid'), fillOpacity: 1, stroke: 'none', strokeWidth: 0.264594, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, paintOrder: 'normal' }"
                        d="m -2372.2505,430.07114 32.7645,-7.653 14.7595,30.53932 26.4116,20.84472 -14.6742,30.58038 0.1703,33.64594 -33.0579,7.59379 -26.1992,21.11108 -26.5484,-21.11108 -32.8403,-7.32086 -0.047,-33.91887 -14.7519,-30.24003 26.4894,-21.18507 14.4449,-30.38785 z"
                        transform="matrix(-0.21154855,-0.26601888,0.26602804,-0.21203268,-752.27091,-504.69267)" />
                </g>

                <!-- gold -->
                <g id="gold-gem" class="gem gem-gold" role="button" tabindex="0" @click="selectVariant('gold')"
                    @keydown="onGemKeydown($event, 'gold')">
                    <path id="path37830" :style="{
                        fill: logoColor('gold', 'bg'),
                        fillOpacity: 1,
                        stroke: logoColor('gold', 'fg'),
                        strokeWidth: 2.78701,
                        strokeDasharray: 'none',
                        strokeDashoffset: 0,
                        strokeOpacity: 1,
                        paintOrder: 'normal'
                    }" d="m -2372.2505,406.59142 65.8811,31.72668 16.2713,71.28919 -45.5911,57.16949 -73.1226,0 -45.5911,-57.16949 16.2713,-71.28919 z"
                        transform="matrix(0.40636596,0,0,0.40636596,888.81157,-372.91671)" />
                    <path id="path37832" :style="{
                        fill: logoColor('gold', 'fg'),
                        fillOpacity: 1,
                        stroke: 'none',
                        strokeWidth: 0.264583,
                        strokeDasharray: 'none',
                        strokeDashoffset: 0,
                        strokeOpacity: 1,
                        paintOrder: 'normal'
                    }" d="m -2372.2505,406.59142 65.8811,31.72668 16.2713,71.28919 -45.5911,57.16949 -73.1226,0 -45.5911,-57.16949 16.2713,-71.28919 z"
                        transform="matrix(0.30719991,0,0,0.30719991,653.5648,-324.24038)" />
                    <path id="path37834"
                        :style="{
                            fill: logoColor('gold', 'mid'),
                            fillOpacity: 1, stroke: 'none', strokeWidth: 0.264594, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, paintOrder: 'normal'
                        }"
                        d="m -2372.2505,430.07114 32.7645,-7.653 14.7595,30.53932 26.4116,20.84472 -14.6742,30.58038 0.1703,33.64594 -33.0579,7.59379 -26.1992,21.11108 -26.5484,-21.11108 -32.8403,-7.32086 -0.047,-33.91887 -14.7519,-30.24003 26.4894,-21.18507 14.4449,-30.38785 z"
                        transform="matrix(0.30593137,0.14807035,-0.14786881,0.30637165,723.16029,27.359121)" />
                </g>

                <!-- Turquoise -->
                <g id="turquoise-gem" class="gem gem-turquoise" role="button" tabindex="0"
                    @click="selectVariant('turquoise')" @keydown="onGemKeydown($event, 'turquoise')">
                    <path id="path37836"
                        :style="{ fill: logoColor('turquoise', 'bg'), fillOpacity: 1, stroke: logoColor('turquoise', 'fg'), strokeWidth: 2.78701, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, paintOrder: 'normal' }"
                        d="m -2372.2505,406.59142 65.8811,31.72668 16.2713,71.28919 -45.5911,57.16949 -73.1226,0 -45.5911,-57.16949 16.2713,-71.28919 z"
                        transform="matrix(0.25341256,0.31767179,-0.31767179,0.25341256,762.36269,494.50036)" />
                    <path id="path37838"
                        :style="{ fill: logoColor('turquoise', 'fg'), fillOpacity: 1, stroke: 'none', strokeWidth: 0.264583, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, paintOrder: 'normal' }"
                        d="m -2372.2505,406.59142 65.8811,31.72668 16.2713,71.28919 -45.5911,57.16949 -73.1226,0 -45.5911,-57.16949 16.2713,-71.28919 z"
                        transform="matrix(0.19157193,0.2401499,-0.2401499,0.19157193,577.60907,340.95388)" />
                    <path id="path37840"
                        :style="{ fill: logoColor('turquoise', 'mid'), fillOpacity: 1, stroke: 'none', strokeWidth: 0.264594, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, paintOrder: 'normal' }"
                        d="m -2372.2505,430.07114 32.7645,-7.653 14.7595,30.53932 26.4116,20.84472 -14.6742,30.58038 0.1703,33.64594 -33.0579,7.59379 -26.1992,21.11108 -26.5484,-21.11108 -32.8403,-7.32086 -0.047,-33.91887 -14.7519,-30.24003 26.4894,-21.18507 14.4449,-30.38785 z"
                        transform="matrix(0.07502862,0.33149591,-0.33171442,0.07546073,346.15059,614.61914)" />
                </g>

                <!-- quartz -->
                <g id="quartz-gem" class="gem gem-quartz" role="button" tabindex="0" @click="selectVariant('quartz')"
                    @keydown="onGemKeydown($event, 'quartz')">
                    <path id="path37842"
                        :style="{ fill: logoColor('quartz', 'bg'), fillOpacity: 1, stroke: logoColor('quartz', 'fg'), strokeWidth: 2.78701, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, paintOrder: 'normal' }"
                        d="m -2372.2505,406.59142 65.8811,31.72668 16.2713,71.28919 -45.5911,57.16949 -73.1226,0 -45.5911,-57.16949 16.2713,-71.28919 z"
                        transform="matrix(-0.09030639,0.39620456,-0.39620456,-0.09030639,5.4152038,936.57751)" />
                    <path id="path37844"
                        :style="{ fill: logoColor('quartz', 'fg'), fillOpacity: 1, stroke: 'none', strokeWidth: 0.264583, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, paintOrder: 'normal' }"
                        d="m -2372.2505,406.59142 65.8811,31.72668 16.2713,71.28919 -45.5911,57.16949 -73.1226,0 -45.5911,-57.16949 16.2713,-71.28919 z"
                        transform="matrix(-0.0682688,0.2995182,-0.2995182,-0.0682688,10.234791,696.39593)" />
                    <path id="path37846"
                        :style="{ fill: logoColor('quartz', 'mid'), fillOpacity: 1, stroke: 'none', strokeWidth: 0.264594, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, paintOrder: 'normal' }"
                        d="m -2372.2505,430.07114 32.7645,-7.653 14.7595,30.53932 26.4116,20.84472 -14.6742,30.58038 0.1703,33.64594 -33.0579,7.59379 -26.1992,21.11108 -26.5484,-21.11108 -32.8403,-7.32086 -0.047,-33.91887 -14.7519,-30.24003 26.4894,-21.18507 14.4449,-30.38785 z"
                        transform="matrix(-0.21235467,0.26537583,-0.2658499,-0.21225601,-348.03892,686.11548)" />
                </g>

                <!-- jade -->
                <g id="jade-gem" class="gem gem-jade" role="button" tabindex="0" @click="selectVariant('jade')"
                    @keydown="onGemKeydown($event, 'jade')">
                    <path id="path37848" :style="{
                        fill: logoColor('jade', 'bg'),
                        fillOpacity: 1,
                        stroke: logoColor('jade', 'fg'),
                        strokeWidth: 2.78701,
                        strokeDasharray: 'none',
                        strokeDashoffset: 0,
                        strokeOpacity: 1,
                        paintOrder: 'normal'
                    }" d="m -2372.2505,406.59142 65.8811,31.72668 16.2713,71.28919 -45.5911,57.16949 -73.1226,0 -45.5911,-57.16949 16.2713,-71.28919 z"
                        transform="matrix(-0.09072125,-0.39610977,0.39610977,-0.09072125,-585.16814,-942.68176)" />
                    <path id="path37850"
                        :style="{ fill: logoColor('jade', 'fg'), fillOpacity: 1, stroke: 'none', strokeWidth: 0.264583, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, paintOrder: 'normal' }"
                        d="m -2372.2505,406.59142 65.8811,31.72668 16.2713,71.28919 -45.5911,57.16949 -73.1226,0 -45.5911,-57.16949 16.2713,-71.28919 z"
                        transform="matrix(-0.06858242,-0.29944655,0.29944655,-0.06858242,-485.20152,-724.23943)" />
                    <path id="path37852"
                        :style="{ fill: logoColor('jade', 'mid'), fillOpacity: 1, stroke: 'none', strokeWidth: 0.264594, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, paintOrder: 'normal' }"
                        d="m -2372.2505,430.07114 32.7645,-7.653 14.7595,30.53932 26.4116,20.84472 -14.6742,30.58038 0.1703,33.64594 -33.0579,7.59379 -26.1992,21.11108 -26.5484,-21.11108 -32.8403,-7.32086 -0.047,-33.91887 -14.7519,-30.24003 26.4894,-21.18507 14.4449,-30.38785 z"
                        transform="matrix(0.07603401,-0.33126675,0.33165093,0.07573928,-158.0131,-870.57299)" />
                </g>

                <!-- fire opal -->
                <g id="fireopal-gem" class="gem gem-fireopal" role="button" tabindex="0"
                    @click="selectVariant('fireOpal')" @keydown="onGemKeydown($event, 'fireOpal')">
                    <path id="path37854"
                        :style="{ fill: logoColor('fireOpal', 'bg'), fillOpacity: 1, stroke: logoColor('fireOpal', 'fg'), strokeWidth: 2.78701, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, paintOrder: 'normal' }"
                        d="m -2372.2505,406.59142 65.8811,31.72668 16.2713,71.28919 -45.5911,57.16949 -73.1226,0 -45.5911,-57.16949 16.2713,-71.28919 z"
                        transform="matrix(0.25307975,-0.31793699,0.31793699,0.25307975,288.5861,-1013.0752)" />
                    <path id="path37856"
                        :style="{ fill: logoColor('fireOpal', 'fg'), fillOpacity: 1, stroke: 'none', strokeWidth: 0.264583, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, paintOrder: 'normal' }"
                        d="m -2372.2505,406.59142 65.8811,31.72668 16.2713,71.28919 -45.5911,57.16949 -73.1226,0 -45.5911,-57.16949 16.2713,-71.28919 z"
                        transform="matrix(0.19132035,-0.24035038,0.24035038,0.19132035,180.16124,-798.70533)" />
                    <path id="path37858"
                        :style="{ fill: logoColor('fireOpal', 'mid'), fillOpacity: 1, stroke: 'none', strokeWidth: 0.264594, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, paintOrder: 'normal' }"
                        d="m -2372.2505,430.07114 32.7645,-7.653 14.7595,30.53932 26.4116,20.84472 -14.6742,30.58038 0.1703,33.64594 -33.0579,7.59379 -26.1992,21.11108 -26.5484,-21.11108 -32.8403,-7.32086 -0.047,-33.91887 -14.7519,-30.24003 26.4894,-21.18507 14.4449,-30.38785 z"
                        transform="matrix(0.3063792,-0.14714148,0.14761148,0.30649573,498.59265,-634.18437)" />
                </g>

                
                <g id="obsidian-gem">
                    <path id="path37860" :style="{
                        fill: logoColor(variant, 'wbg'),
                        fillOpacity: 1,
                        stroke: logoColor(variant, 'wb'),
                        strokeWidth: 1,
                        strokeDasharray: 'none',
                        strokeOpacity: 1
                    }" d="m -138.28767,-201.38037 13.48616,64.67353 -26.74893,32.74726 -65.40941,1.23099 61.58018,31.096306 8.64547,36.979119 -42.14766,54.941317 67.37859,-30.899859 28.362823,13.3350213 17.942894,72.3126257 17.953881,-72.35657 28.310005,-13.310255 67.420729,30.919037 -42.2112734,-55.024053 8.6149903,-36.848838 61.6742161,-31.143851 -65.4935767,-1.23249 -26.6818353,-32.66451 13.503226,-64.75478 -41.766556,50.39799 h -42.647674 z" />
                    <!-- OBSIDIAN -->
                    <g id="center-gem" class="gem gem-obsidian" role="button" tabindex="0"
                        @click="selectVariant('obsidian')" @keydown="onGemKeydown($event, 'obsidian')">
                        <path id="path37862" :style="{
                            fill: logoColor('obsidian', 'bg'),
                            fillOpacity: 1,
                            stroke: logoColor('obsidian', 'fg'),
                            strokeWidth: 0.725715,
                            strokeDasharray: 'none',
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                            paintOrder: 'normal'
                        }" d="m -2372.2505,406.59142 65.8811,31.72668 16.2713,71.28919 -45.5911,57.16949 -73.1226,0 -45.5911,-57.16949 16.2713,-71.28919 z"
                            transform="matrix(0.67128102,0,0,-0.65537035,1517.7119,250.40573)" />
                        <path id="path37864" :style="{
                            fill: logoColor('obsidian', 'fg'),
                            fillOpacity: 1,
                            stroke: 'none',
                            strokeWidth: 1.91996,
                            strokeDasharray: 'none',
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                            paintOrder: 'normal'
                        }" d="m -2372.2505,406.59142 65.8811,31.72668 16.2713,71.28919 -45.5911,57.16949 -73.1226,0 -45.5911,-57.16949 16.2713,-71.28919 z"
                            transform="matrix(0.50746735,0,0,-0.49543943,1129.105,171.90259)" />
                        <path id="path37866" :style="{
                            fill: logoColor('obsidian', 'mid'),
                            fillOpacity: 1,
                            stroke: 'none',
                            strokeWidth: 1.73456,
                            strokeDasharray: 'none',
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                            paintOrder: 'normal'
                        }" d="m -2372.2505,429.15437 32.9406,-6.69961 15.3001,29.93111 25.7761,21.57682 -13.8616,30.62387 -0.7984,33.60547 -32.5852,8.25624 -26.7716,20.32851 -26.7716,-20.32852 -32.5852,-8.25622 -0.7984,-33.60548 -13.8616,-30.62386 25.7761,-21.57683 15.3002,-29.93111 z"
                            transform="matrix(0.50537183,-0.2388018,-0.24426634,-0.49410366,1244.1907,-395.21253)" />
                    </g>
                </g>
            </g>
        </g>
    </svg>

</template>

<style scoped>
.tpl-logo-svg {
    pointer-events: none;
}

.gem {
    outline: none;
    transform-box: fill-box;
    transform-origin: center;
    transition: transform 180ms ease-out;
    cursor: pointer;
    pointer-events: auto;
}

.gem path {
    transition: fill 260ms ease, stroke 260ms ease, fill-opacity 260ms ease, stroke-opacity 260ms ease;
}

.gem:hover,
.gem:focus-visible {
    transform: scale(1.1);
}

.gem:active {
    transform: scale(0.95);
}
</style>