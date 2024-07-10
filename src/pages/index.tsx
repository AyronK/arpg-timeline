import * as React from "react";
import { graphql, PageProps } from "gatsby";
import SeasonCard from "../components/SeasonCard";
import { Layout } from "../components/Layout";
import { useSearchParams } from "../hooks/useSearchParams";
import { FiltersDrawer } from "@/components/FiltersDrawer";

const HOUR = 1000 * 60 * 60;
const DAY = HOUR * 24;
const GRACE_PERIOD = DAY * 2;

const IndexPage = ({ data }: PageProps<Queries.IndexPageQuery>) => {
  const inGracePeriod = (startDate: string) => {
    return new Date().getTime() - new Date(startDate).getTime() < GRACE_PERIOD;
  };

  const [, setSearchParam, getSearchParam] = useSearchParams();
  const searchParam = getSearchParam("exclude");
  const excludedSlugs =
    typeof searchParam === "string"
      ? [searchParam]
      : (searchParam as string[]) ?? [];
  const games = data.allMarkdownRemark.edges
    .map((e) => e.node.frontmatter)
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
    .sort((a, b) => {
      if (
        a.currentSeason?.startDate &&
        inGracePeriod(a.currentSeason.startDate)
      ) {
        return -1;
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
    });

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

  return (
    <Layout>
      <div className="container mx-auto px-4 mb-20">
        <p className="hidden md:block max-w-prose mx-auto text-center text-lg md:text-xl">
          Stay ahead in your favorite ARPGs with the season tracker.
          <br />
          Never miss a season start or end again!
        </p>
        <div className="flex flex-col gap-6 mt-2 md:mt-8">
          <aside>
            <FiltersDrawer
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
          </aside>
          <article className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
            {visibleGames.map((game) => (
              <SeasonCard key={game!.slug} {...game} />
            ))}
          </article>
        </div>
      </div>
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
