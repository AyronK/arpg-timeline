import { PropsWithChildren } from "react";

export const Chip = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => (
  <span
    className={`origin-bottom-right scale-90 rounded-md px-3 py-0.5 font-ui text-xs font-semibold text-white md:scale-100 ${className ?? ""}`}
  >
    {children}
  </span>
);
