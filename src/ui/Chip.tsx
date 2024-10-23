import { PropsWithChildren } from "react";

export const Chip = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => (
  <span
    className={`rounded-md px-2 py-[1px] font-ui text-xs font-semibold text-foreground ${className ?? ""}`}
  >
    {children}
  </span>
);
