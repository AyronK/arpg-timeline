import { SeasonEnd } from "@/lib/cms/games.types";
import { isOver } from "@/lib/games/sortBySeasons";

export const PreviousSeasonEndingSeoText = ({
    gameName,
    seasonName,
    seasonKeyword,
    end,
}: {
    gameName: string | null;
    seasonName: string | null;
    seasonKeyword: string;
    end: SeasonEnd | null;
}) => {
    if (!gameName) return null;
    const seasonSegment = seasonName ? `${seasonKeyword} - ${seasonName} -` : seasonKeyword;
    const over = isOver(end?.endDate);
    const endedOrEnding = over ? "ended" : "ending";
    const hasOrIs = over ? "has" : "is";
    return (
        <>
            <h4>
                When {hasOrIs} the previous {gameName} {seasonKeyword} {endedOrEnding}?
            </h4>
            {end?.endDate && end?.confirmed ? (
                <p>{`The previous ${gameName} ${seasonSegment} ${hasOrIs} ${endedOrEnding} ${new Date(end.endDate).toUTCString()}`}</p>
            ) : (
                <p>
                    The official end date of the previous {gameName} {seasonKeyword} has not been
                    announced yet.{" "}
                    {(end?.overrideText || end?.additionalText) && (
                        <>
                            It {hasOrIs} likely {endedOrEnding}{" "}
                            {end.overrideText || end.additionalText}
                        </>
                    )}
                </p>
            )}
        </>
    );
};
