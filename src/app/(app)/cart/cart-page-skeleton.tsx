import { CartItemSkeleton } from "~/src/components/cart-item";

export default function CartPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="border rounded-lg overflow-hidden">
            <div className="p-4 bg-muted/50 font-medium">Loading your cart...</div>
            <div className="divide-y">
              {Array.from({ length: 3 }).map((_, index) => (
                <CartItemSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4 animate-pulse">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <div className="h-5 w-16 bg-muted rounded"></div>
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
          </div>
        </div>
      </div>
    </div>
  );
}