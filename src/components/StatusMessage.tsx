import type { LucideIcon } from "lucide-react";

import { SearchBox } from "./SearchBox";

type StatusMessageProps = {
  icon: LucideIcon;
  title: string;
  description?: React.ReactNode;
  showSearch?: boolean;
};

export function StatusMessage({
  icon: Icon,
  title,
  description,
  showSearch = true,
}: StatusMessageProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary">
        <Icon className="h-7 w-7" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {description && (
        <p className="mt-2 text-muted-foreground">{description}</p>
      )}
      {showSearch && <SearchBox className="mt-8" autoFocus />}
    </div>
  );
}
