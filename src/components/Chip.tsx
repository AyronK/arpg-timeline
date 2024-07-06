import React from "react";
import { PropsWithChildren } from "react";

export const Chip = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => (
  <span
    className={`px-2 font-semibold rounded-md text-xs text-white bg-emerald-600 ${className ?? ""}`}
  >
    {children}
  </span>
);
