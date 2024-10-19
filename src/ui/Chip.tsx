import { PropsWithChildren } from "react";

export const Chip = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => (
  <span
    className={`rounded-md px-3 py-0.5 font-ui text-xs font-semibold text-white ${className ?? ""}`}
  >
    {children}
  </span>
);
