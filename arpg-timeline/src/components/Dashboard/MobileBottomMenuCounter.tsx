import { cn } from "@/lib/utils";

interface MobileBottomMenuCounterProps {
    // Null while the Featured filters load
    label: string | null;
    onClick?: () => void;
}

export function MobileBottomMenuCounter({ label, onClick }: MobileBottomMenuCounterProps) {
    const className =
        "origin-bottom-right rounded-tl-md border-t border-slate-500 bg-gray-600 px-3 py-1 text-xs font-medium text-white";
    const text = <span className={cn({ invisible: !label })}>{label ?? "Featured preset"}</span>;

    return (
        <div className="absolute top-0 right-0 -z-10 -translate-y-full">
            <div className="relative z-10 flex items-center">
                <div className="absolute top-[7px] left-[-17px] -z-10">
                    <div className="h-10 w-10 rotate-45 rounded-md border-l border-slate-500 bg-gray-600"></div>
                </div>
                {onClick ? (
                    <button type="button" onClick={onClick} className={className}>
                        {text}
                    </button>
                ) : (
                    <div className={className}>{text}</div>
                )}
            </div>
        </div>
    );
}
