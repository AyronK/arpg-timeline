import type { AiDisclosure } from "@/lib/cms/queries/articleQuery";

export const AI_DISCLOSURE_MAX = 4;

export type AiDisclosureTone = "neutral" | "info" | "caution";

export interface AiDisclosureMeta {
    degree: number;
    label: string;
    description: string;
    tone: AiDisclosureTone;
}

// Cumulative: each level includes the ones below it.
export const AI_DISCLOSURE_META: Record<AiDisclosure, AiDisclosureMeta> = {
    none: {
        degree: 0,
        label: "No AI",
        description: "No AI at any stage.",
        tone: "neutral",
    },
    styling: {
        degree: 1,
        label: "AI styling",
        description: "AI for formatting and layout only.",
        tone: "neutral",
    },
    assisted: {
        degree: 2,
        label: "AI-assisted",
        description: "+ AI research and outlining; a human writes.",
        tone: "info",
    },
    redacted: {
        degree: 3,
        label: "AI draft, human-finished",
        description: "+ AI writes the draft; a human edits and does the final pass.",
        tone: "info",
    },
    "fully-generated": {
        degree: 4,
        label: "AI-generated",
        description: "Mostly AI output; minimal human review.",
        tone: "caution",
    },
};

export const getAiDisclosureMeta = (value: AiDisclosure | undefined | null): AiDisclosureMeta =>
    AI_DISCLOSURE_META[value ?? "none"] ?? AI_DISCLOSURE_META.none;
