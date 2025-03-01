import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CartItem, CartStorageMap, Price } from '../types/app';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string/object into a human-readable format
 */
export function formatDate(date: string | number | Date | undefined): string {
  if (!date) return 'N/A';

  try {
    const dateObj = new Date(date);

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) return 'Invalid date';

    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return 'Invalid date';
  }
}

// Helper to calculate the cart total
export const calculateTotal = (items: CartItem[]): Price => {
  const currency = items.length > 0 ? items[0].product.price.currency : 'USD';
  const amount = items.reduce((sum, item) => sum + item.product.price.amount * item.quantity, 0);
  return { amount, currency };
};

// Helper to safely load cart data from localStorage
export const loadCartFromStorage = (): CartStorageMap => {
  if (typeof window === 'undefined') return {};

  try {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      return JSON.parse(savedCart) as CartStorageMap;
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
  }

  return {};
};
