"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PriceFormatter } from '@/components/price-formatter';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/lib/cart-context';
import { usePostApi } from '@/hooks/use-post-api';
import { toast } from 'sonner';
import { useHydrated } from '~/src/hooks/use-hydrated';
import { TAX_RATE } from '~/src/config/constants';
import CheckoutPageSkeleton from './checkout-page-skeleton';

type CheckoutFormValues = {
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart, isLoading } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isHydrated = useHydrated();

  const { post: submitOrder, isLoading: isSubmittingOrder } = usePostApi('/checkout');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    defaultValues: {
      name: '',
      email: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
    },
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      setIsSubmitting(true);

      const orderData = {
        user: {
          id: Math.random().toString(36).substring(2, 10),
          name: data.name,
          email: data.email,
          shipping: {
            address: data.address,
            city: data.city,
            postalCode: data.postalCode,
            country: data.country,
          }
        },
        products: items.map(item => ({
          id: item.id,
          quantity: item.quantity
        }))
      };

      const isSuccess = await submitOrder(orderData);

      if (isSuccess) {
        toast.success('Order placed successfully, redirecting to orders page!');
        clearCart();
        router.push('/orders');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading UI during server rendering or before hydration
  if (!isHydrated || isLoading) {
    return <CheckoutPageSkeleton />
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="mb-6">Add some products to your cart to continue with checkout.</p>
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/cart" className="inline-flex items-center text-sm hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart
        </Link>
        <h1 className="text-3xl font-bold mt-2">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    }
                  })}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="123 Main St"
                {...register('address', { required: 'Address is required' })}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="New York"
                  {...register('city', { required: 'City is required' })}
                />
                {errors.city && (
                  <p className="text-sm text-red-500">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  placeholder="10001"
                  {...register('postalCode', { required: 'Postal code is required' })}
                />
                {errors.postalCode && (
                  <p className="text-sm text-red-500">{errors.postalCode.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  placeholder="United States"
                  {...register('country', { required: 'Country is required' })}
                />
                {errors.country && (
                  <p className="text-sm text-red-500">{errors.country.message}</p>
                )}
              </div>
            </div>

            <div className="hidden lg:block">
              <Button
                type="submit"
                className="w-full mt-6"
                disabled={isLoading || isSubmitting || isSubmittingOrder}
              >
                {(isSubmitting || isSubmittingOrder) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Place Order
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        <div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <PriceFormatter
                    price={{
                      amount: item.product.price.amount * item.quantity,
                      currency: item.product.price.currency,
                    }}
                  />
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <PriceFormatter price={total} />
              </div>
              <div className="flex justify-between">
                <span>Tax (${TAX_RATE * 100}%)</span>
                <PriceFormatter
                  price={{
                    amount: total.amount * TAX_RATE,
                    currency: total.currency,
                  }}
                />
              </div>
              <div className="flex justify-between font-semibold text-lg pt-3 border-t">
                <span>Total</span>
                <PriceFormatter
                  price={{
                    amount: total.amount + total.amount * TAX_RATE,
                    currency: total.currency,
                  }}
                />
              </div>
            </div>

            <Button
              type="submit"
              form="checkout-form"
              className="w-full mt-6 lg:hidden"
              disabled={isLoading || isSubmitting || isSubmittingOrder}
            >
              {(isSubmitting || isSubmittingOrder) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Place Order
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
