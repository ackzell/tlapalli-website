export const EDITOR_PREVIEW_REVEAL_DURATION = 560;
export const VARIANT_TYPING_PAUSE_DURATION = 80;

export function getVariantTypingDurations(currentValue: string, nextValue: string) {
  const removeWeight = Math.max(currentValue.length, 1) * 0.8;
  const typeWeight = Math.max(nextValue.length, 1) * 1.2;
  const weightedDuration = Math.max(
    EDITOR_PREVIEW_REVEAL_DURATION - VARIANT_TYPING_PAUSE_DURATION,
    0,
  );
  const totalWeight = removeWeight + typeWeight;

  const removeDuration = Math.round(weightedDuration * (removeWeight / totalWeight));
  const typeDuration = weightedDuration - removeDuration;

  return {
    removeDuration,
    pauseDuration: VARIANT_TYPING_PAUSE_DURATION,
    typeDuration,
  };
}
