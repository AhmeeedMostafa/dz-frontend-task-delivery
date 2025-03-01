"use client";

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PriceFormatter } from '@/components/price-formatter';
import { formatDate } from '@/lib/utils';
import { useApi } from '@/hooks/use-api';
import { Order } from '@/types/app';
import { Separator } from '@/components/ui/separator';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { data: order, isLoading, error } = useApi<Order>(`/orders/${params.id}`);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
        <p className="mb-6">{error.message}</p>
        <Link href="/orders">
          <Button>Return to Orders</Button>
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="mb-6">The order you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link href="/orders">
          <Button>Return to Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/orders" className="inline-flex items-center text-sm hover:text-primary mb-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Order #{order.id}</h1>
            <p className="text-muted-foreground">{formatDate(order.timestamp)}</p>
          </div>
          <div className="flex-shrink-0">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              order.status === 'COMPLETED' 
                ? 'bg-green-100 text-green-800' 
                : order.status === 'CANCELLED'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {order.status}
            </span>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Order Summary and Customer Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-2 border rounded-lg overflow-hidden">
          <div className="bg-muted/50 p-4 font-medium">
            Order Items
          </div>
          <div className="divide-y">
            {order.cart.items.map((item) => (
              <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-medium">
                    {item.type}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    ID: #{item.referenceId.substring(0, 8)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity || 1}
                  </p>
                </div>
                <div className="text-right mt-2 sm:mt-0">
                  <p className="text-sm text-muted-foreground">
                    <PriceFormatter price={item.price} /> × {item.quantity || 1}
                  </p>
                  <p className="font-medium">
                    <PriceFormatter
                      price={{
                        amount: item.price.amount * (item.quantity || 1),
                        currency: item.price.currency,
                      }}
                    />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {/* Order Summary */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted/50 p-4 font-medium">
              Order Summary
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span><PriceFormatter price={order.cart.subtotal} /></span>
              </div>
              <div className="flex justify-between">
                <span>Tax ({(order.cart.tax * 100).toFixed(0)}%)</span>
                <span>
                  <PriceFormatter
                    price={{
                      amount: order.cart.subtotal.amount * order.cart.tax,
                      currency: order.cart.subtotal.currency,
                    }}
                  />
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between pt-1 font-medium">
                <span>Total</span>
                <span className="text-lg">
                  <PriceFormatter price={order.cart.total} />
                </span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted/50 p-4 font-medium">
              Customer Information
            </div>
            <div className="p-4 space-y-3">
              <div>
                <span className="block text-sm text-muted-foreground">Name</span>
                <span className="font-medium">{order.user.name}</span>
              </div>
              <div>
                <span className="block text-sm text-muted-foreground">Customer ID</span>
                <span className="font-mono text-sm">#{order.user.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 