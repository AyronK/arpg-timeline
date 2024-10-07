import { PropsWithChildren } from "react";

export const Chip = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => (
  <span
    className={`bg-nextSeason rounded-md px-2 text-xs font-semibold text-white ${className ?? ""}`}
  >
    {children}
  </span>
);
