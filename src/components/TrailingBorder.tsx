import { PropsWithChildren } from "react";

export const TrailingBorder = ({ children }: PropsWithChildren) => {
  return (
    <div className="before:-z-1 after:-z-1 relative mx-2 flex w-full items-center before:flex-1 before:border-b before:border-emerald-950 after:flex-1 after:whitespace-nowrap after:border-b after:border-emerald-950">
      <div className="mx-2">{children}</div>
    </div>
  );
};
