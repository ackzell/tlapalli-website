import {
    defineConfig,
    presetAttributify,
    presetIcons,
    presetTypography,
    presetWebFonts,
    presetWind3,
    transformerDirectives,
} from 'unocss'
import { themePalette } from './app/models/variants'

const themeVariantNames = Object.keys(themePalette) as Array<keyof typeof themePalette>

export default defineConfig({
    presets: [
        presetAttributify(),
        presetIcons({
            collections: {
                mynaui: () =>
                    import('@iconify-json/mynaui/icons.json').then(i => i.default),
            },
        }),
        presetTypography(),
        presetWebFonts({
            provider: 'bunny',
            fonts: {
                sans: 'Oswald',
                serif: 'Prompt',
                mono: 'Source Code Pro',
            },
        }),
        presetWind3(),
    ],
    safelist: [
        ...themeVariantNames
            .flatMap(c => [
                `bg-${c}-dark-ui-bg`,
                `text-${c}-dark-ui-foreground`,
                `border-${c}-dark-ui-border`,
                `selection:bg-${c}-dark-logo-fg`,
                `selection:text-${c}-dark-logo-bg`,

                `bg-${c}-light-ui-bg`,
                `text-${c}-light-ui-foreground`,
                `border-${c}-light-ui-border`,
                `selection:bg-${c}-light-logo-fg`,
                `selection:text-${c}-light-logo-bg`,
            ])
    ],
    shortcuts: [
        [
            /^btn-tpl-(\w+)$/,
            ([, color]) => `cursor-pointer px-4 py-2 rounded-md border-solid border-1 border-${color}-dark-ui-widgetBorder bg-${color}-dark-ui-widgetBg text-${color}-dark-ui-foreground hover:bg-${color}-dark-ui-widgetHoverBg hover:text-${color}-dark-ui-widgetHoverForeground active:bg-${color}-dark-ui-foreground active:text-${color}-dark-ui-widgetBorder`
        ],
        [
            /^btn-tpl-(\w+)-light$/,
            ([, color]) => `cursor-pointer px-4 py-2 rounded-md 
                border-solid border-1 border-${color}-light-ui-widgetBorder 
                bg-${color}-light-ui-bg
                text-${color}-light-ui-foreground
                hover:bg-${color}-light-ui-widgetHoverBg hover:text-${color}-light-ui-widgetHoverForeground 
                active:bg-${color}-light-ui-foreground active:text-${color}-light-ui-bg`
        ]
    ],
    theme: {
        colors: themePalette
    },
    transformers: [
        transformerDirectives(),
    ]
})