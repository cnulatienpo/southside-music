import { type ClassValue, clsx } from 'clsx';
import { tv } from 'tailwind-variants';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export { tv };
