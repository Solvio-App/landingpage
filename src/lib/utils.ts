import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function getAppBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname.includes('staging')) {
      return 'https://staging-app.solvio.id';
    }
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5173';
    }
  }
  return import.meta.env.VITE_APP_URL || 'https://app.solvio.id';
}

export function getPosBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname.includes('staging')) {
      return 'https://staging-pos.solvio.id';
    }
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5174';
    }
  }
  return import.meta.env.VITE_POS_URL || 'https://pos.solvio.id';
}

export function getLoginUrl(): string {
  return `${getAppBaseUrl()}/login`;
}

export function getRegisterUrl(): string {
  return `${getAppBaseUrl()}/register`;
}
