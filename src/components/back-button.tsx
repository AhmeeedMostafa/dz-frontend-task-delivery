import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  href: string;
  label?: string;
  className?: string;
}

export function BackButton({ 
  href, 
  label = 'Back', 
  className = '' 
}: BackButtonProps) {
  return (
    <Link 
      href={href} 
      className={`inline-flex items-center text-sm mb-6 hover:text-primary ${className}`}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      {label}
    </Link>
  );
} 