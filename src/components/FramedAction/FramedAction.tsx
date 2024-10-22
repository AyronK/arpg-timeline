import { PropsWithChildren, ReactNode } from "react";

export const FramedAction = ({
  children,
  action,
}: PropsWithChildren<{ action: ReactNode }>) => {
  return (
    <div className="relative flex flex-row overflow-hidden rounded-md">
      <div className="flex h-[32px] flex-1 items-center justify-center bg-background md:h-[40px]">
        {children}
      </div>
      <div className="bg-emerald-800 transition-all hover:brightness-110">
        {action}
      </div>
    </div>
  );
};
