import { lazy, Suspense } from "react";
import { graphql, PageProps } from "gatsby";
import { Layout } from "@/components/Layout";
import { FiltersDialog } from "@/components/FiltersDialog";
import { Faq } from "@/components/Faq";
import { Button } from "@/ui/Button";
import { InfoIcon, Timer, UsersRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { Game } from "@/lib/cms/games.types";
import { useGameFilters } from "@/hooks/useGameFilters";
import { useGamesFromMarkdown } from "@/lib/cms/useGamesFromMarkdown";
import { GameCard } from "@/components/GameCard/GameCard";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import {
  getCurrentSeasonChip,
  getProgress,
  getProgressEndContent,
  getProgressStartContent,
} from "@/lib/getProgress";
import { CalendarMenu } from "@/components/CalendarMenu";
import { Countdown } from "@/components/Countdown";
import LocalDate from "@/components/LocalDate";
import { useTimelineEvents } from "@/hooks/useTimelineEvents";

const Timeline = lazy(() =>
  import("@/components/Timeline/Timeline").then((module) => ({
    default: module.Timeline,
  })),
);

const IndexPage = ({ data }: PageProps<Queries.IndexPageQuery>) => {
  const games = useGamesFromMarkdown(data);
  const {
    gameFilters,
    toggleGameFilter,
    toggleGroupFilter,
    filteredGames,
    activeFilters,
  } = useGameFilters(games as Game[]);
  const events = useTimelineEvents(filteredGames);
  return (
    <Layout>
      <div className="container relative mx-auto mb-8">
        <p className="mx-auto mb-2 hidden max-w-prose text-center font-heading text-lg md:block md:text-xl">
          Stay ahead in your favorite ARPGs with the season tracker.
          <br />
          Never miss a season start or end again!
        </p>
        <div className="mt-2 flex flex-col gap-4 md:mt-0">
          <div className="max-w-[1200px]">
            <FiltersDialog
              checked={activeFilters}
              filters={gameFilters}
              onCheckedChange={toggleGameFilter}
              onGroupCheckedChange={toggleGroupFilter}
            />
          </div>
          <div className="container absolute right-0 top-0 z-0 flex w-full text-xs md:top-16">
            <Button
              variant={"default"}
              asChild
              className="ml-auto w-auto font-ui font-semibold opacity-80 transition-all hover:opacity-100"
            >
              <a href="/looking-for-moderators" rel="self">
                <UsersRound className="mr-2 h-[1.2rem] w-[1.2rem]" />
                Looking for mods
              </a>
            </Button>
          </div>
          <article className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 xl:grid-cols-3 3xl:grid-cols-4 4xl:grid-cols-5">
            <h2 className="sr-only">Game seasons</h2>
            {filteredGames.map((game, idx) => (
              <div
                key={game!.slug}
                className={cn("order-last flex", {
                  "order-first": idx <= 1,
                  "xl:order-first": idx <= 2,
                  "3xl:order-first": idx <= 3,
                  "4xl:order-first": idx <= 4,
                })}
              >
                {/* TODO: refactor game card props mapping */}
                <GameCard
                  name={game.name}
                  logo={
                    <GatsbyImage
                      image={getImage(game.logo!)!}
                      alt={`${game.name} logo`}
                      className="my-auto"
                    />
                  }
                  shortName={game.shortName}
                  url={game.url}
                  currentSeason={
                    game.currentSeason && {
                      //TODO: map SR texts
                      name: game.currentSeason.name,
                      progress: getProgress(
                        game.currentSeason.start.startDate,
                        game.currentSeason.end.endDate,
                      ),
                      chip: getCurrentSeasonChip(
                        game.currentSeason.start?.startDate,
                        game.currentSeason.end?.endDate,
                      ),
                      progressStart: getProgressStartContent(
                        game.currentSeason.start?.startDate,
                        game.currentSeason.end?.endDate,
                      ),
                      progressEnd: getProgressEndContent(
                        game.currentSeason.end?.additionalText,
                        game.currentSeason.end?.confirmed
                          ? game.currentSeason.end?.endDate
                          : null,
                      ),
                    }
                  }
                  nextSeason={
                    //TODO: map SR texts
                    game.nextSeason
                      ? {
                          name: game.nextSeason.name,
                          startLabel: game.nextSeason.start?.confirmed ? (
                            <div className="flex flex-row items-center gap-1">
                              <Timer className="h-4 w-4" />
                              Starts
                              <LocalDate
                                longDate
                                utcDate={game.nextSeason.start.startDate}
                              />
                            </div>
                          ) : (
                            <div className="flex flex-row items-center gap-1">
                              <Timer className="h-4 w-4" />
                              {game.nextSeason.start?.additionalText?.trim()
                                ? game.nextSeason.start?.additionalText
                                : "To be announced"}
                            </div>
                          ),
                          timer: game.nextSeason.start?.confirmed && (
                            <Countdown date={game.nextSeason.start.startDate} />
                          ),
                          action: game.nextSeason.start?.confirmed && (
                            <div>
                              <CalendarMenu
                                startDate={game.nextSeason.start.startDate}
                                title={`${game.name} ${game.seasonKeyword} start`}
                              />
                            </div>
                          ),
                        }
                      : { name: "Next season to be announced" }
                  }
                  footer={
                    (game.currentSeason?.start?.additionalText ||
                      game.currentSeason?.end?.additionalText) && (
                      <div className="flex flex-row flex-nowrap items-center gap-1 md:flex">
                        <InfoIcon className="h-4 w-4" />
                        <div>
                          {game.currentSeason?.start?.additionalText}
                          {game.currentSeason?.end?.additionalText}
                        </div>
                      </div>
                    )
                  }
                  official={game.official}
                />
              </div>
            ))}
            <div className="relative order-3 col-span-1 flex flex-col gap-2 rounded-md border bg-card p-4 text-card-foreground md:col-span-2 md:gap-4 md:p-6 xl:col-span-3 3xl:col-span-4 4xl:col-span-5">
              <div>
                <h3 className="mb-1.5 font-semibold sm:text-lg">Timeline</h3>
                <Suspense
                  fallback={
                    <div className="h-[255px] md:h-[296px]">Loading</div>
                  }
                >
                  <Timeline events={events} />
                </Suspense>
              </div>
            </div>
          </article>
        </div>
      </div>
      <Faq />
    </Layout>
  );
};

export { Head } from "@/components/Layout";

export const query = graphql`
  query IndexPage {
    games: allMarkdownRemark(
      filter: { frontmatter: { type: { eq: "game" } } }
    ) {
      edges {
        node {
          frontmatter {
            slug
            name
            shortName
            official
            seasonKeyword
            url
            group
            logo {
              childImageSharp {
                gatsbyImageData(
                  layout: CONSTRAINED
                  quality: 85
                  placeholder: BLURRED
                  transformOptions: { fit: COVER }
                )
              }
            }
          }
        }
      }
    }
    seasons: allMarkdownRemark(
      filter: { frontmatter: { type: { eq: "season" } } }
    ) {
      edges {
        node {
          frontmatter {
            name
            game
            url
            start {
              startDate
              confirmed
              overrideText
              additionalText
            }
            end {
              endDate
              confirmed
              overrideText
              additionalText
            }
          }
        }
      }
    }
  }
`;

export default IndexPage;
