type ThemeMode = {
    // Values map to VS Code theme token origins from theme.json:
    // - bg -> editor.background
    // - foreground -> foreground
    // - border -> panel.border
    // - widgetBorder -> editorWidget.border
    // - widgetBg -> editorWidget.background
    // - widgetHoverBg -> list.activeSelectionBackground
    // - widgetHoverForeground -> editor.foreground
    ui: {
        bg: string
        foreground: string
        border: string
        widgetBorder: string
        widgetBg: string
        widgetHoverBg: string
        widgetHoverForeground: string
        shadow: string
    }
    // 
    logo: {
        bg: string
        fg: string
        mid: string
        wbg: string
        wb: string
    }
}

type ThemeTokens = {
    dark: ThemeMode
    light: ThemeMode
}

export const themePalette = {
    obsidian: {
        dark: {
            ui: {
                bg: '#020202',
                foreground: '#5c5c5c',
                border: '#141414',
                widgetBorder: '#222222',
                widgetBg: '#0d0d0d',
                widgetHoverBg: '#1b1b1b',
                widgetHoverForeground: '#a7a7a7',
                 shadow: '#020202'
            },
            logo: {
                bg: '#0d0d0d',
                fg: '#5e5c5a',
                mid: '#a7a7a7',
                wbg: '#0d0d0d',
                wb: '#222222'
            }
        },
        light: {
            ui: {
                bg: '#fdfdfd',
                foreground: '#a3a3a3',
                border: '#eaeaea',
                widgetBorder: '#dedede',
                widgetBg: '#f2f2f2',
                widgetHoverBg: '#dfdfdf',
                widgetHoverForeground: '#4f4f4f',
                shadow: '#d5d5d56f'

            },
            logo: {
                bg: '#fdfdfd',
                fg: '#a3a3a3',
                mid: '#dfdfdf',
                wbg: '#f2f2f2',
                wb: '#dedede'
            }
        }
    },
    gold: {
        dark: {
            ui: {
                bg: '#090705',
                foreground: '#80684e',
                border: '#1a1514',
                widgetBorder: '#38261e',
                widgetBg: '#15100b',
                widgetHoverBg: '#4d3a1a',
                widgetHoverForeground: '#bda88a',
                shadow: '#090705'

            },
            logo: {
                bg: '#0a0509',
                fg: '#7f5f3d',
                mid: '#906f4d',
                wbg: '#15100b',
                wb: '#38261e'
            }
        },
        light: {
            ui: {
                bg: '#faf8f6',
                foreground: '#b1997f',
                border: '#ebe6e5',
                widgetBorder: '#e1cfc7',
                widgetBg: '#f4efea',
                widgetHoverBg: '#e1d2bd',
                widgetHoverForeground: '#756042',
                shadow: '#ece2d2'
            },
            logo: {
                bg: '#faf8f6',
                fg: '#b1997f',
                mid: '#e1d2bd',
                wbg: '#f4efea',
                wb: '#e1cfc7'
            }
        }
    },
    turquoise: {
        dark: {
            ui: {
                bg: '#050909',
                foreground: '#3d7f7d',
                border: '#0d1818',
                widgetBorder: '#1e3837',
                widgetBg: '#091010',
                widgetHoverBg: '#1a4d4b',
                widgetHoverForeground: '#6aadaa',
                shadow: '#050909'

            },
            logo: {
                bg: '#070a0d',
                fg: '#3d7f7d',
                mid: '#4d8d8e',
                wbg: '#091010',
                wb: '#1e3837'
            }
        },
        light: {
            ui: {
                bg: '#f6fafa',
                foreground: '#689897',
                border: '#e7f2f2',
                widgetBorder: '#c7e1e0',
                widgetBg: '#eff6f6',
                widgetHoverBg: '#b2e5e3',
                widgetHoverForeground: '#33615f',
                shadow: '#d2ecebcc'
            },
            logo: {
                bg: '#f6fafa',
                fg: '#689897',
                mid: '#b2e5e3',
                wbg: '#eff6f6',
                wb: '#c7e1e0'
            }
        }
    },
    quartz: {
        dark: {
            ui: {
                bg: '#0a0509',
                foreground: '#7f3d5f',
                border: '#1a1418',
                widgetBorder: '#381e2e',
                widgetBg: '#140912',
                widgetHoverBg: '#4d1a3a',
                widgetHoverForeground: '#f78abe',
                shadow: '#0a0509'
            },
            logo: {
                bg: '#0a0509',
                fg: '#7f3d5f',
                mid: '#90496b',
                wbg: '#140912',
                wb: '#381e2e'
            }
        },
        light: {
            ui: {
                bg: '#faf5f9',
                foreground: '#bb779a',
                border: '#ebe5e9',
                widgetBorder: '#e1c7d7',
                widgetBg: '#f6ebf4',
                widgetHoverBg: '#e5b2d2',
                widgetHoverForeground: '#75083c',
                shadow: '#ecd2e7'
            },
            logo: {
                bg: '#faf5f9',
                fg: '#bb779a',
                mid: '#e5b2d2',
                wbg: '#f6ebf4',
                wb: '#e1c7d7'
            }
        }
    },
    lapisLazuli: {
        dark: {
            ui: {
                bg: '#070a0d',
                foreground: '#3d5f7f',
                border: '#14151a',
                widgetBorder: '#1e2a38',
                widgetBg: '#0c141a',
                widgetHoverBg: '#1a3a4d',
                widgetHoverForeground: '#99b8d4',
                shadow: '#070a0d'
            },
            logo: {
                bg: '#050909',
                fg: '#3d5f7f',
                mid: '#4d6f90',
                wbg: '#0c141a',
                wb: '#1e2a38'
            }
        },
        light: {
            ui: {
                bg: '#f2f5f8',
                foreground: '#80a2c2',
                border: '#e5e6eb',
                widgetBorder: '#c7d3e1',
                widgetBg: '#e5edf3',
                widgetHoverBg: '#b2d2e3',
                widgetHoverForeground: '#2b4a66',
                shadow: '#d8e3ef'
            },
            logo: {
                bg: '#f2f5f8',
                fg: '#80a2c2',
                mid: '#b2d2e3',
                wbg: '#e5edf3',
                wb: '#c7d3e1'
            }
        }
    },
    amethyst: {
        dark: {
            ui: {
                bg: '#060407',
                foreground: '#9482ac',
                border: '#1c1424',
                widgetBorder: '#261e38',
                widgetBg: '#10101c',
                widgetHoverBg: '#2a1a4d',
                widgetHoverForeground: '#997cc0',
                shadow: '#060407'
            },
            logo: {
                bg: '#060407',
                fg: '#9482ac',
                mid: '#9d89b7',
                wbg: '#10101c',
                wb: '#261e38'
            }
        },
        light: {
            ui: {
                bg: '#faf8fb',
                foreground: '#a087c0',
                border: '#e3dbeb',
                widgetBorder: '#cfc7e1',
                widgetBg: '#f4f1f9',
                widgetHoverBg: '#cbb2e3',
                widgetHoverForeground: '#5c3f83',
                shadow: '#ecdaf5'
            },
            logo: {
                bg: '#faf8fb',
                fg: '#a087c0',
                mid: '#cbb2e3',
                wbg: '#f4f1f9',
                wb: '#cfc7e1'
            }
        }
    },
    jade: {
        dark: {
            ui: {
                bg: '#070b09',
                foreground: '#3d7f5f',
                border: '#0f1b15',
                widgetBorder: '#1e3829',
                widgetBg: '#0b1410',
                widgetHoverBg: '#1a4d2e',
                widgetHoverForeground: '#6aad8f',
                shadow: '#070b09'
            },
            logo: {
                bg: '#070b09',
                fg: '#3d7f5f',
                mid: '#4d906f',
                wbg: '#0b1410',
                wb: '#1e3829'
            }
        },
        light: {
            ui: {
                bg: '#f4f8f6',
                foreground: '#74a890',
                border: '#e4f0ea',
                widgetBorder: '#c7e1d2',
                widgetBg: '#ebf4f0',
                widgetHoverBg: '#b2e5c3',
                widgetHoverForeground: '#3c7159',
                shadow: '#d1e1d9'
            },
            logo: {
                bg: '#f4f8f6',
                fg: '#74a890',
                mid: '#b2e5c3',
                wbg: '#ebf4f0',
                wb: '#c7e1d2'
            }
        }
    },
    fireOpal: {
        dark: {
            ui: {
                bg: '#0c0707',
                foreground: '#ad6969',
                border: '#241313',
                widgetBorder: '#381e1e',
                widgetBg: '#150c0c',
                widgetHoverBg: '#4d1a1a',
                widgetHoverForeground: '#d96670',
                shadow: '#0c0707'
            },
            logo: {
                bg: '#0c0707',
                fg: '#904040',
                mid: '#9f5151',
                wbg: '#150c0c',
                wb: '#381e1e'
            }
        },
        light: {
            ui: {
                bg: '#f8f3f3',
                foreground: '#c36969',
                border: '#ecdbdb',
                widgetBorder: '#e1c7c7',
                widgetBg: '#f3eaea',
                widgetHoverBg: '#e5b2b2',
                widgetHoverForeground: '#992630',
                shadow: '#f4d7d7'
            },
            logo: {
                bg: '#f8f3f3',
                fg: '#c36969',
                mid: '#e5b2b2',
                wbg: '#f3eaea',
                wb: '#e1c7c7'
            }
        }
    }
} as const satisfies Record<string, ThemeTokens>

export type LogoVariant = keyof typeof themePalette
export type LogoShade = keyof ThemeMode['logo']