import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isDarkColor(hex: string): boolean {
  const color = hex.replace('#', '');
  if (color.length === 3) {
    const r = parseInt((color[0] || '') + (color[0] || ''), 16);
    const g = parseInt((color[1] || '') + (color[1] || ''), 16);
    const b = parseInt((color[2] || '') + (color[2] || ''), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq < 128;
  } else if (color.length === 6) {
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq < 128;
  }
  return false;
}
