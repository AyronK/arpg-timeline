"use client";

import { useHasMounted } from "@react-hooks-library/core";
import { Children, cloneElement, isValidElement, PropsWithChildren } from "react";

const ClientOnlyVisibleWrapper = ({ children }: PropsWithChildren) => {
    const hasMounted = useHasMounted();

    if (!hasMounted) {
        return (
            <>
                {Children.map(children, (child) => {
                    if (isValidElement(child)) {
                        const element = child as React.ReactElement<{ className?: string }>;
                        return cloneElement(element, {
                            className:
                                "relative after:absolute after:inset-0 after:bg-background after:rounded-md animate-pulse",
                        });
                    }
                    return child;
                })}
            </>
        );
    }

    return children;
};

export default ClientOnlyVisibleWrapper;
