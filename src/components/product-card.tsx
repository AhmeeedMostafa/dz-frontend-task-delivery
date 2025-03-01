"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Eye } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart-context';
import { Product } from '@/types/app';
import { PriceFormatter } from '@/components/price-formatter';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={500}
            height={500}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold">{product.name}</h3>
        </Link>
        <p className="mt-1 text-md font-medium">
          <PriceFormatter price={product.price} />
        </p>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        <Button
          variant="default"
          size="sm"
          className="flex-1"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Basket
        </Button>
        <Link href={`/products/${product.id}`} className="flex-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
          >
            <Eye className="mr-2 h-4 w-4" />
            View Product
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}