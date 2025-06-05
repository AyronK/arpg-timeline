export const PreviousSeasonStartedSeoText = ({
    gameName,
    seasonName,
    seasonKeyword,
    startDate,
}: {
    gameName: string | null;
    seasonName: string | null;
    seasonKeyword: string;
    startDate: string;
}) => {
    if (!gameName) return null;
    const seasonSegment = seasonName ? `${seasonKeyword} - ${seasonName} -` : seasonKeyword;
    return (
        <>
            <h4>
                When has the previous {gameName} {seasonKeyword} started?
            </h4>
            <p>{`The previous ${gameName} ${seasonSegment} has started ${new Date(startDate).toUTCString()}`}</p>
        </>
    );
};
