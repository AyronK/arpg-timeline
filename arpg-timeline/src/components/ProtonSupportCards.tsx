"use client";
import { ProtonProductLogoCard } from "./Dashboard/ProtonDashboardCard/ProtonProductLogoCard";

export const ProtonSupportCards = () => {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ProtonProductLogoCard product="mail" />
            <ProtonProductLogoCard product="vpn" />
            <ProtonProductLogoCard product="drive" />
            <ProtonProductLogoCard product="pass" />
        </div>
    );
};
