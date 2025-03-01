import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 bg-muted/30 rounded-lg">
      <h2 className="text-xl font-medium mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6">{description}</p>

      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button>{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
}