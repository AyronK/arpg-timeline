import { cn } from "@/lib/utils";
import { PropsWithChildren, ReactNode } from "react";

export const FramedAction = ({
  children,
  append,
  appendClassName,
  prepend,
  prependClassName,
}: PropsWithChildren<{
  append?: ReactNode;
  prepend?: ReactNode;
  appendClassName?: string | undefined;
  prependClassName?: string | undefined;
}>) => {
  return (
    <div className="relative flex flex-row overflow-hidden rounded-md border border-slate-300/25">
      {prepend && (
        <div
          className={cn(
            "bg-sky-800 transition-all hover:brightness-110",
            prependClassName,
          )}
        >
          {prepend}
        </div>
      )}
      <div className="flex h-[32px] flex-1 items-center justify-center bg-slate-300/5 md:h-[40px]">
        {children}
      </div>
      {append && (
        <div
          className={cn(
            "bg-emerald-800 transition-all hover:brightness-110",
            appendClassName,
          )}
        >
          {append}
        </div>
      )}
    </div>
  );
};
