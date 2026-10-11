import Link from "next/link";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";

export const cardClassName = "bg-card text-card-foreground rounded-lg border p-4 md:p-6";

export const CardLink = ({
    href,
    children,
    saClick,
}: {
    href: string;
    children: ReactNode;
    saClick: string;
}) => (
    <Link
        href={href}
        data-sa-click={saClick}
        className="text-muted-foreground hover:text-foreground text-sm whitespace-nowrap hover:underline"
    >
        {children} →
    </Link>
);

export const OverviewCard = ({
    title,
    action,
    children,
    className,
}: {
    title: string;
    action?: ReactNode;
    children: ReactNode;
    className?: string;
}) => (
    <section className={cn(cardClassName, className)}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <h2 className="font-heading text-lg">{title}</h2>
            {action}
        </div>
        {children}
    </section>
);
