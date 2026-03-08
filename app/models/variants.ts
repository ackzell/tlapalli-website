export const logoPalette = {
    lapisLazuli: {
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
        dark: { bg: '#0d0d0d', fg: '#5e5c5a', mid: '#a7a7a7' },
        light: { bg: '#fdfdfd', fg: '#a3a3a3', mid: '#dfdfdf' }
    }
} as const

export type LogoVariant = keyof typeof logoPalette
export type LogoShade = 'bg' | 'fg' | 'mid'