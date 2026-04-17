import { SiTwitch } from "react-icons/si";

import type {
    ActiveSupporter,
    HallOfFameEntry,
    PastSupporter,
    SupportersQueryResult,
    SupporterTier,
} from "@/lib/cms/queries/supportersQuery";

import { MaybeLinkWrapper } from "./MaybeLinkWrapper";

const TIER_LABELS: Record<SupporterTier, string> = {
    unique: "Unique supporter",
    exalted: "Exalted supporter",
    rare: "Rare supporter",
    magic: "Magic supporter",
};

const TIER_LABEL_CLASSES: Record<SupporterTier, string> = {
    unique: "text-amber-800 dark:text-amber-600",
    exalted: "text-violet-600 dark:text-violet-400",
    rare: "text-yellow-600 dark:text-yellow-400",
    magic: "text-blue-500 dark:text-blue-400",
};

const TIER_CARD_BORDER: Record<SupporterTier, string> = {
    unique: "border-amber-800/60",
    exalted: "border-violet-500/40",
    rare: "border-yellow-500/40",
    magic: "border-blue-500/30",
};

const TierBadge = ({ tier }: { tier: SupporterTier }) => (
    <span className={`text-xs font-semibold tracking-wide uppercase ${TIER_LABEL_CLASSES[tier]}`}>
        {TIER_LABELS[tier]}
    </span>
);

const HallOfFameCard = ({ entry }: { entry: HallOfFameEntry }) => {
    const isTwitch = entry.url?.includes("twitch.tv");

    const nameEl = entry.url ? (
        <MaybeLinkWrapper
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:underline"
        >
            {isTwitch && <SiTwitch className="h-3.5 w-3.5 shrink-0 text-[#9146FF]" />}
            {entry.name}
        </MaybeLinkWrapper>
    ) : (
        <span>{entry.name}</span>
    );

    return (
        <div className="bg-card flex flex-col items-center gap-2 rounded-lg border border-emerald-300/40 p-4 text-center shadow-[0_0_10px_1px_rgba(16,185,129,0.1)]">
            <p className="text-muted-foreground flex min-h-8 items-center justify-center text-xs leading-tight font-medium tracking-wide uppercase">
                {entry.hallOfFameTitle}
            </p>

            <p className="text-foreground font-semibold">{nameEl}</p>

            {entry.tier && <TierBadge tier={entry.tier} />}

            {entry.hallOfFameNote && (
                <p className="text-muted-foreground text-xs leading-relaxed text-balance">
                    {entry.hallOfFameNote}
                </p>
            )}
        </div>
    );
};

const HallOfFameSection = ({ entries }: { entries: HallOfFameEntry[] }) => {
    if (entries.length === 0) return null;

    return (
        <div className="space-y-3">
            <h4 className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
                Hall of Fame
            </h4>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
                {entries.map((entry) => (
                    <HallOfFameCard key={entry.name} entry={entry} />
                ))}
            </div>
        </div>
    );
};
const MAGIC_OVERFLOW_THRESHOLD = 10;

const SupporterCard = ({
    supporter,
    tier,
}: {
    supporter: ActiveSupporter;
    tier: SupporterTier;
}) => {
    const inner = supporter.url ? (
        <MaybeLinkWrapper
            href={supporter.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:underline"
        >
            {supporter.name}
        </MaybeLinkWrapper>
    ) : (
        <span className="text-foreground">{supporter.name}</span>
    );

    return (
        <div className={`bg-card rounded-md border ${TIER_CARD_BORDER[tier]} px-3 py-2 text-sm`}>
            {inner}
        </div>
    );
};

const TierGroup = ({
    tier,
    supporters,
    overflow = 0,
}: {
    tier: SupporterTier;
    supporters: ActiveSupporter[];
    overflow?: number;
}) => {
    if (supporters.length === 0 && overflow === 0) return null;

    return (
        <div className="space-y-2">
            <span
                className={`text-xs font-semibold tracking-wide uppercase ${TIER_LABEL_CLASSES[tier]}`}
            >
                {TIER_LABELS[tier]}
            </span>
            <div className="flex flex-wrap gap-2">
                {supporters.map((s) => (
                    <SupporterCard key={s.name} supporter={s} tier={tier} />
                ))}
                {overflow > 0 && (
                    <div
                        className={`bg-card rounded-md border border-dashed ${TIER_CARD_BORDER[tier]} text-muted-foreground px-3 py-2 text-sm`}
                    >
                        +{overflow} more
                    </div>
                )}
            </div>
        </div>
    );
};

const ActiveSupportersSection = ({ supporters }: { supporters: ActiveSupporter[] }) => {
    if (supporters.length === 0) {
        return (
            <p className="text-muted-foreground text-sm">
                Be the first to support -{" "}
                <a
                    href={process.env.NEXT_PUBLIC_PATREON_URL ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="underline underline-offset-2 hover:no-underline"
                >
                    join on Patreon
                </a>
                !
            </p>
        );
    }

    const unique = supporters.filter((s) => s.tier === "unique");
    const exalted = supporters.filter((s) => s.tier === "exalted");
    const rare = supporters.filter((s) => s.tier === "rare");
    const magic = supporters.filter((s) => s.tier === "magic");
    const magicVisible = magic.slice(0, MAGIC_OVERFLOW_THRESHOLD);
    const magicOverflow = magic.length - MAGIC_OVERFLOW_THRESHOLD;

    return (
        <div className="space-y-4">
            <TierGroup tier="unique" supporters={unique} />
            <TierGroup tier="exalted" supporters={exalted} />
            <TierGroup tier="rare" supporters={rare} />
            <TierGroup
                tier="magic"
                supporters={magicVisible}
                overflow={magicOverflow > 0 ? magicOverflow : 0}
            />
        </div>
    );
};

const PastSupportersSection = ({ supporters }: { supporters: PastSupporter[] }) => {
    if (supporters.length === 0) return null;

    return (
        <div className="space-y-1 pt-2">
            <h4 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                Past Supporters
            </h4>
            <p className="text-muted-foreground text-sm">
                With thanks to: {supporters.map((s) => s.name).join(", ")}
            </p>
        </div>
    );
};

export const SupportersSection = ({ hallOfFame, active, past }: SupportersQueryResult) => {
    return (
        <div className="space-y-8">
            <HallOfFameSection entries={hallOfFame} />

            <div className="space-y-3">
                {active.length > 0 && (
                    <h4 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                        Active Supporters
                    </h4>
                )}
                <ActiveSupportersSection supporters={active} />
            </div>

            <PastSupportersSection supporters={past} />
        </div>
    );
};
