import { Game } from "@/lib/cms/games.types";
import { getStructuredDataForGame } from "@/lib/games/getStructuredDataForGame";

export const StructuredDataScripts = ({ games }: { games: Game[] }) => (
  <>
    {games.map((game, index) => {
      const structuredData = getStructuredDataForGame(game);
      return structuredData ? (
        <script key={index} type="application/ld+json">
          {JSON.stringify(structuredData, null, 2)}
        </script>
      ) : null;
    })}
  </>
);
