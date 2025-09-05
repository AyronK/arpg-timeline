import { PropsWithChildren } from "react";

import { LayoutCarousel } from "@/components/LayoutCarousel";

const DashboardLayout = ({ children }: PropsWithChildren) => (
    <>
        <LayoutCarousel />
        {children}
    </>
);

export default DashboardLayout;
