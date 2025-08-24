import { ChartGantt } from "lucide-react";

import { DashboardTag } from "@/lib/cms/gameTags";
import { Button } from "@/ui/Button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/ui/DropdownMenu";

import { DashboardConfig } from "./DashboardConfig";
import { DashboardSelector } from "./DashboardSelector";

interface MobileBottomMenuCenterProps {
    dashboard: DashboardTag;
    onLoadingChange: (loading: boolean) => void;
}

export function MobileBottomMenuCenter({
    dashboard,
    onLoadingChange,
}: MobileBottomMenuCenterProps) {
    return (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <DropdownMenu>
                <DropdownMenuContent
                    className="w-screen rounded-b-none! border-2 border-slate-500 bg-gray-800 p-2 pb-6! shadow-2xl"
                    align="center"
                    sideOffset={-32}
                    collisionPadding={0}
                >
                    <div className="mb-2 text-center">
                        <h3 className="text-sm font-medium text-white">Select Dashboard</h3>
                    </div>
                    <DashboardSelector
                        dashboard={dashboard}
                        onLoadingChange={onLoadingChange}
                        isMobile
                    />
                </DropdownMenuContent>
                <DropdownMenuTrigger asChild>
                    <Button
                        className="flex h-11 w-11 rotate-45 transform flex-col items-center justify-center border-2 border-slate-500 bg-gray-800 hover:bg-gray-700"
                        data-sa-click="dashboard-selector"
                    >
                        <div className="-rotate-45 transform">
                            {(() => {
                                const config = DashboardConfig[dashboard];
                                const IconComponent = config?.icon;
                                return IconComponent ? (
                                    <IconComponent className="h-6 w-6 text-white" />
                                ) : (
                                    <ChartGantt className="h-6 w-6 text-white" />
                                );
                            })()}
                        </div>
                    </Button>
                </DropdownMenuTrigger>
            </DropdownMenu>
            <div className="absolute left-1/2 mt-3.5 -translate-x-1/2 text-center">
                <div className="text-[0.65rem] font-bold text-nowrap">
                    {DashboardConfig[dashboard]?.description ?? "aRPG"}
                </div>
            </div>
        </div>
    );
}
