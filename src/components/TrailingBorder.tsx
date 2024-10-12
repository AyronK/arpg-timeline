import { PropsWithChildren } from "react";

export const TrailingBorder = ({ children }: PropsWithChildren) => {
  return (
    <div className="before:-z-1 after:-z-1 relative flex w-full items-center before:flex-1 before:border-b before:border-emerald-800 before:shadow-sm before:shadow-emerald-300 after:flex-1 after:whitespace-nowrap after:border-b after:border-emerald-800 after:shadow-sm after:shadow-emerald-300">
      {children}
    </div>
  );
};
