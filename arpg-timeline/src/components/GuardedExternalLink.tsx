"use client";

import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { AnchorHTMLAttributes, useCallback, useState } from "react";

import {
    COMMUNITY_LAUNCHER_MODAL_STORAGE_KEY,
    CommunityWebsiteModal,
} from "@/components/CommunityWebsiteModal";
import { cn } from "@/lib/utils";

type GuardedExternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    isOfficial: boolean;
    noIcon?: boolean;
    className?: string;
};

export const GuardedExternalLink = ({
    href,
    isOfficial,
    noIcon,
    className,
    children,
    ...rest
}: GuardedExternalLinkProps) => {
    const [open, setOpen] = useState(false);
    const [pendingHref, setPendingHref] = useState<string | null>(null);

    const openExternal = useCallback((url: string) => {
        if (typeof window !== "undefined") {
            window.open(url, "_blank", "noopener,noreferrer");
        }
    }, []);

    const handleClick = useCallback(
        (e: React.MouseEvent<HTMLAnchorElement>) => {
            if (isOfficial || !href) return;
            e.preventDefault();
            const dismissed =
                typeof window !== "undefined" &&
                localStorage.getItem(COMMUNITY_LAUNCHER_MODAL_STORAGE_KEY) === "true";
            if (dismissed) {
                openExternal(href);
                return;
            }
            setPendingHref(href);
            setOpen(true);
        },
        [href, isOfficial, openExternal],
    );

    const handleConfirm = useCallback(() => {
        if (pendingHref) {
            openExternal(pendingHref);
            setPendingHref(null);
            setOpen(false);
        }
    }, [pendingHref, openExternal]);

    const handleCancel = useCallback(() => {
        setOpen(false);
        setPendingHref(null);
    }, []);

    if (!href) {
        return <>{children}</>;
    }

    return (
        <>
            <Link
                href={href}
                {...rest}
                onClick={!isOfficial ? handleClick : undefined}
                className={cn(
                    className,
                    "flex cursor-pointer flex-row flex-nowrap gap-1 transition-all ease-in-out hover:brightness-125",
                )}
            >
                {children}
                {!noIcon && (
                    <ExternalLinkIcon className="mb-auto h-[0.75em] w-[0.75em] text-current" />
                )}
            </Link>
            {!isOfficial && (
                <CommunityWebsiteModal
                    open={open}
                    onOpenChange={handleCancel}
                    onConfirm={handleConfirm}
                />
            )}
        </>
    );
};
