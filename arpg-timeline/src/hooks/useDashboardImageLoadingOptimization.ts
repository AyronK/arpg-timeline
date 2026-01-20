import { useBreakpoint } from "./useBreakpoint";

export function useDashboardImageLoadingOptimization() {
    const { isMd } = useBreakpoint("md");

    const shouldLoadImage = (index: number) => {
        if (isMd) {
            return index < 10;
        } else {
            return index < 2;
        }
    };

    return { shouldLoadImage };
}
