"use client";

import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PriceFormatter } from '@/components/price-formatter';
import { useCart } from '@/lib/cart-context';
import { Separator } from '@/components/ui/separator';
import { CartItem } from '@/components/cart-item';
import { useHydrated } from '~/src/hooks/use-hydrated';
import CartPageSkeleton from './cart-page-skeleton';

export default function CartPage() {
  const { items, total, totalItems, isLoading } = useCart();
  const isHydrated = useHydrated();

  // Show loading UI during server rendering or before hydration
  if (!isHydrated || isLoading) {
    return <CartPageSkeleton />
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="mb-6 text-muted-foreground">Looks like you haven&apos;t added any products to your cart yet.</p>
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="border rounded-lg overflow-hidden">
            <div className="p-4 bg-muted/50 font-medium grid grid-cols-5 gap-4">
              <span className="col-span-2">Product</span>
              <span className="text-center">Price</span>
              <span className="text-center">Quantity</span>
              <span className="text-right">Total</span>
            </div>

            <div className="divide-y">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  id={item.id}
                  product={item.product}
                  quantity={item.quantity}
                />
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <PriceFormatter price={total} />
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-semibold text-lg mb-6">
              <span>Total</span>
              <PriceFormatter price={total} />
            </div>

            <Link href="/checkout">
              <Button className="w-full">
                Proceed to Checkout ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}