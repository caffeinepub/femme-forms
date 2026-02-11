import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        {icon && <div className="mx-auto mb-4 text-muted-foreground">{icon}</div>}
        <h3 className="font-display text-xl font-semibold">{title}</h3>
        {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
        {action && <div className="mt-6">{action}</div>}
      </div>
    </div>
  );
}
