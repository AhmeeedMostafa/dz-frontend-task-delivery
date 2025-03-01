"use client";

import { ProductCard } from '@/components/product-card';
import { useApi } from '@/hooks/use-api';
import { Product } from '@/types/app';
import { PageHeader } from '~/src/components/page-header';
import { EmptyState } from '~/src/components/empty-state';
import { ErrorMessage } from '~/src/components/error-message';
import { ProductSkeleton } from '~/src/components/product-skeleton';

export default function ProductsPage() {
  const { data, isLoading, error } = useApi<Product[]>('/products');

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Products" />

      {isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      )}

      {error && !isLoading && (
        <ErrorMessage
          title="Error loading products"
          message={error.message}
        />
      )}

      {!isLoading && !error && (!data || data.length === 0) && (
        <EmptyState
          title="No products found"
          description="There are no products available at this time."
        />
      )}

      {!isLoading && !error && data && data.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
