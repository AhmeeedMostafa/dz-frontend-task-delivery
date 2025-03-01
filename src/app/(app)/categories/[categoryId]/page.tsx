"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useApi } from '@/hooks/use-api';
import { Category, Product } from '@/types/app';
import { ProductCard } from '@/components/product-card';
import { PageHeader } from '~/src/components/page-header';
import { EmptyState } from '~/src/components/empty-state';
import { ErrorMessage } from '~/src/components/error-message';
import { ProductSkeleton } from '~/src/components/product-skeleton';

export default function CategoryPage({ params }: { params: { categoryId: string } }) {
  const { data: category, isLoading: categoryLoading, error: categoryError } = 
    useApi<Category>(`/categories/${params.categoryId}`);

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch products for this category
  useEffect(() => {
    if (!category) return;
  
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/products?category=${category.slug}`);

        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const { data: categoryProducts } = await response.json();
        setProducts(categoryProducts);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const isDataLoading = categoryLoading || isLoading;
  const dataError = categoryError || error;

  const backButton = (
    <Link href="/categories" className="inline-flex items-center text-sm mb-6 hover:text-primary">
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back to Categories
    </Link>
  );

  if (dataError) {
    return (
      <div className="container mx-auto px-4 py-8">
        {backButton}
        <ErrorMessage
          title="Error loading category"
          message={dataError.message}
        />
      </div>
    );
  }

  if (!category && !categoryLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <PageHeader title="Category Not Found" />
        <EmptyState
          title="Category not found"
          description="The category you're looking for doesn't exist or has been removed."
          actionLabel="Browse all categories"
          actionHref="/categories"
        />
      </div>
    );
  }

  if (isDataLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        {backButton}
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse mb-6"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse mb-8"></div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {backButton}

      <PageHeader
        title={category?.name || 'Category'}
        description={category?.description}
      />

      {products.length === 0 ? (
        <EmptyState
          title="No products found"
          description="There are no products in this category yet."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
