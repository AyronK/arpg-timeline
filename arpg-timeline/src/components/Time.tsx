import { cn } from "@/lib/utils";

export const Time = ({
    component,
    char,
    className,
    pad = true,
}: {
    component: string | number;
    char: string;
    className?: string | undefined;
    pad?: boolean | undefined;
}) => (
    <div className={cn(className, "flex flex-row items-end gap-[3px]")}>
        {pad && (
            <div
                suppressHydrationWarning
                className="ml-auto w-[12px] max-w-[12px] min-w-[12px] text-center"
            >
                {String(component).padStart(2, "0")[0]}
            </div>
        )}
        <div
            suppressHydrationWarning
            className="mr-auto w-[12px] max-w-[12px] min-w-[12px] text-center"
        >
            {String(component).padStart(2, "0")[1]}
        </div>
        <span className="text-sm text-emerald-600 md:text-base mb-[2px] md:mb-[1px]">{char}</span>
    </div>
);
