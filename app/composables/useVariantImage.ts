import type { EditorId, SectionId } from '~/models/editors';
import type { LogoVariant } from '~/models/variants';

export type VariantImageSection = SectionId | 'variants';
export type VariantImageMode = 'Dark' | 'Light';

export const VARIANT_IMAGE_QUALITY = 85;

// Physical render widths used for BOTH the displayed `<img>` and the preloader.
// Keeping them identical means a preloaded URL is an exact cache hit for the
// swap, so switching variants never waits on the network. Values are roughly 2x
// the largest CSS size each section renders at.
export const VARIANT_IMAGE_WIDTHS: Record<VariantImageSection, number> = {
  variants: 1600,
  errors: 1440,
  versionControl: 1440,
  editorWidgets: 1440,
  aiChat: 600,
  extensions: 600,
  statusBar: 2048,
  activityBar: 320,
};

const FALLBACK_WIDTH = 1440;

export function variantImageWidth(section: VariantImageSection) {
  return VARIANT_IMAGE_WIDTHS[section] ?? FALLBACK_WIDTH;
}

export function variantImagePath(
  editorId: EditorId,
  section: VariantImageSection,
  variant: LogoVariant,
  mode: VariantImageMode,
) {
  return `images/${editorId}/${section}/${variant}${mode}.png`;
}

export function useVariantImage() {
  const $img = useImage();

  const variantImageSrc = (
    editorId: EditorId,
    section: VariantImageSection,
    variant: LogoVariant,
    mode: VariantImageMode,
  ) =>
    $img(variantImagePath(editorId, section, variant, mode), {
      width: variantImageWidth(section),
      format: 'auto',
      quality: VARIANT_IMAGE_QUALITY,
    });

  return { variantImageSrc };
}
