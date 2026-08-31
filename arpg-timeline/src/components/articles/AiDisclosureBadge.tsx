import { Sparkles } from "lucide-react";

import {
    AI_DISCLOSURE_MAX,
    type AiDisclosureTone,
    getAiDisclosureMeta,
} from "@/lib/articles/aiDisclosure";
import type { AiDisclosure } from "@/lib/cms/queries/articleQuery";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/Tooltip";

const TONE_CLASSES: Record<AiDisclosureTone, string> = {
    neutral: "border-border bg-muted text-muted-foreground",
    info: "border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300",
    caution: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300",
};

/**
 * AI-usage disclosure under the article byline (plan decision 24 - never on
 * cards). Shows a 0–N degree meter only; the wording is in the tooltip.
 */
export const AiDisclosureBadge = ({ value }: { value: AiDisclosure }) => {
    const meta = getAiDisclosureMeta(value);

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span
                    className={cn(
                        "inline-flex cursor-help items-center gap-1.5 rounded-full border px-2 py-1",
                        TONE_CLASSES[meta.tone],
                    )}
                    role="img"
                    aria-label={`AI involvement: ${meta.label} (${meta.degree} of ${AI_DISCLOSURE_MAX})`}
                >
                    <Sparkles className="h-3 w-3" aria-hidden />
                    <span className="flex gap-0.5" aria-hidden>
                        {Array.from({ length: AI_DISCLOSURE_MAX }, (_, i) => (
                            <span
                                key={i}
                                className={cn(
                                    "h-1.5 w-1.5 rounded-full bg-current",
                                    i < meta.degree ? "opacity-100" : "opacity-30",
                                )}
                            />
                        ))}
                    </span>
                </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-56">
                <span className="font-semibold">
                    AI involvement {meta.degree}/{AI_DISCLOSURE_MAX} - {meta.label}
                </span>
                <br />
                {meta.description}
            </TooltipContent>
        </Tooltip>
    );
};
