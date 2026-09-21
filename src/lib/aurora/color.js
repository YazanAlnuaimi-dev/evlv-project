/**
 * Converts "#rgb" / "#rrggbb" to an [r, g, b] triple in the 0..1 range,
 * which is what GLSL colour uniforms expect.
 */
export function hexToRgb01(hex) {
  let value = hex.replace('#', '');
  if (value.length === 3) {
    value = value
      .split('')
      .map((char) => char + char)
      .join('');
  }
  const num = Number.parseInt(value, 16);
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}
