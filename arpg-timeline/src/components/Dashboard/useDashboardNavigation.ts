import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { DashboardOption } from "./DashboardConfig";

export const useDashboardNavigation = (onLoadingChange: (loading: boolean) => void) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const handleDashboardChange = (value: DashboardOption) => {
        if (value === "featured") {
            const currentParams = searchParams.toString();
            const newUrl = currentParams ? `/?${currentParams}` : "/";

            if (pathname === "/" && !currentParams) {
                return;
            }

            onLoadingChange(true);
            router.push(newUrl);
        } else if (value === "news") {
            const currentParams = searchParams.toString();
            const newUrl = currentParams ? `/news?${currentParams}` : "/news";

            if (pathname === "/news") {
                return;
            }

            onLoadingChange(true);
            router.push(newUrl);
        } else if (value) {
            const currentParams = searchParams.toString();
            const newUrl = currentParams
                ? `/dashboard/${value}?${currentParams}`
                : `/dashboard/${value}`;

            if (pathname === `/dashboard/${value}`) {
                return;
            }

            onLoadingChange(true);
            router.push(newUrl);
        }
    };

    return { handleDashboardChange };
};
