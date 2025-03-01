import { Skeleton } from "@/components/ui/skeleton";

export function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <Skeleton className="aspect-square rounded-md" />
      <Skeleton className="mt-2 h-4 w-3/4" />
      <Skeleton className="mt-1 h-4 w-1/4" />
      <Skeleton className="mt-2 h-8" />
    </div>
  );
}