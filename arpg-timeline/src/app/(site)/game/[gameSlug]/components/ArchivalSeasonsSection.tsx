import { SanityImage } from "@/components/SanityImage";

import { ArchivalSeasonsSectionProps } from "../types";

export const ArchivalSeasonsSection = ({ seasons, gameLogo }: ArchivalSeasonsSectionProps) => {
    if (seasons.length === 0) {
        return null;
    }

    return (
        <div className="mb-6 md:mb-8">
            <div className="bg-card text-card-foreground rounded-lg border p-4 md:p-6">
                <h2 className="font-heading mb-3 text-lg md:mb-4 md:text-xl">Archival Seasons</h2>
                <div className="max-h-64 space-y-2 overflow-y-auto">
                    {seasons.map((season, index) => (
                        <div
                            key={index}
                            className="border-muted-foreground/20 rounded-md border p-3"
                        >
                            <div className="flex items-stretch gap-3 md:gap-6">
                                <div className="my-auto grid h-16 min-h-16 w-16 min-w-16 shrink-0 place-items-center md:h-24 md:min-h-24 md:w-24 md:min-w-24">
                                    <SanityImage
                                        loading="lazy"
                                        src={season.logo ?? gameLogo}
                                        alt={`${season.name} logo`}
                                        width={128}
                                        height={128}
                                        objectFit="contain"
                                        className="h-full w-full"
                                    />
                                </div>
                                <div className="flex flex-1 flex-col justify-start">
                                    <div className="text-foreground mb-1 font-medium">
                                        {season.name}
                                    </div>
                                    <div className="text-muted-foreground flex flex-col gap-1 text-sm md:flex-row">
                                        <div>
                                            Started{" "}
                                            {season.startDate.toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </div>
                                        {season.endDate && (
                                            <div>
                                                <span className="hidden md:inline">{" • "}</span>
                                                Ended{" "}
                                                {season.endDate.toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </div>
                                        )}
                                        {season.duration && (
                                            <div>
                                                <span className="hidden md:inline">{" • "}</span>
                                                {season.duration} days
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
