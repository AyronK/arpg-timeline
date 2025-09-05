import { ArchivalSeasonsSectionProps } from "../types";

export const ArchivalSeasonsSection = ({ seasons }: ArchivalSeasonsSectionProps) => {
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
                            <div className="text-foreground mb-2 font-medium">{season.name}</div>
                            <div className="text-muted-foreground text-sm">
                                Started{" "}
                                {season.startDate.toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}
                                {season.endDate && (
                                    <>
                                        {" • "}
                                        Ended{" "}
                                        {season.endDate.toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </>
                                )}
                                {season.duration && (
                                    <>
                                        {" • "}
                                        {season.duration} days
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
