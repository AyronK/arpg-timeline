import { PropsWithChildren, ReactNode } from "react";

import { cn } from "@/lib/utils";

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
        <div className="relative flex flex-row rounded-md shadow-sm transition-all">
            {prepend && (
                <div
                    className={cn(
                        "z-10 -mr-px rounded-l-md bg-slate-700 text-white transition-colors focus-within:ring-2 focus-within:ring-slate-500/50 hover:bg-slate-600 active:bg-slate-800",
                        prependClassName,
                    )}
                >
                    {prepend}
                </div>
            )}
            <div className="z-0 flex h-full flex-1 items-center justify-center bg-slate-50/50 px-3 md:h-[40px] dark:bg-slate-800/40">
                {children}
            </div>
            {append && (
                <div
                    className={cn(
                        "z-10 -ml-px rounded-r-md bg-emerald-800 text-white transition-colors focus-within:ring-2 focus-within:ring-emerald-600/50 hover:bg-emerald-700 active:bg-emerald-900",
                        appendClassName,
                    )}
                >
                    {append}
                </div>
            )}
        </div>
    );
};
