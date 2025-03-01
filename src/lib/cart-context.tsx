"use client";

import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  CartContextType, type Product, CartStorageMap, NormalizedProduct, CartItem
} from '@/types/app';
import { toast } from 'sonner';
import { calculateTotal, loadCartFromStorage } from './utils';
import useUpdateEffect from '../hooks/use-update-effect';

// Define the structure of our cart items in localStorage (minimal data)
// Using a normalized structure with IDs as keys and quantities as values
// Benefits:
// 1. O(1) lookup time for checking if an item exists
// 2. Minimal storage - only IDs and quantities in localStorage
// 3. Simpler update operations
// 4. No risk of stale product data (prices, names, etc.)


// Create the context with a default empty value
const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  subtotal: 0,
  total: { amount: 0, currency: 'USD' },
  isLoading: false,
});

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);

// Provider component to wrap the app with
export function CartProvider({ children }: { children: ReactNode }) {
  const [cartProducts, setCartProducts] = useState<CartStorageMap>(loadCartFromStorage);

  const [cartProductIds, setCartProductIds] = useState<string[]>(
    () => Object.keys(cartProducts)
  );

  // Cached product data - normalized by product ID
  const [fetchedProducts, setFetchedProducts] = useState<NormalizedProduct>({});

  // Loading state for the cart
  const [isLoading, setIsLoading] = useState<boolean>(
    () => cartProducts.length > 0
  );

  const items: CartItem[] = useMemo(() => cartProductIds
    .filter(id => cartProducts[id] > 0 && fetchedProducts[id])
    .map(id => ({
      id,
      quantity: cartProducts[id],
      product: fetchedProducts[id],
    })), [cartProductIds, cartProducts, fetchedProducts]);

  // Calculate the total number of items in the cart
  const totalItems = useMemo(() => Object.values(cartProducts).reduce(
    (total, quantity) => total + quantity,
    0
  ), [cartProducts]);

  // Calculate the subtotal price
  const subtotal = useMemo(() => items.reduce(
    (total, item) => total + (item.product.price.amount * item.quantity), 
    0
  ), [items]);

  // Calculate the full total with currency
  const total = useMemo(() => calculateTotal(items), [items]);

  // Fetch product details for items in the cart that aren't fetched
  useEffect(() => {
    // Skip if we're in server-side rendering
    if (typeof window === 'undefined') return;

    const fetchMissingProducts = async () => {
      const productIds = Object.keys(cartProducts);

      if (productIds.length === 0) {
        setIsLoading(false);
        return;
      }

      // Find products that need to be fetched
      const missingProductIds = productIds.filter(id => 
        cartProducts[id] > 0 && !fetchedProducts[id]
      );

      if (missingProductIds.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const newProducts: NormalizedProduct = { ...fetchedProducts };

        // Fetch each missing product individually
        await Promise.all(
          missingProductIds.map(async (id) => {
            try {
              const response = await fetch(`/api/products/${id}`);
              if (!response.ok) {
                throw new Error(`Failed to fetch product: ${id}`);
              }
              const result = await response.json();
              if (!result.success) {
                throw new Error(result.message)
              }

              if (result.data) {
                newProducts[id] = result.data;
              }
            } catch (error) {
              console.error(`Error fetching product ${id}:`, error);
            }
          })
        );

        setFetchedProducts(newProducts);
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMissingProducts();
  }, [cartProducts, fetchedProducts]);

  // Save cart to localStorage whenever it changes
  useUpdateEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem('cart', JSON.stringify(cartProducts));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [cartProducts]);

  // Add an item to the cart or increase its quantity if it already exists
  const addItem = (product: Product, quantity: number = 1) => {
    setFetchedProducts(prev => ({
      ...prev,
      [product.id]: product
    }));

    // Update cart items
    setCartProducts(prevItems => {
      const newQuantity = (prevItems[product.id] || 0) + quantity;
      return {
        ...prevItems,
        [product.id]: newQuantity
      };
    });

    // Add to product order if not already present
    setCartProductIds(prev => {
      if (!prev.includes(product.id)) {
        return [...prev, product.id];
      }
      return prev;
    });

    toast.success(`Added ${product.name} to cart`);
  };

  // Remove an item from the cart
  const removeItem = (productId: string) => {
    // Get product name before removing
    const productName = fetchedProducts[productId]?.name || 'Item';

    // Remove from cart items
    setCartProducts(prevItems => {
      const newItems = { ...prevItems };
      delete newItems[productId];
      return newItems;
    });

    // Update product order
    setCartProductIds(prev => prev.filter(id => id !== productId));

    toast.success(`Removed ${productName} from cart`);
  };

  // Update the quantity of an item in the cart
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;

    setCartProducts(prevItems => {
      // Skip update if product doesn't exist
      if (!prevItems[productId]) return prevItems;

      // Update quantity for the specific product
      return {
        ...prevItems,
        [productId]: quantity
      };
    });
  };

  // Clear the entire cart
  const clearCart = () => {
    setCartProducts({});
    setCartProductIds([]);
  };

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    total,
    isLoading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
