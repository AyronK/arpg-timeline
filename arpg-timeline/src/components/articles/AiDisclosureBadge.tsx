import { Sparkles } from "lucide-react";
import Link from "next/link";

import { type AiDisclosureTone, getAiDisclosureMeta } from "@/lib/articles/aiDisclosure";
import type { AiDisclosure } from "@/lib/cms/queries/articleQuery";
import { cn } from "@/lib/utils";

const TONE_CLASSES: Record<AiDisclosureTone, string> = {
    neutral: "border-border bg-muted text-muted-foreground",
    info: "border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300",
    caution: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300",
};

/**
 * AI-usage disclosure shown under the article byline — always rendered, never on
 * cards (plan decision 24). Links to the transparency page.
 */
export const AiDisclosureBadge = ({ value }: { value: AiDisclosure }) => {
    const meta = getAiDisclosureMeta(value);
    return (
        <Link
            href="/transparency"
            title={meta.description}
            className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
                TONE_CLASSES[meta.tone],
            )}
        >
            <Sparkles className="h-3 w-3" aria-hidden />
            {meta.label}
        </Link>
    );
};
