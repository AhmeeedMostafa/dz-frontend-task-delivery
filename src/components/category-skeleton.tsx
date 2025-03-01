import { Skeleton } from "@/components/ui/skeleton";

export function CategorySkeleton() {
  return (
    <div className="animate-pulse" data-testid="category-skeleton">
      <Skeleton className="aspect-video rounded-md" />
      <Skeleton className="mt-2 h-6 w-1/2" />
      <Skeleton className="mt-1 h-4 w-3/4" />
    </div>
  );
} 