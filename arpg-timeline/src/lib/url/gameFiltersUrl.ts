export const updateUrlFilters = (excludedSlugs: string[]): void => {
    const params = new URLSearchParams();

    if (excludedSlugs.length > 0) {
        excludedSlugs.forEach((slug) => {
            params.append("exclude", slug);
        });
    }

    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    window.history.pushState({}, "", newUrl);
};

export const getUrlFilters = (searchParams: URLSearchParams): string[] => {
    return searchParams.getAll("exclude");
};
