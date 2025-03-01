import { render, screen, waitFor, act } from '@testing-library/react';
import { useApi } from '@/hooks/use-api';
import CategoriesPage from './page';
import CategoryPage from './[categoryId]/page';

// Mock the useApi hook
jest.mock('@/hooks/use-api', () => ({
  useApi: jest.fn(),
}));

describe('CategoriesPage', () => {
  // Mock data for categories
  const mockCategories = [
    { id: '1', name: 'Electronics', description: 'Electronic devices', image: '/images/electronics.jpg', slug: 'electronics' },
    { id: '2', name: 'Clothing', description: 'Fashion items', image: '/images/clothing.jpg', slug: 'clothing' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading skeletons when data is loading', () => {
    (useApi as jest.Mock).mockReturnValue({ data: null, isLoading: true, error: null });
    
    render(<CategoriesPage />);
    expect(screen.getByText('Categories')).toBeInTheDocument();
    const skeletons = screen.getAllByTestId('category-skeleton');
    expect(skeletons.length).toBe(5);
  });

  test('displays error message when there is an error', () => {
    const mockError = new Error('Failed to fetch categories');
    (useApi as jest.Mock).mockReturnValue({ data: null, isLoading: false, error: mockError });
    
    render(<CategoriesPage />);
    
    expect(screen.getByText('Error loading categories')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch categories')).toBeInTheDocument();
  });

  test('displays empty state when no categories are found', () => {
    (useApi as jest.Mock).mockReturnValue({ data: [], isLoading: false, error: null });
    
    render(<CategoriesPage />);
    
    expect(screen.getByText('No categories found')).toBeInTheDocument();
    expect(screen.getByText('There are no product categories available at this time.')).toBeInTheDocument();
  });

  test('renders categories when data is loaded successfully', () => {
    (useApi as jest.Mock).mockReturnValue({ data: mockCategories, isLoading: false, error: null });
    
    render(<CategoriesPage />);
    
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('Clothing')).toBeInTheDocument();
    expect(screen.getByText('Electronic devices')).toBeInTheDocument();
    expect(screen.getByText('Fashion items')).toBeInTheDocument();
    expect(document.querySelector(`a[href="/categories/1"]`)).toBeInTheDocument();
    expect(document.querySelector(`a[href="/categories/2"]`)).toBeInTheDocument();
  });
});

describe('CategoryPage', () => {
  // Mock the fetch function
  global.fetch = jest.fn();

  // Mock data
  const mockCategory = {
    id: '1',
    name: 'Electronics',
    description: 'Electronic devices',
    image: '/images/electronics.jpg',
    slug: 'electronics'
  };
  
  const mockProducts = [
    { id: '1', name: 'Smartphone', price: 999, description: 'Latest model', images: ['/images/smartphone.jpg'], categories: ['electronics'] },
    { id: '2', name: 'Laptop', price: 1499, description: 'Powerful laptop', images: ['/images/laptop.jpg'], categories: ['electronics'] },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading state when category data is loading', () => {
    (useApi as jest.Mock).mockReturnValue({ data: null, isLoading: true, error: null });
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockProducts }),
    });
    
    render(<CategoryPage params={{ categoryId: '1' }} />);
    
    expect(screen.getByText('Back to Categories')).toBeInTheDocument();
    // Check for loading indicators
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  test('displays error message when category fetch fails', () => {
    const mockError = new Error('Failed to fetch category');
    (useApi as jest.Mock).mockReturnValue({ data: null, isLoading: false, error: mockError });
    
    render(<CategoryPage params={{ categoryId: '1' }} />);
    
    expect(screen.getByText('Error loading category')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch category')).toBeInTheDocument();
  });

  test('displays category not found when category does not exist', () => {
    (useApi as jest.Mock).mockReturnValue({ data: null, isLoading: false, error: null });
    
    render(<CategoryPage params={{ categoryId: '999' }} />);
    
    expect(screen.getByText('Category Not Found')).toBeInTheDocument();
    expect(screen.getByText('Category not found')).toBeInTheDocument();
    expect(screen.getByText('Browse all categories')).toBeInTheDocument();
  });

  test('displays products when category and products load successfully', async () => {
    (useApi as jest.Mock).mockReturnValue({ data: mockCategory, isLoading: false, error: null });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockProducts }),
    });
    
    await act(async () => {
      render(<CategoryPage params={{ categoryId: '1' }} />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Electronics')).toBeInTheDocument();
      expect(screen.getByText('Electronic devices')).toBeInTheDocument();
      expect(screen.getByText('Smartphone')).toBeInTheDocument();
      expect(screen.getByText('Laptop')).toBeInTheDocument();
    });
  });

  test('displays error when products fetch fails', async () => {
    (useApi as jest.Mock).mockReturnValue({ data: mockCategory, isLoading: false, error: null });
    
    // Mock fetch with a rejected promise to simulate error
    (global.fetch as jest.Mock).mockImplementation(() => 
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      })
    );
    
    await act(async () => {
      render(<CategoryPage params={{ categoryId: '1' }} />);
    });
    
    // Ensure we wait for all state updates to complete
    await waitFor(() => {
      // Check for any error message text that might be displayed
      expect(screen.getAllByText(/error/i).length).toBeGreaterThan(0);
    });
  });

  // Update empty state test to use act() too
  test('displays empty state when category has no products', async () => {
    (useApi as jest.Mock).mockReturnValue({ data: mockCategory, isLoading: false, error: null });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] }),
    });
    
    await act(async () => {
      render(<CategoryPage params={{ categoryId: '1' }} />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Electronics')).toBeInTheDocument();
      expect(screen.getByText('No products found')).toBeInTheDocument();
      expect(screen.getByText('There are no products in this category yet.')).toBeInTheDocument();
    });
  });

  test('back button navigates to categories page', () => {
    (useApi as jest.Mock).mockReturnValue({ data: mockCategory, isLoading: false, error: null });
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockProducts }),
    });
    
    render(<CategoryPage params={{ categoryId: '1' }} />);
    
    const backButton = screen.getByText('Back to Categories');
    expect(backButton).toBeInTheDocument();
    expect(backButton.closest('a')).toHaveAttribute('href', '/categories');
  });
});
