import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

import type { Crumb } from "@/lib/articles/breadcrumbs";

/**
 * Visible breadcrumb trail. The last crumb is the current page (not a link).
 * Pairs with <BreadcrumbSchema crumbs={…} /> for the JSON-LD.
 */
export const Breadcrumbs = ({ crumbs }: { crumbs: Crumb[] }) => {
    if (crumbs.length === 0) return null;

    return (
        <nav aria-label="Breadcrumb" className="text-muted-foreground mb-4 text-sm">
            <ol className="flex flex-wrap items-center gap-1">
                {crumbs.map((crumb, i) => {
                    const isLast = i === crumbs.length - 1;
                    return (
                        <Fragment key={crumb.href}>
                            <li className="flex items-center gap-1">
                                {isLast ? (
                                    <span
                                        aria-current="page"
                                        className="text-foreground line-clamp-1"
                                    >
                                        {crumb.name}
                                    </span>
                                ) : (
                                    <Link
                                        href={crumb.href}
                                        className="hover:text-foreground hover:underline"
                                    >
                                        {crumb.name}
                                    </Link>
                                )}
                            </li>
                            {!isLast && (
                                <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
                            )}
                        </Fragment>
                    );
                })}
            </ol>
        </nav>
    );
};
