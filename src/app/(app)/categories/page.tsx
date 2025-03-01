"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useApi } from '@/hooks/use-api';
import { Category } from '@/types/app';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '~/src/components/page-header';
import { EmptyState } from '~/src/components/empty-state';
import { ErrorMessage } from '~/src/components/error-message';
import { CategorySkeleton } from '~/src/components/category-skeleton';

export default function CategoriesPage() {
  const { data: categories, isLoading, error } = useApi<Category[]>('/categories');

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Categories" />

      {isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <CategorySkeleton key={i} />
          ))}
        </div>
      )}

      {error && (
        <ErrorMessage
          title="Error loading categories"
          message={error.message}
        />
      )}

      {!isLoading && !error && (!categories || categories.length === 0) && (
        <EmptyState
          title="No categories found"
          description="There are no product categories available at this time."
        />
      )}

      {!isLoading && !error && categories && categories.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.id}`}>
              <Card className="overflow-hidden transition-all hover:shadow-md">
                <div className="aspect-video relative">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

