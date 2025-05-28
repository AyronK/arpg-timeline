import { lazy, Suspense } from "react";
import { graphql, PageProps } from "gatsby";
import { Layout } from "@/components/Layout";
import { Faq } from "@/components/Faq";
import { cn } from "@/lib/utils";
import { Game, GameStream } from "@/lib/cms/games.types";
import { useGameFilters } from "@/hooks/useGameFilters";
import { useGamesFromMarkdown } from "@/lib/cms/useGamesFromMarkdown";
import { useGameStreamsFromMarkdown } from "@/lib/cms/useGameStreamsFromMarkdown";
import { GameCard } from "@/components/GameCard/GameCard";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { useTimelineEvents } from "@/hooks/useTimelineEvents";
import { GameToSeasonWidget } from "@/hoc/GameToSeasonWidget";
import ErrorBoundary from "@/components/ErrorBoundary";
import { WidgetDiedFallback } from "@/components/WidgetDiedFallback";
import { Toaster } from "@/ui/Toaster";
import { inGracePeriod } from "@/lib/games/sortBySeasons";
import { Twitch } from "lucide-react";
import { Button } from "@/ui/Button";
import { FramedAction } from "@/components/FramedAction/FramedAction";
import { SingleToast } from "@/components/SingleToast";
import { StructuredDataScripts } from "@/components/StructuredDataScripts";
import { GameFilters, GameFiltersProps } from "@/pages/GameFilters";
import { TimelineEvent } from "@/components/Timeline/Const";
import { sa_event } from "@/lib/sa_event";
import { StreamCard } from "@/components/StreamCard";
import { Carousel, CarouselContent, CarouselItem } from "@/ui/Carousel";
import Autoplay from "embla-carousel-autoplay";

const Timeline = lazy(() =>
  import("@/components/Timeline/Timeline").then((m) => ({
    default: m.Timeline,
  })),
);

const Kicker = () => (
  <p className="font-heading mx-auto hidden max-w-prose text-center text-lg md:mt-8 md:block md:text-xl">
    Stay ahead in your favorite ARPGs with the season tracker.
    <br />
    Never miss a season start or end again!
  </p>
);

const Games = ({ games }: { games: Game[] }) => {
  return (
    <>
      <h2 className="hidden">Seasons</h2>
      {games.map((game, idx) => (
        <div
          key={game.slug}
          className={cn("order-last flex", {
            "order-first": idx <= 1,
            "xl:order-first": idx <= 2,
            "3xl:order-first": idx <= 3,
            "4xl:order-first": idx <= 4,
          })}
        >
          <ErrorBoundary fallback={<WidgetDiedFallback />}>
            <GameCard
              name={game.name}
              logo={
                <GatsbyImage
                  image={getImage(game.logo!)!}
                  alt={`${game.name} logo`}
                  className="my-auto"
                  objectFit="contain"
                  objectPosition="center"
                />
              }
              slug={game.slug}
              shortName={game.shortName}
              url={game.url}
              official={game.official}
            >
              <GameToSeasonWidget game={game} selector="current" />
              {inGracePeriod(game.currentSeason?.start?.startDate) ? (
                <div className="mt-auto">
                  <FramedAction
                    appendClassName="!bg-[#6441a5]"
                    append={
                      game.twitchCategory && (
                        <Button
                          asChild
                          size="icon"
                          className="mt-auto ml-auto !rounded-l-none !bg-[#6441a5]"
                          variant="destructive"
                        >
                          <a
                            target="_blank"
                            rel="noreferrer"
                            onClick={() =>
                              sa_event(`${game.slug}-twitch-click`)
                            }
                            href={`https://www.twitch.tv/directory/category/${game.twitchCategory}`}
                          >
                            <Twitch className="h-4 w-4" />
                          </a>
                        </Button>
                      )
                    }
                  >
                    Play and watch now!
                  </FramedAction>
                </div>
              ) : (
                <GameToSeasonWidget game={game} selector="next" />
              )}
            </GameCard>
          </ErrorBoundary>
        </div>
      ))}
    </>
  );
};

const Events = ({ events }: { events: TimelineEvent[] }) => (
  <div className="bg-card text-card-foreground 3xl:col-span-4 4xl:col-span-5 lg-col-span-2 relative order-3 col-span-1 flex flex-col gap-4 rounded-md border p-4 md:col-span-2 md:gap-4 md:p-6 xl:col-span-3">
    <div>
      <h3 className="mb-1.5 text-xs">Timeline</h3>
      <Suspense
        fallback={<div className="h-[255px] md:h-[296px]">Loading</div>}
      >
        <ErrorBoundary fallback={<WidgetDiedFallback />}>
          <Timeline events={events} />
        </ErrorBoundary>
      </Suspense>
    </div>
  </div>
);

