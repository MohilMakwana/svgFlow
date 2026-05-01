// ===== Empty State =====

import { FileX2 } from 'lucide-react';

export default function EmptyState({ title, description, icon: Icon = FileX2 }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 h-full p-6 text-center text-muted-foreground">
      <div className="p-4 rounded-full bg-muted/50 mb-2">
        <Icon className="h-8 w-8 opacity-50" />
      </div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description && <p className="text-xs max-w-[200px]">{description}</p>}
    </div>
  );
}
