import { lazy, Suspense, useState } from "react";
import { graphql, PageProps } from "gatsby";
import SeasonCard from "../components/SeasonCard";
import { Layout } from "../components/Layout";
import { useSearchParams } from "../hooks/useSearchParams";
import { FiltersDialog } from "@/components/FiltersDialog";
import { Faq } from "@/components/Faq";
import { Button } from "@/components/Button";
import { ChevronsUpDown, UsersRound } from "lucide-react";
import { getProgress } from "@/lib/getProgress";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/Collapsible";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { Game } from "@/lib/cms/games.types";

const Timeline = lazy(() =>
  import("@/components/Timeline").then((module) => ({
    default: module.Timeline,
  })),
);

const HOUR = 1000 * 60 * 60;
const DAY = HOUR * 24;
const GRACE_PERIOD = DAY * 2;

const inGracePeriod = (startDate: string) => {
  return new Date().getTime() - new Date(startDate).getTime() < GRACE_PERIOD;
};

const sortBySeasons = (a, b) => {
  if (a.currentSeason?.startDate && inGracePeriod(a.currentSeason.startDate)) {
    return -1;
  }

  if (b.currentSeason?.startDate && inGracePeriod(b.currentSeason.startDate)) {
    return 1;
  }

  const aNextSeasonStart = a.nextSeason?.startDate;
  const bNextSeasonStart = b.nextSeason?.startDate;
  const aCurrentSeasonEnd = a.currentSeason?.endDate;
  const bCurrentSeasonEnd = b.currentSeason?.endDate;

  if (aNextSeasonStart && bNextSeasonStart) {
    return (
      new Date(aNextSeasonStart).getTime() -
      new Date(bNextSeasonStart).getTime()
    );
  }
  if (aNextSeasonStart) {
    return -1;
  }
  if (bNextSeasonStart) {
    return 1;
  }
  if (aCurrentSeasonEnd && bCurrentSeasonEnd) {
    return (
      new Date(aCurrentSeasonEnd).getTime() -
      new Date(bCurrentSeasonEnd).getTime()
    );
  }
  if (aCurrentSeasonEnd) {
    return -1;
  }
  if (bCurrentSeasonEnd) {
    return 1;
  }
  return 0;
};

const IndexPage = ({ data }: PageProps<Queries.IndexPageQuery>) => {
  const [, setSearchParam, getSearchParam] = useSearchParams();
  const { isMd } = useBreakpoint("md");
  const [timelineOpen, setTimelineOpen] = useState<boolean>();
  const searchParam = getSearchParam("exclude");
  const excludedSlugs =
    typeof searchParam === "string"
      ? [searchParam]
      : ((searchParam as string[]) ?? []);
  const games = data.allMarkdownRemark.edges
    .map((e) => e.node.frontmatter as Game)
    .map((g) => {
      if (!g?.nextSeason?.startDate) {
        return g;
      }
      const nextStartDate = new Date(g.nextSeason.startDate);
      const now = new Date();
      if (nextStartDate.getTime() < now.getTime()) {
        return { ...g, currentSeason: g.nextSeason, nextSeason: null };
      }
      return g;
    })
    .map((g) => {
      if (
        g?.currentSeason?.startDate &&
        inGracePeriod(g?.currentSeason?.startDate)
      ) {
        const diff =
          new Date().getTime() - new Date(g.currentSeason.startDate).getTime();
        return {
          ...g,
          currentSeason: {
            ...g.currentSeason,
            justStarted: true,
            startDateNotice:
              diff < 2 * HOUR
                ? "Just started"
                : `Started ${(diff / HOUR).toFixed(0)} hours ago`,
            endDateNotice: " ",
          },
        };
      }
      return g;
    })
    .sort(sortBySeasons);

  const visibleGames = games.filter((g) => !excludedSlugs.includes(g!.slug!));

  const toggleFilter = (slug: string, value: boolean) => {
    const filtersParams: string | string[] | null = getSearchParam("exclude");
    const filters =
      filtersParams instanceof Array
        ? filtersParams
        : filtersParams !== null
          ? [filtersParams]
          : [];

    if (value) {
      setSearchParam(
        "exclude",
        filters.filter((f) => f !== slug),
      );
    } else {
      filters.push(slug);
      setSearchParam("exclude", filters);
    }
  };

  const toggleGroupFilter = (group: string, value: boolean) => {
    const slugs = games
      .filter((g) => (group ? g?.group === group : !g?.group))
      .map((g) => g?.slug ?? "")
      .filter((g) => !!g);

    const filtersParams: string | string[] | null = getSearchParam("exclude");
    const filters =
      filtersParams instanceof Array
        ? filtersParams
        : filtersParams !== null
          ? [filtersParams]
          : [];

    if (value) {
      setSearchParam(
        "exclude",
        filters.filter((f) => !slugs.includes(f)),
      );
    } else {
      setSearchParam("exclude", [...filters, ...slugs]);
    }
  };

  const events = visibleGames.reduce(
    (prev, g) =>
      g?.currentSeason?.startDate
        ? [
            ...prev,
            {
              name: g?.currentSeason?.title,
              game: g.title,
              gameShort: g.shortName,
              startDate: new Date(g?.currentSeason?.startDate),
              startDateNotice: g?.currentSeason?.startDateNotice,
              endDate: new Date(g?.currentSeason.endDate),
              endDateNotice: g?.currentSeason?.endDateNotice,
              progress: getProgress(
                g?.currentSeason?.startDate,
                g?.currentSeason.endDate,
              ),
            },
            {
              name: g?.nextSeason?.title,
              game: g.title,
              gameShort: g.shortName,
              startDate: new Date(g?.nextSeason?.startDate),
              startDateNotice: g?.nextSeason?.startDateNotice,
              endDate: new Date(
                new Date(g.nextSeason.startDate).getTime() +
                  120 * 24 * 50 * 60 * 1000,
              ),
              endDateNotice: g?.nextSeason?.endDateNotice ?? "",
            },
          ]
        : [
            ...prev,
            {
              game: g.title,
              gameShort: g.shortName,
              startDate: new Date(g?.nextSeason?.startDate),
              startDateNotice: g?.nextSeason?.startDateNotice,
              endDate: new Date(g?.nextSeason?.startDate),
              endDateNotice: "n/a",
            },
            {
              name: g?.nextSeason?.title,
              game: g.title,
              gameShort: g.shortName,
              startDate: new Date(g?.nextSeason?.startDate),
              startDateNotice: g?.nextSeason?.startDateNotice,
              endDate: new Date(
                new Date(g.nextSeason.startDate).getTime() +
                  120 * 24 * 50 * 60 * 1000,
              ),
              endDateNotice: g?.nextSeason?.endDateNotice ?? "",
            },
          ],
    [],
  );

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
              checked={games
                .map((g) => g!.slug!)
                .filter((s) => !excludedSlugs.includes(s!))}
              filters={games
                .map((g) => ({
                  label: g!.title!,
                  value: g!.slug!,
                  group: g!.group!,
                }))
                .sort((a, b) => (a.label > b.label ? 1 : -1))}
              onCheckedChange={toggleFilter}
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
            {visibleGames.map((game, idx) => (
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
