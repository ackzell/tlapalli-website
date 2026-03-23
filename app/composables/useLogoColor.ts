import { themePalette, type LogoShade, type LogoVariant } from '~/models/variants';

export function useLogoColor() {
  const { resolvedMode } = useResolvedColorMode();
  const logoPalette = themePalette;

  const logoColor = (variant: LogoVariant, shade: LogoShade) => {
    const mode = resolvedMode.value === 'Light' ? 'light' : 'dark';
    return logoPalette[variant][mode].logo[shade];
  };

  return {
    logoColor,
    logoPalette,
  };
}