const GamesAndEventsGrid = ({
  games,
  events,
  filtersProps,
}: {
  games: Game[];
  events: TimelineEvent[];
  filtersProps: GameFiltersProps;
}) => {
  return (
    <article className="3xl:grid-cols-4 4xl:grid-cols-5 relative grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-2 xl:grid-cols-3">
      <GameFilters {...filtersProps} />
      <Games games={games} />
      <Events events={events} />
    </article>
  );
};

const Main = ({ games, streams }: { games: Game[]; streams: GameStream[] }) => {
  const { filteredGames, ...filtersProps } = useGameFilters(games);
  const events = useTimelineEvents(filteredGames);
  streams.filter((s) => filteredGames.find((g) => g.slug === s.gameSlug));

  return (
    <div className="relative container mx-auto mb-8">
      <Kicker />
      <div className="mt-4 flex flex-col gap-4 xl:mt-8">
        {streams?.length > 0 && (
          <div className={cn({ "flex justify-center": streams.length === 1 })}>
            <div
              className={cn("relative max-w-3xl flex-1", {
                "mx-auto": streams.length > 1,
              })}
            >
              <h2 className="hidden">Streams</h2>
              <Twitch className="absolute top-0 right-0 z-10 mt-auto h-4 w-4 translate-x-1/2 -translate-y-1/2 fill-white stroke-[#6441a5] motion-safe:animate-bounce" />
              <ErrorBoundary fallback={<WidgetDiedFallback />}>
                <div className="mx-auto max-w-3xl">
                  <Carousel
                    plugins={[
                      Autoplay({
                        delay: 10_000,
                        stopOnMouseEnter: true,
                      }),
                    ]}
                    className="w-full max-w-3xl"
                    opts={{
                      loop: true,
                      active: streams.length > 1,
                    }}
                  >
                    <CarouselContent>
                      {streams.map((s) => (
                        <CarouselItem
                          key={s.slug}
                          className={cn({
                            "cursor-all-scroll": streams.length > 1,
                          })}
                        >
                          <StreamCard stream={s} />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>
              </ErrorBoundary>
            </div>
          </div>
        )}
        <div className="relative flex flex-col gap-4">
          <GamesAndEventsGrid
            filtersProps={filtersProps}
            games={filteredGames}
            events={events}
          />
        </div>
      </div>
    </div>
  );
};

const IndexPage = ({ data }: PageProps<Queries.IndexPageQuery>) => {
  const games = useGamesFromMarkdown(data);
  const streams = useGameStreamsFromMarkdown(data);

  return (
    <Layout>
      <Toaster />
      <SingleToast data={data.toasts.edges[0]?.node.frontmatter} />
      <Main games={games} streams={streams} />
      <Faq
        faq={data.faq.edges
          .map((e) => e.node.frontmatter)
          .filter((q) => q?.content && q.title)
          .sort((a, b) => (a?.order ?? -1) - (b?.order ?? -1))
          .map((q) => ({ title: q?.title ?? "", content: q?.content ?? "" }))}
      />
      <StructuredDataScripts games={games} />
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
    faq: allMarkdownRemark(filter: { frontmatter: { type: { eq: "faq" } } }) {
      edges {
        node {
          frontmatter {
            title
            content
            order
          }
        }
      }
    }
    liveStreamsOnTwitch: allMarkdownRemark(
      filter: { frontmatter: { type: { eq: "liveStreams_twitch" } } }
    ) {
      edges {
        node {
          frontmatter {
            game
            platform
            date
            name
            slug
          }
        }
      }
    }
    twitchChannels: allMarkdownRemark(
      filter: { frontmatter: { type: { eq: "liveStreamPlatforms_twitch" } } }
    ) {
      edges {
        node {
          frontmatter {
            game
            category
            channel
          }
        }
      }
    }
    toasts: allMarkdownRemark(
      filter: { frontmatter: { type: { eq: "toast" } } }
    ) {
      edges {
        node {
          frontmatter {
            title
            description
            withLogo
            duration
            order
          }
        }
      }
    }
  }
`;

export default IndexPage;
