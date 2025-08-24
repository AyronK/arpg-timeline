interface MobileBottomMenuCounterProps {
    shownGames: number;
    totalGames: number;
}

export function MobileBottomMenuCounter({ shownGames, totalGames }: MobileBottomMenuCounterProps) {
    return (
        <div className="absolute top-0 right-0 -z-10 -translate-y-full">
            <div className="relative z-10 flex items-center">
                <div className="absolute top-[7px] left-[-17px] -z-10">
                    <div className="h-10 w-10 rotate-45 rounded-md border-l border-slate-500 bg-gray-600"></div>
                </div>
                <div className="origin-bottom-right rounded-tl-md border-t border-slate-500 bg-gray-600 px-3 py-1 text-xs font-medium text-white">
                    Showing {shownGames} of {totalGames}
                </div>
            </div>
        </div>
    );
}
