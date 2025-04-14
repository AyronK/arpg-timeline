import { PropsWithChildren, ReactNode } from "react";

export const FramedAction = ({
  children,
  append,
  prepend,
}: PropsWithChildren<{ append?: ReactNode; prepend?: ReactNode }>) => {
  return (
    <div className="relative flex flex-row overflow-hidden rounded-md border border-slate-300 border-opacity-25">
      {prepend && (
        <div className="bg-sky-800 transition-all hover:brightness-110">
          {prepend}
        </div>
      )}
      <div className="flex h-[32px] flex-1 items-center justify-center bg-slate-300 bg-opacity-5 md:h-[40px]">
        {children}
      </div>
      {append && (
        <div className="bg-emerald-800 transition-all hover:brightness-110">
          {append}
        </div>
      )}
    </div>
  );
};
