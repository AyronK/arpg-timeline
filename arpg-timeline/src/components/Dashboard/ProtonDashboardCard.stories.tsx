import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Image from "next/image";
import Link from "next/link";
import { MaybeLinkWrapper } from "../MaybeLinkWrapper";

// ─── Asset catalogue ─────────────────────────────────────────────────────────

const LOGOS = {
    mail: { src: "/assets/Mail-logomark-logotype-white-transparent.svg", w: 5704, h: 2064 },
    vpn: { src: "/assets/VPN-logomark-logotype-white-transparent.svg", w: 5834, h: 2064 },
    pass: { src: "/assets/Pass-logotype-white-transparent.svg", w: 23020, h: 8256 },
    drive: { src: "/assets/Drive-logomark-logotype-white-transparent.svg", w: 5894, h: 2064 },
} as const;

type ProductKey = keyof typeof LOGOS;

// ─── Product metadata ─────────────────────────────────────────────────────────

const PRODUCTS: Record<ProductKey, { label: string; pitch: string; cta: string; href: string }> = {
    mail: {
        label: "Mail",
        pitch: "Encrypted email with a special deal. Every signup directly supports aRPG Timeline.",
        cta: "Get the Proton Mail deal",
        href: "#proton-mail-affiliate",
    },
    vpn: {
        label: "VPN",
        pitch: "Private browsing and location spoofing with a special deal. Every signup directly supports aRPG Timeline.",
        cta: "Get the Proton VPN deal",
        href: "#proton-vpn-affiliate",
    },
    pass: {
        label: "Pass",
        pitch: "Password manager with a special deal. Every signup directly supports aRPG Timeline.",
        cta: "Get the Proton Pass deal",
        href: "#proton-pass-affiliate",
    },
    drive: {
        label: "Drive",
        pitch: "Encrypted cloud storage with a special deal. Every signup directly supports aRPG Timeline.",
        cta: "Get the Proton Drive deal",
        href: "#proton-drive-affiliate",
    },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Compute display width from source dimensions at a given display height. */
const logoSize = (
    product: ProductKey,
    displayHeight: number,
): { width: number; height: number } => {
    const { w, h } = LOGOS[product];
    return { width: Math.round((displayHeight * w) / h), height: displayHeight };
};

const HideButton = () => (
    <button
        type="button"
        className="text-muted-foreground hover:text-foreground absolute top-4 right-2 cursor-pointer rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors"
        aria-label="Hide promos (opens settings)"
    >
        Hide it?
    </button>
);

const ProtonLogo = ({
    product,
    displayHeight = 48,
    href,
}: {
    product: ProductKey;
    displayHeight?: number;
    href: string;
}) => {
    const logo = LOGOS[product];
    const dims = logoSize(product, displayHeight);
    return (
        <Link href={href}>
            <Image
                src={logo.src}
                className="cursor-pointer transition-all ease-in-out hover:scale-105"
                alt={`Proton ${PRODUCTS[product].label}`}
                width={dims.width}
                height={dims.height}
                unoptimized
            />
        </Link>
    );
};

// ─── Card templates ───────────────────────────────────────────────────────────

/**
 * Two products side-by-side with equal-weight CTA buttons and no banners.
 * The logos are the only visual element - one per product.
 */
const TwoProductCard = ({ a, b }: { a: ProductKey; b: ProductKey }) => (
    <section
        style={{ height: "272px" }}
        className="bg-card text-card-foreground relative flex flex-col justify-between gap-3 rounded-md border p-4"
    >
        <HideButton />
        <div className="flex flex-col gap-0.5">
            <h3 className="font-heading text-xs">Proton with aRPG Timeline</h3>
        </div>

        <div className="flex flex-row items-center justify-center gap-2">
            <ProtonLogo product={a} displayHeight={56} href={PRODUCTS[a].href} />
            <ProtonLogo product={b} displayHeight={56} href={PRODUCTS[b].href} />
        </div>

        <p className="text-muted-foreground pb-2 text-center text-xs text-balance">
            Privacy tools for aRPG players - every signup supports aRPG Timeline directly.
        </p>

        <div className="flex flex-row gap-6 px-2">
            <MaybeLinkWrapper
                href={PRODUCTS[a].href}
                className="border-border hover:bg-accent flex-1 justify-center rounded-md border px-4 py-1.5 text-center text-xs font-medium transition-colors"
            >
                <span className="mr-1">{PRODUCTS[a].label} deal</span>
            </MaybeLinkWrapper>
            <MaybeLinkWrapper
                href={PRODUCTS[b].href}
                className="border-border hover:bg-accent flex-1 justify-center rounded-md border px-4 py-1.5 text-center text-xs font-medium transition-colors"
            >
                <span className="mr-1">{PRODUCTS[b].label} deal</span>
            </MaybeLinkWrapper>
        </div>
    </section>
);

/**
 * Single-product focus: logo only, no banner.
 * The logotype is the hero visual at a large size.
 */
const ProductLogoCard = ({ product }: { product: ProductKey }) => (
    <section
        style={{ height: "272px" }}
        className="bg-card text-card-foreground relative flex flex-col justify-between gap-3 rounded-md border p-4"
    >
        <HideButton />
        <div className="flex flex-col gap-0.5">
            <h3 className="font-heading text-xs">Proton with aRPG Timeline</h3>
        </div>
        <div className="flex justify-center py-2">
            <ProtonLogo product={product} displayHeight={80} href={PRODUCTS[product].href} />
        </div>
        <p className="text-muted-foreground pb-2 text-center text-xs">{PRODUCTS[product].pitch}</p>
        <MaybeLinkWrapper
            href={PRODUCTS[product].href}
            className="border-border hover:bg-accent mt-auto justify-center rounded-md border px-4 py-1.5 text-center text-xs font-medium transition-colors"
        >
            <span className="mr-1">{PRODUCTS[product].cta}</span>
        </MaybeLinkWrapper>
    </section>
);

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta = {
    title: "Components/ProtonDashboardCard",
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <div style={{ width: "370px" }}>
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
    render: () => <TwoProductCard a="mail" b="vpn" />,
};

export const TwoMailPass: Story = {
    name: "Two products - Mail + Pass",
    render: () => <TwoProductCard a="mail" b="pass" />,
};

export const TwoMailDrive: Story = {
    name: "Two products - Mail + Drive",
    render: () => <TwoProductCard a="mail" b="drive" />,
};

export const TwoVpnPass: Story = {
    name: "Two products - VPN + Pass",
    render: () => <TwoProductCard a="vpn" b="pass" />,
};

export const TwoVpnDrive: Story = {
    name: "Two products - VPN + Drive",
    render: () => <TwoProductCard a="vpn" b="drive" />,
};

export const TwoPassDrive: Story = {
    name: "Two products - Pass + Drive",
    render: () => <TwoProductCard a="pass" b="drive" />,
};

// =============================================================================
// Product focus - logo only (no banner)
// =============================================================================

export const FocusMailLogo: Story = {
    name: "Focus - Mail (logo)",
    render: () => <ProductLogoCard product="mail" />,
};

export const FocusVpnLogo: Story = {
    name: "Focus - VPN (logo)",
    render: () => <ProductLogoCard product="vpn" />,
};

export const FocusPassLogo: Story = {
    name: "Focus - Pass (logo)",
    render: () => <ProductLogoCard product="pass" />,
};

export const FocusDriveLogo: Story = {
    name: "Focus - Drive (logo)",
    render: () => <ProductLogoCard product="drive" />,
};
