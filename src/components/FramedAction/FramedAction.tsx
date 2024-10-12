import { PropsWithChildren, ReactNode } from "react";

export const FramedAction = ({
  children,
  action,
}: PropsWithChildren<{ action: ReactNode }>) => {
  return (
    <div className="relative mt-2 flex flex-row overflow-hidden rounded-md border border-emerald-800">
      <div className="flex h-[32px] flex-1 items-center justify-center bg-background md:h-[40px]">
        {children}
      </div>
      <div className="bg-emerald-800 transition-all hover:brightness-110">
        {action}
      </div>
    </div>
  );
};
