import {
    defineConfig,
    presetAttributify,
    presetIcons,
    presetTypography,
    presetWebFonts,
    presetWind3,
    transformerDirectives,
} from 'unocss'

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
        ...['obsidian', 'gold', 'turquoise', 'quartz', 'lapisLazuli', 'amethyst', 'jade', 'fireOpal']
            .flatMap(c => [
                `border-${c}-900`,
                `bg-${c}-bg`,
                `text-${c}-50`,
                `hover:bg-${c}-900`,
                `text-${c}-foreground`,
                `bg-${c}-bg-l`,
                `text-${c}-foreground-l`
            ])
    ],
    shortcuts: [
        [
            /^btn-tpl-(\w+)$/,
            ([, color]) => `cursor-pointer px-4 py-2 rounded-md border-solid border-1 border-${color}-widgetBorder bg-${color}-widgetBg text-${color}-foreground hover:bg-${color}-widgetHoverBg hover:text-${color}-widgetHoverForeground active:bg-${color}-foreground active:text-${color}-widgetBorder`
        ],
        [
            /^btn-tpl-(\w+)-light$/,
            ([, color]) => `cursor-pointer px-4 py-2 rounded-md 
                border-solid border-1 border-${color}-widgetBorder-l 
                bg-${color}-bg-l
                text-${color}-foreground-l
                hover:bg-${color}-widgetHoverBg-l hover:text-${color}-widgetHoverForeground-l 
                active:bg-${color}-foreground-l active:text-${color}-bg-l`
        ]
    ],
    theme: {
        colors: {
            "obsidian": {
                "bg": "#020202", // editor.background
                "foreground": "#5c5c5c", // foreground

                "widgetBorder": "#222222", // editorWidget.border
                "widgetBg": "#0d0d0d", // editorWidget.background
                "widgetHoverBg": "#1b1b1b", // list.activeSelectionBackground
                "widgetHoverForeground": "#a7a7a7", // editor.foreground

                "bg-l": "#fdfdfd", // editor.background
                "foreground-l": "#a3a3a3", // foreground

                "widgetBorder-l": "#dedede", // editorWidget.border
                "widgetBg-l": "#f2f2f2", // editorWidget.background
                "widgetHoverBg-l": "#dfdfdf", // list.activeSelectionBackground
                "widgetHoverForeground-l": "#4f4f4f", // editor.foreground

                "50": "#fdfdfd",
                "100": "#e2e2e2",
                "200": "#d0d0d0",
                "300": "#b6b6b6",
                "400": "#a1a1a1",
                "500": "#8c8c8c",
                "600": "#777777",
                "700": "#5c5c5c",
                "800": "#3f3f3f",
                "900": "#222222",
                "950": "#020202"
            },
            "gold": {
                "bg": "#090705", // editor.background
                "foreground": "#80684e", // foreground

                "widgetBorder": "#38261e", // editorWidget.border
                "widgetBg": "#090705", // menu.background
                "widgetHoverBg": "#4d3a1a", // list.activeSelectionBackground (no alpha)
                "widgetHoverForeground": "#bda88a", // editor.foreground


                "bg-l": "#faf8f6", // editor.background
                "foreground-l": "#b1997f", // foreground

                "widgetBorder-l": "#e1cfc7", // editorWidget.border
                "widgetBg-l": "#f4efea", // editorWidget.background
                "widgetHoverBg-l": "#e1d2bd", // list.activeSelectionBackground (no alpha)
                "widgetHoverForeground-l": "#756042", // editor.foreground

                "50": "#faf8f6",
                "100": "#ffe8c4",
                "200": "#ffd9b8",
                "300": "#f0c9a8",
                "400": "#e3c59d",
                "500": "#d9b88f",
                "600": "#bd9970",
                "700": "#9d7f5a",
                "800": "#7f5f3d",
                "900": "#38261e",
                "950": "#090705"
            },
            "turquoise": {
                "bg": "#050909", // editor.background
                "foreground": "#3d7f7d", // foreground

                "widgetBorder": "#1e3837", // editorWidget.border
                "widgetBg": "#091010", // editorWidget.background
                "widgetHoverBg": "#1a4d4b", // list.activeSelectionBackground (no alpha)
                "widgetHoverForeground": "#6aadaa", // editor.foreground


                "bg-l": "#f6fafa", // editor.background
                "foreground-l": "#689897", // foreground

                "widgetBorder-l": "#c7e1e0", // editorWidget.border
                "widgetBg-l": "#eff6f6", // editorWidget.background
                "widgetHoverBg-l": "#b2e5e3", // list.activeSelectionBackground (no alpha)
                "widgetHoverForeground-l": "#33615f", // editor.foreground

                "50": "#f6fafa",
                "100": "#a8f0ed",
                "200": "#9de3e0",
                "300": "#8fd9d6",
                "400": "#7dd3d0",
                "500": "#70bdba",
                "600": "#509e9a",
                "700": "#3d7f7d",
                "800": "#2d4847",
                "900": "#1e3837",
                "950": "#050909"
            },
            "quartz": {
                "bg": "#0a0509", // editor.background
                "foreground": "#7f3d5f", // foreground

                "widgetBorder": "#381e2e", // editorWidget.border
                "widgetBg": "#140912", // editorWidget.background
                "widgetHoverBg": "#4d1a3a", // list.activeSelectionBackground (no alpha)
                "widgetHoverForeground": "#f78abe", // editor.foreground


                "bg-l": "#faf5f9", // editor.background
                "foreground-l": "#bb779a", // foreground

                "widgetBorder-l": "#e1c7d7", // editorWidget.border
                "widgetBg-l": "#f6ebf4", // editorWidget.background
                "widgetHoverBg-l": "#e5b2d2", // list.activeSelectionBackground (no alpha)
                "widgetHoverForeground-l": "#75083c", // editor.foreground

                "50": "#faf5f9",
                "100": "#ffb3e1",
                "200": "#ffa3d1",
                "300": "#ff99c2",
                "400": "#ff8cb8",
                "500": "#ff70ad",
                "600": "#d96b94",
                "700": "#9e5080",
                "800": "#7f3d5f",
                "900": "#381e2e",
                "950": "#0a0509"
            },
            "lapisLazuli": {
                "bg": "#070a0d", // editor.background
                "foreground": "#3d5f7f", // foreground

                "widgetBorder": "#1e2a38", // editorWidget.border
                "widgetBg": "#070a0d", // editorWidget.background
                "widgetHoverBg": "#1a3a4d", // menu.background (no alpha)
                "widgetHoverForeground": "#99b8d4", // editor.foreground

                "bg-l": "#f2f5f8", // editor.background
                "foreground-l": "#80a2c2", // foreground

                "widgetBorder-l": "#c7d3e1", // editorWidget.border
                "widgetBg-l": "#e5edf3", // editorWidget.background
                "widgetHoverBg-l": "#b2d2e3", // list.activeSelectionBackground (no alpha)
                "widgetHoverForeground-l": "#2b4a66", // editor.foreground

                "50": "#c4e8ff",
                "100": "#b8deff",
                "200": "#a8c9f0",
                "300": "#9dc9e3",
                "400": "#8fb5d9",
                "500": "#7099bd",
                "600": "#5a7f9d",
                "700": "#3d5f7f",
                "800": "#2d3d47",
                "900": "#1e2a38",
                "950": "#070a0d"
            },
            "amethyst": {

                "bg": "#060407", // editor.background
                "foreground": "#9482ac", // foreground

                "widgetBorder": "#261e38", // editorWidget.border
                "widgetBg": "#10101c", // editorWidget.background
                "widgetHoverBg": "#2a1a4d", // list.activeSelectionBackground (no alpha)
                "widgetHoverForeground": "#997cc0", // editor.foreground


                "bg-l": "#faf8fb", // editor.background
                "foreground-l": "#a087c0", // foreground

                "widgetBorder-l": "#cfc7e1", // editorWidget.border
                "widgetBg-l": "#f4f1f9", // editorWidget.background
                "widgetHoverBg-l": "#cbb2e3", // list.activeSelectionBackground (no alpha)
                "widgetHoverForeground-l": "#5c3f83", // editor.foreground

                "50": "#e8c4ff",
                "100": "#d9b8ff",
                "200": "#c9a8f0",
                "300": "#b89fd9",
                "400": "#b87fcb",
                "500": "#9970bd",
                "600": "#8a5a9d",
                "700": "#6b3d7f",
                "800": "#3d2d47",
                "900": "#261e38",
                "950": "#060407"
            },
            "jade": {

                "bg": "#070b09", // editor.background
                "foreground": "#3d7f5f", // foreground

                "widgetBorder": "#1e3829", // editorWidget.border
                "widgetBg": "#0b1410", // editorWidget.background
                "widgetHoverBg": "#1a4d2e", // list.activeSelectionBackground (no alpha)
                "widgetHoverForeground": "#6aad8f", // editor.foreground


                "bg-l": "#f4f8f6", // editor.background
                "foreground-l": "#74a890", // foreground

                "widgetBorder-l": "#c7e1d2", // editorWidget.border
                "widgetBg-l": "#ebf4f0", // editorWidget.background
                "widgetHoverBg-l": "#b2e5c3", // list.activeSelectionBackground (no alpha)
                "widgetHoverForeground-l": "#3c7159", // editor.foreground
                "50": "#b8ffd9",
                "100": "#a3ffc4",
                "200": "#9de3b8",
                "300": "#90d9ad",
                "400": "#8fd9ad",
                "500": "#70bd99",
                "600": "#5a9d7a",
                "700": "#3d7f5f",
                "800": "#2d4738",
                "900": "#1e3829",
                "950": "#070b09"
            },
            "fireOpal": {

                "bg": "#0c0707", // editor.background
                "foreground": "#ad6969", // foreground

                "widgetBorder": "#381e1e", // editorWidget.border
                "widgetBg": "#150c0c", // editorWidget.background
                "widgetHoverBg": "#4d1a1a", // list.activeSelectionBackground (no alpha)
                "widgetHoverForeground": "#d96670", // editor.foreground


                "bg-l": "#f8f3f3", // editor.background
                "foreground-l": "#c36969", // foreground

                "widgetBorder-l": "#e1c7c7", // editorWidget.border
                "widgetBg-l": "#f3eaea", // editorWidget.background
                "widgetHoverBg-l": "#e5b2b2", // list.activeSelectionBackground (no alpha)
                "widgetHoverForeground-l": "#992630", // editor.foreground

                "50": "#ffb3b8",
                "100": "#ff9199",
                "200": "#ff8599",
                "300": "#ff7070",
                "400": "#e85d7a",
                "500": "#df4c4c",
                "600": "#c94d5a",
                "700": "#9e5050",
                "800": "#7f3d3d",
                "900": "#381e1e",
                "950": "#0c0707"
            }
        }
    },
    transformers: [
        transformerDirectives(),
    ]
})