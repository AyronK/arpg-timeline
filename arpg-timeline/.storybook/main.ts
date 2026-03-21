import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [
        "@chromatic-com/storybook",
        "@storybook/addon-vitest",
        "@storybook/addon-a11y",
        "@storybook/addon-docs",
        "@storybook/addon-onboarding",
    ],
    framework: "@storybook/nextjs-vite",
    staticDirs: ["../public"],
    env: (existing) => ({
        ...existing,
        NEXT_PUBLIC_PROTON_MAIL_AFFILIATE_URL: "#proton-mail",
        NEXT_PUBLIC_PROTON_VPN_AFFILIATE_URL: "#proton-vpn",
        NEXT_PUBLIC_PROTON_PASS_AFFILIATE_URL: "#proton-pass",
        NEXT_PUBLIC_PROTON_DRIVE_AFFILIATE_URL: "#proton-drive",
    }),
};
export default config;
