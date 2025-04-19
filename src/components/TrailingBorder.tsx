import { PropsWithChildren } from "react";

export const TrailingBorder = ({ children }: PropsWithChildren) => {
  return (
    <div className="relative mx-2 flex w-full items-center before:-z-1 before:flex-1 before:border-b before:border-emerald-950 after:-z-1 after:flex-1 after:border-b after:border-emerald-950 after:whitespace-nowrap">
      <div className="mx-2">{children}</div>
    </div>
  );
};
