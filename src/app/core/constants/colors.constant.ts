export interface ColorBinding {
  name: string;
  hex: string;
  light?: boolean;
}

export const HERITAGE_COLORS: ColorBinding[] = [
  { name: 'Crimson Red',   hex: '#800020' },
  { name: 'Forest Green',  hex: '#004d40' },
  { name: 'Midnight Blue', hex: '#191970' },
  { name: 'Antique Gold',  hex: '#b8860b' },
  { name: 'Ivory White',   hex: '#f5f0e8', light: true },
  { name: 'Saffron Orange', hex: '#ff9933' },
  { name: 'Deep Purple',   hex: '#4a148c' },
  { name: 'Turquoise',     hex: '#00ced1' },
  { name: 'Indigo',        hex: '#4b0082' },
  { name: 'Rosewood',      hex: '#65000b' },
  { name: 'Sandstone',     hex: '#d2b48c', light: true },
  { name: 'Charcoal',      hex: '#333333' },
];

export function getColorHex(name: string): string {
  const color = HERITAGE_COLORS.find(c => c.name.toLowerCase() === name.toLowerCase());
  return color ? color.hex : '#cccccc'; // Fallback gray
}

export function isLightColor(name: string): boolean {
  const color = HERITAGE_COLORS.find(c => c.name.toLowerCase() === name.toLowerCase());
  return color ? !!color.light : false;
}
