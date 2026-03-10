import { themePalette, type LogoShade, type LogoVariant } from "~/models/variants"

export function useLogoColor() {
    const colorMode = useColorMode()
    const logoPalette = themePalette

    const logoColor = (variant: LogoVariant, shade: LogoShade) => {
        const mode = colorMode.value === 'light' ? 'light' : 'dark'
        return logoPalette[variant][mode].logo[shade]
    }

    return {
        logoColor,
        logoPalette
    }
}