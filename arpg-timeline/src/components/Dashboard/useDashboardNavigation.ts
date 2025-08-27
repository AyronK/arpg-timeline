import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const useDashboardNavigation = (onLoadingChange: (loading: boolean) => void) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const handleDashboardChange = (value: string) => {
        if (value === "featured") {
            const currentParams = searchParams.toString();
            const newUrl = currentParams ? `/?${currentParams}` : "/";

            if (pathname === "/" && !currentParams) {
                return;
            }

            onLoadingChange(true);
            router.push(newUrl);
        } else if (value === "everything") {
            const currentParams = searchParams.toString();
            const newUrl = currentParams
                ? `/dashboard/everything?${currentParams}`
                : `/dashboard/everything`;

            if (pathname === "/dashboard/everything") {
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
