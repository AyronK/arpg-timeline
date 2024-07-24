import { lazy, Suspense, useState } from "react";
import { graphql, PageProps } from "gatsby";
import { SeasonCard } from "@/components/SeasonCard/SeasonCard";
import { Layout } from "@/components/Layout";
import { FiltersDialog } from "@/components/FiltersDialog";
import { Faq } from "@/components/Faq";
import { Button } from "@/ui/Button";
import { ChevronsUpDown, UsersRound } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/ui/Collapsible";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { Game } from "@/lib/cms/games.types";
import { useGameFilters } from "@/hooks/useGameFilters";
import { useGamesFromMarkdown } from "@/lib/cms/useGamesFromMarkdown";
import { useTimelineEvents } from "@/hooks/useTimelineEvents";

const Timeline = lazy(() =>
  import("@/components/Timeline/Timeline").then((module) => ({
    default: module.Timeline,
  })),
);

const IndexPage = ({ data }: PageProps<Queries.IndexPageQuery>) => {
  const { isMd } = useBreakpoint("md");
  const [timelineOpen, setTimelineOpen] = useState<boolean>();

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
        <p className="mx-auto hidden max-w-prose text-center text-lg md:block md:text-xl">
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
          <div className="relative z-0 flex text-xs lg:container lg:absolute lg:left-0 lg:right-0 lg:top-14 lg:w-full">
            <Button
              variant={"warning"}
              asChild
              className="w-full px-2 lg:ml-auto lg:w-auto lg:px-4"
            >
              <a href="/looking-for-moderators" rel="self">
                <UsersRound className="mr-2 h-[1.2rem] w-[1.2rem]" />
                Looking for moderators!
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
                <SeasonCard {...game} />
              </div>
            ))}
            <div
              aria-hidden
              className="relative order-3 col-span-1 flex flex-col gap-2 rounded-md border bg-card p-4 text-card-foreground md:col-span-2 md:gap-4 md:p-6 xl:col-span-3 3xl:col-span-4 4xl:col-span-5"
            >
              <Collapsible
                onOpenChange={() => setTimelineOpen(true)}
                open={isMd || timelineOpen}
              >
                <CollapsibleTrigger
                  className={cn("flex w-full flex-row justify-between", {
                    hidden: isMd || timelineOpen,
                  })}
                >
                  Click to view timeline
                  <ChevronsUpDown className="h-6 w-6" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Suspense fallback={<div className="h-[500px]">Loading</div>}>
                    <Timeline events={events} />
                  </Suspense>
                </CollapsibleContent>
              </Collapsible>
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
    allMarkdownRemark {
      edges {
        node {
          frontmatter {
            title
            shortName
            official
            slug
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
            currentSeason {
              startDate
              endDate
              title
              url
              endDateNotice
              startDateNotice
            }
            nextSeason {
              title
              startDateNotice
              url
              showCountdown
              startDate
            }
          }
        }
      }
    }
  }
`;

export default IndexPage;
