import { logoPalette, type LogoShade, type LogoVariant } from "~/models/variants"

export function useLogoColor() {
    const colorMode = useColorMode()

    const logoColor = (variant: LogoVariant, shade: LogoShade) => {
        const mode = colorMode.value === 'light' ? 'light' : 'dark'
        return logoPalette[variant][mode][shade]
    }

    return {
        logoColor,
        logoPalette
    }
}