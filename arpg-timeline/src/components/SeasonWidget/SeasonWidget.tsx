import { GuardedExternalLink } from "@/components/GuardedExternalLink";
import { SeasonChip, SeasonWidgetProps } from "@/components/SeasonWidget/SeasonWidget.types";
import { sa_event } from "@/lib/sa_event";
import { cn } from "@/lib/utils";
import { addUTMParameters } from "@/lib/utm";
import { Chip } from "@/ui/Chip";

const ChipColorMap: Record<SeasonChip, string> = {
    live: "bg-sky-800 border border-sky-300 motion-safe:animate-pulse",
    over: "bg-amber-900 border border-transparent",
    now: "bg-sky-800 border border-transparent",
    next: "bg-emerald-800 border border-transparent",
    dormant: "bg-slate-600 border border-transparent",
    comingSoon: "bg-emerald-800 border border-transparent",
};

const ChipColorText: Record<SeasonChip, string> = {
    live: "LIVE",
    over: "Over",
    now: "Now",
    next: "Next",
    dormant: "Play",
    comingSoon: "Soon",
};

export const SeasonWidget = ({
    name,
    url,
    children,
    chip,
    isOfficial,
    ...divProps
}: SeasonWidgetProps) => {
    const addUTM = addUTMParameters({
        utm_source: "arpg-timeline",
        utm_content: "season_link",
        utm_term: encodeURIComponent(name),
    });

    return (
        <div {...divProps} className={cn(divProps.className, "flex flex-1 flex-col gap-2")}>
            <div className="flex w-full flex-row items-center justify-between gap-2 text-xs">
                <Chip className={cn(ChipColorMap[chip], "mb-auto min-h-[1em] w-12 text-center")}>
                    {ChipColorText[chip]}
                </Chip>
                <h4 className="font-heading text-foreground flex-1 md:text-sm">
                    {url ? (
                        <GuardedExternalLink
                            href={addUTM(url)}
                            isOfficial={isOfficial ?? true}
                            className="underline decoration-transparent underline-offset-2 select-none hover:decoration-current/75"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => sa_event(`${name}-link-click`)}
                        >
                            {name}
                        </GuardedExternalLink>
                    ) : (
                        name
                    )}
                </h4>
            </div>
            <div className="flex flex-1 flex-col gap-2">{children}</div>
        </div>
    );
};
