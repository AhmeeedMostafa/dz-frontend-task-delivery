"use client";

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PriceFormatter } from '@/components/price-formatter';
import { useCart } from '@/lib/cart-context';
import { useApi } from '@/hooks/use-api';
import { Product } from '@/types/app';
import { PageHeader } from '~/src/components/page-header';
import { EmptyState } from '~/src/components/empty-state';
import { ErrorMessage } from '~/src/components/error-message';
import { SectionHeader } from '~/src/components/section-header';
import { BackButton } from '~/src/components/back-button';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductPage({ params }: { params: { productId: string } }) {
  const { data: product, isLoading, error } = useApi<Product>(`/products/${params.productId}`);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (product) {
      addItem(product);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <BackButton href="/products" label="Back to Products" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="space-y-4">
          <div className="mb-8">
            <Skeleton className="h-8 w-1/4 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <BackButton href="/products" label="Back to Products" />
        <ErrorMessage 
          title="Error loading product" 
          message={error.message} 
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <PageHeader title="Product Not Found" />
        <EmptyState
          title="Product not found"
          description="The product you're looking for doesn't exist or has been removed."
          actionLabel="Browse all products"
          actionHref="/products"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton href="/products" label="Back to Products" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product images */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg border">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Image gallery */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-square relative overflow-hidden rounded-md border ${
                    i === selectedImage ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - Image ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 10vw"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product details */}
        <div className="space-y-4">
          <PageHeader title={product.name} />

          <div className="text-2xl font-semibold">
            <PriceFormatter price={product.price} />
          </div>

          <div className="prose prose-sm max-w-none">
            <p>{product.description}</p>
          </div>

          <div className="pt-4">
            <Button size="lg" onClick={handleAddToCart} className="w-full sm:w-auto">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>

          {/* Product categories */}
          {product.categories.length > 0 && (
            <div className="pt-4 border-t">
              <SectionHeader title="Categories" />
              <div className="flex flex-wrap gap-2">
                {product.categories.map((categorySlug) => (
                  <span
                    key={categorySlug}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted hover:bg-muted/80"
                  >
                    {categorySlug.replace(/-/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
