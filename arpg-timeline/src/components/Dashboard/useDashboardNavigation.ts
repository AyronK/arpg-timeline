import { useRouter, useSearchParams } from "next/navigation";

export const useDashboardNavigation = (onLoadingChange: (loading: boolean) => void) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleDashboardChange = (value: string) => {
        if (value === "default-when-next-confirmed") {
            onLoadingChange(true);
            const currentParams = searchParams.toString();
            const newUrl = currentParams ? `/?${currentParams}` : "/";
            router.push(newUrl);
        } else if (value === "everything") {
            onLoadingChange(true);
            const currentParams = searchParams.toString();
            const newUrl = currentParams
                ? `/dashboard/everything?${currentParams}`
                : `/dashboard/everything`;
            router.push(newUrl);
        } else if (value) {
            onLoadingChange(true);
            const currentParams = searchParams.toString();
            const newUrl = currentParams
                ? `/dashboard/${value}?${currentParams}`
                : `/dashboard/${value}`;
            router.push(newUrl);
        }
    };

    return { handleDashboardChange };
};
