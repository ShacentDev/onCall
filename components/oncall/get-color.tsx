import { PREDEFINED_HUES } from "./oncall-color";

const categoryColorCache = new Map<string, { bg: string; border: string; text: string }>();

export function getCategoryColor(name: string) {
  if (categoryColorCache.has(name)) return categoryColorCache.get(name)!;

  let hue: number;
  if (name in PREDEFINED_HUES) {
    hue = PREDEFINED_HUES[name];
  } else {
    let hash = 5381;
    for (let i = 0; i < name.length; i++) {
      hash = (hash * 33) ^ name.charCodeAt(i);
    }
    hue = Math.abs(hash) % 360;
  }

  const color = {
    bg: `hsl(${hue}, 65%, 94%)`,
    border: `hsl(${hue}, 55%, 78%)`,
    text: `hsl(${hue}, 60%, 28%)`,
  };

  categoryColorCache.set(name, color);
  return color;
}