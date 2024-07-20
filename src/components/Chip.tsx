import React from "react";
import { PropsWithChildren } from "react";

export const Chip = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => (
  <span
    className={`rounded-md bg-emerald-600 px-2 text-xs font-semibold text-white ${className ?? ""}`}
  >
    {children}
  </span>
);
