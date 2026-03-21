import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ProtonProductBannerCard } from "./ProtonProductBannerCard";
import { ProtonProductLogoCard } from "./ProtonProductLogoCard";
import { ProtonTwoProductCard } from "./ProtonTwoProductCard";

const noop = () => {};

const meta: Meta = {
    title: "Components/ProtonDashboardCard",
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <div
                style={{
                    width: "370px",
                    height: "272px",
                    display: "flex",
                }}
            >
                <Story />
            </div>
        ),
    ],
};

export default meta;

type Story = StoryObj;

// =============================================================================
// Two products - all 6 combinations of Mail / VPN / Pass / Drive
// =============================================================================

export const TwoMailVpn: Story = {
    name: "Two products - Mail + VPN",
    render: () => <ProtonTwoProductCard a="mail" b="vpn" onHide={noop} />,
};

export const TwoMailPass: Story = {
    name: "Two products - Mail + Pass",
    render: () => <ProtonTwoProductCard a="mail" b="pass" onHide={noop} />,
};

export const TwoMailDrive: Story = {
    name: "Two products - Mail + Drive",
    render: () => <ProtonTwoProductCard a="mail" b="drive" onHide={noop} />,
};

export const TwoVpnPass: Story = {
    name: "Two products - VPN + Pass",
    render: () => <ProtonTwoProductCard a="vpn" b="pass" onHide={noop} />,
};

export const TwoVpnDrive: Story = {
    name: "Two products - VPN + Drive",
    render: () => <ProtonTwoProductCard a="vpn" b="drive" onHide={noop} />,
};

export const TwoPassDrive: Story = {
    name: "Two products - Pass + Drive",
    render: () => <ProtonTwoProductCard a="pass" b="drive" onHide={noop} />,
};

// =============================================================================
// Product focus - logo only (no banner)
// =============================================================================

export const FocusMailLogo: Story = {
    name: "Focus - Mail (logo)",
    render: () => <ProtonProductLogoCard product="mail" onHide={noop} />,
};

export const FocusVpnLogo: Story = {
    name: "Focus - VPN (logo)",
    render: () => <ProtonProductLogoCard product="vpn" onHide={noop} />,
};

export const FocusPassLogo: Story = {
    name: "Focus - Pass (logo)",
    render: () => <ProtonProductLogoCard product="pass" onHide={noop} />,
};

export const FocusDriveLogo: Story = {
    name: "Focus - Drive (logo)",
    render: () => <ProtonProductLogoCard product="drive" onHide={noop} />,
};

// =============================================================================
// Product focus - banner only (no logo)
// =============================================================================

export const FocusMailBanner: Story = {
    name: "Focus - Mail (banner)",
    render: () => <ProtonProductBannerCard product="mail" onHide={noop} />,
};

export const FocusVpnBanner: Story = {
    name: "Focus - VPN (banner)",
    render: () => <ProtonProductBannerCard product="vpn" onHide={noop} />,
};

export const FocusDriveBanner: Story = {
    name: "Focus - Drive (banner)",
    render: () => <ProtonProductBannerCard product="drive" onHide={noop} />,
};
