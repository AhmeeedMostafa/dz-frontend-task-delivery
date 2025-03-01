import { render, screen } from '@testing-library/react';
import CartPage from './page';
import { useCart } from '@/lib/cart-context';
import { useHydrated } from '~/src/hooks/use-hydrated';
import { CartItem } from '~/src/types/app';

// Mock the hooks and components
jest.mock('@/lib/cart-context', () => ({
  useCart: jest.fn(),
}));

jest.mock('~/src/hooks/use-hydrated', () => ({
  useHydrated: jest.fn(),
}));

jest.mock('./cart-page-skeleton', () => ({
  __esModule: true,
  default: () => <div data-testid="cart-skeleton">Loading Skeleton</div>,
}));

jest.mock('@/components/cart-item', () => ({
  CartItem: ({ id, product, quantity }: CartItem) => (
    <div data-testid={`cart-item-${id}`}>
      {product.name} - Quantity: {quantity}
    </div>
  ),
}));

describe('CartPage', () => {
  // Mock data for tests
  const mockItems = [
    {
      id: '1',
      product: {
        id: '1',
        name: 'Test Product 1',
        price: 1000,
        images: [{ url: 'test-image-1.jpg' }],
      },
      quantity: 2,
    },
    {
      id: '2',
      product: {
        id: '2',
        name: 'Test Product 2',
        price: 2000,
        images: [{ url: 'test-image-2.jpg' }],
      },
      quantity: 1,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render CartPageSkeleton when not hydrated', () => {
    (useHydrated as jest.Mock).mockReturnValue(false);
    (useCart as jest.Mock).mockReturnValue({
      items: [],
      total: { amount: 0, currency: 'USD' },
      totalItems: 0,
      isLoading: false,
    });

    render(<CartPage />);

    expect(screen.getByTestId('cart-skeleton')).toBeInTheDocument();
  });

  test('should render CartPageSkeleton when isLoading is true', () => {
    (useHydrated as jest.Mock).mockReturnValue(true);
    (useCart as jest.Mock).mockReturnValue({
      items: [],
      total: { amount: 0, currency: 'USD' },
      totalItems: 0,
      isLoading: true,
    });

    render(<CartPage />);

    expect(screen.getByTestId('cart-skeleton')).toBeInTheDocument();
  });

  test('should render empty cart message when cart is empty', () => {
    (useHydrated as jest.Mock).mockReturnValue(true);
    (useCart as jest.Mock).mockReturnValue({
      items: [],
      total: { amount: 0, currency: 'USD' },
      totalItems: 0,
      isLoading: false,
    });

    render(<CartPage />);

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByText('Looks like you haven\'t added any products to your cart yet.')).toBeInTheDocument();
    
    const browseButton = screen.getByRole('button', { name: /browse products/i });
    expect(browseButton).toBeInTheDocument();
  });

  test('should render cart with items and correct summary', () => {
    (useHydrated as jest.Mock).mockReturnValue(true);
    (useCart as jest.Mock).mockReturnValue({
      items: mockItems,
      total: { amount: 4000, currency: 'USD' }, // (1000 * 2) + (2000 * 1)
      totalItems: 3, // 2 + 1
      isLoading: false,
    });

    render(<CartPage />);

    // Check cart title and headers
    expect(screen.getByText('Your Cart')).toBeInTheDocument();
    expect(screen.getByText('Product')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Quantity')).toBeInTheDocument();
    expect(screen.getAllByText('Total').length).toBe(2);

    // Check if cart items are rendered
    expect(screen.getByTestId('cart-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('cart-item-2')).toBeInTheDocument();

    // Check order summary
    expect(screen.getByText('Order Summary')).toBeInTheDocument();
    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getByText('Shipping')).toBeInTheDocument();
    expect(screen.getByText('Tax')).toBeInTheDocument();
    
    // Check proceed to checkout button
    const checkoutButton = screen.getByRole('button', { 
      name: /proceed to checkout \(3 items\)/i 
    });
    expect(checkoutButton).toBeInTheDocument();
  });

  test('should render correct item count text in singular form', () => {
    (useHydrated as jest.Mock).mockReturnValue(true);
    (useCart as jest.Mock).mockReturnValue({
      items: [mockItems[0]],  // Just one item
      total: { amount: 2000, currency: 'USD' },
      totalItems: 1, // Only one item
      isLoading: false,
    });

    render(<CartPage />);
    
    const checkoutButton = screen.getByRole('button', { 
      name: /proceed to checkout \(1 item\)/i 
    });
    expect(checkoutButton).toBeInTheDocument();
  });
});
