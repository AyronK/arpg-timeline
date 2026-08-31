import type { TocHeading } from "@/lib/articles/tableOfContents";
import { cn } from "@/lib/utils";

/** In-page table of contents. Rendered only when there are >= 2 headings. */
export const ArticleToc = ({ headings }: { headings: TocHeading[] }) => {
    if (headings.length < 2) return null;

    return (
        <nav aria-label="Table of contents" className="bg-muted/40 my-6 rounded-lg border p-4">
            <p className="font-heading mb-2 text-sm font-semibold tracking-wide uppercase">
                On this page
            </p>
            <ul className="space-y-1 text-sm">
                {headings.map((h) => (
                    <li key={h.id} className={cn(h.level === 3 && "ml-4")}>
                        <a
                            href={`#${h.id}`}
                            className="text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
                        >
                            {h.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};
