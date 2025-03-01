import { Price } from '@/types/app';

interface PriceFormatterProps {
  price: Price;
  className?: string;
}

export function PriceFormatter({ price, className = '' }: PriceFormatterProps) {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currency,
  }).format(price.amount);

  return <span className={className}>{formatted}</span>;
}