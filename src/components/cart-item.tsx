"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PriceFormatter } from '@/components/price-formatter';
import { useCart } from '@/lib/cart-context';
import { Product } from '@/types/app';
import { Skeleton } from '@/components/ui/skeleton';

interface CartItemProps {
  product: Product;
  quantity: number;
  id: string;
}

export function CartItem({ product, quantity, id }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  // Handle quantity changes
  const handleIncrease = () => {
    updateQuantity(id, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      updateQuantity(id, quantity - 1);
    } else {
      removeItem(id);
    }
  };

  const handleRemove = () => {
    removeItem(id);
  };

  // Calculate item total
  const total = product.price.amount * quantity;
  const itemTotal = {
    amount: total,
    currency: product.price.currency,
  };

  return (
    <div className="flex flex-col sm:flex-row items-start gap-4 py-4 border-b">
      {/* Product image */}
      <div className="w-full sm:w-24 h-24 relative rounded-md overflow-hidden flex-shrink-0">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100px, 96px"
        />
      </div>

      {/* Product details */}
      <div className="flex-1 min-w-0 space-y-1">
        <Link href={`/products/${id}`} className="hover:underline">
          <h3 className="font-semibold truncate">{product.name}</h3>
        </Link>
        <div className="text-sm text-muted-foreground">
          <PriceFormatter price={product.price} /> × {quantity}
        </div>
      </div>

      {/* Quantity controls and price */}
      <div className="w-full sm:w-auto flex flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleDecrease}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleIncrease}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="font-medium">
          <PriceFormatter price={itemTotal} />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={handleRemove}
          aria-label="Remove item"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Skeleton loader for cart items
export function CartItemSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row items-start gap-4 py-4 border-b">
      <Skeleton className="w-full sm:w-24 h-24 rounded-md flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      <div className="w-full sm:w-auto flex flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-1">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-6 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
        <Skeleton className="h-6 w-16 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </div>
  );
}