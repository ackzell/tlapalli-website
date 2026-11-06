import { themePalette, type LogoShade, type LogoVariant } from '~/models/variants';

// Logo fills are CSS custom properties, not values. The server style block
// defines the light and dark value for every variant, so the logo is painted in
// the right mode before hydration instead of after it.
export function useLogoColor() {
  const logoPalette = themePalette;

  const logoColor = (variant: LogoVariant, shade: LogoShade) => {
    return `var(--tpl-logo-${variant}-${shade})`;
  };

  return {
    logoColor,
    logoPalette,
  };
}
