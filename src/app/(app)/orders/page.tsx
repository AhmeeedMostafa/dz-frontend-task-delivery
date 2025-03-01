"use client";

import Link from 'next/link';
import { PriceFormatter } from '@/components/price-formatter';
import { formatDate } from '@/lib/utils';
import { useApi } from '@/hooks/use-api';
import { Order } from '@/types/app';

export default function OrdersPage() {
  const { data: orders, isLoading, error } = useApi<Order[]>('/orders');

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-24 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Error loading orders</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <h2 className="text-xl font-medium mb-2">No orders found</h2>
          <p className="text-muted-foreground mb-6">You haven&apos;t placed any orders yet.</p>
          <Link href="/products" className="text-primary hover:underline">
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="rounded-lg border shadow-sm overflow-hidden">
            <div className="p-4 bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Order placed on {formatDate(order.timestamp)}
                </p>
                <p className="text-sm font-medium">Order #{order.id}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="font-semibold">
                    <PriceFormatter price={order.cart.total} />
                  </p>
                </div>

                <Link 
                  href={`/orders/${order.id}`}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90"
                >
                  View details
                </Link>
              </div>
            </div>

            <div className="p-4 border-t">
              <p className="text-sm font-medium mb-2">
                {order.cart.items.length} {order.cart.items.length === 1 ? 'item' : 'items'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {order.cart.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted/50 rounded flex items-center justify-center text-muted-foreground">
                      {item.quantity || 1}x
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.type}</p>
                      <p className="text-sm text-muted-foreground">
                        <PriceFormatter price={item.price} />
                      </p>
                    </div>
                  </div>
                ))}
                {order.cart.items.length > 3 && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    +{order.cart.items.length - 3} more items
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
