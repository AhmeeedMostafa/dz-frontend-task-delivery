export type Price = {
  amount: number;
  currency: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: Price;
  images: string[];
  categories: string[];
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
};

export type LineItem = {
  id: string;
  referenceId: string;
  type: 'PRODUCT' | 'DISCOUNT' | 'DELIVERY';
  price: Price;
  quantity?: number;
};

export type Cart = {
  tax: number;
  items: LineItem[];
  subtotal: Price;
  total: Price;
};

export type Checkout = {
  user: User;
  products: CheckoutItem[];
};

export type CheckoutItem = {
  id: string;
  quantity?: number;
};

export type User = {
  id: string;
  name: string;
};

export type Order = {
  id: string;
  user: User;
  cart: Cart;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  timestamp?: Date;
};

export type CartStorageMap = {
  [productId: string]: number; // quantity
};

export type NormalizedProduct = {
  [productId: string]: Product;
};

export type CartItem = {
  id: string;
  quantity: number;
  product: Product;
};

export type CartContextType = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: (suppressToast?: boolean) => void;
  totalItems: number;
  subtotal: number;
  total: Price;
  isLoading: boolean;
};
