import { ComponentType } from "react";

interface ResponsiveProps {
    isMobile?: boolean;
}

export function withResponsiveRendering<T extends ResponsiveProps>(
    MobileComponent: ComponentType<T>,
    DesktopComponent: ComponentType<T>,
) {
    return function ResponsiveWrapper(props: T) {
        const { isMobile = false, ...restProps } = props;

        if (isMobile) {
            return <MobileComponent {...(restProps as T)} />;
        }

        return <DesktopComponent {...(restProps as T)} />;
    };
}
