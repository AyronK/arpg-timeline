import { PropsWithChildren } from "react";

export const TrailingBorder = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex w-full items-center before:flex-1 before:overflow-hidden before:whitespace-nowrap before:border-t before:border-foreground before:text-right before:opacity-75 before:content-[''] after:flex-1 after:overflow-hidden after:whitespace-nowrap after:border-t after:border-foreground after:opacity-75 after:content-['']">
      <div className="mx-3">{children}</div>
    </div>
  );
};

