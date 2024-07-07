import * as React from "react";
import { graphql, PageProps } from "gatsby";
import Card from "../components/Card";
import { Layout } from "../components/Layout";
import { useSearchParams } from "../hooks/useSearchParams";

const IndexPage = ({ data }: PageProps<Queries.IndexPageQuery>) => {
  const [, setSearchParam, getSearchParam] = useSearchParams();
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
    });

  const visibleGames = games.filter(
    (g) => !((getSearchParam("exclude") as string[]) ?? []).includes(g!.slug!),
  );

  const toggleFilter = (slug: string) => {
    const filtersParams: string | string[] | null = getSearchParam("exclude");
    const filters =
      filtersParams instanceof Array
        ? filtersParams
        : filtersParams !== null
          ? [filtersParams]
          : [];

    if (filters.includes(slug)) {
      setSearchParam(
        "exclude",
        filters.filter((f) => f !== slug),
      );
    } else {
      filters.push(slug);
      setSearchParam("exclude", filters);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 mb-20">
        <h1 className="text-4xl font-semibold text-center pt-12 pb-4">
          aRPG Timeline
        </h1>
        <p className="max-w-prose mx-auto text-center text-xl">
          Stay ahead in your favorite ARPGs with the season tracker.
          <br />
          Never miss a season start or end again!
        </p>
        <div className="flex flex-col-reverse md:flex-col gap-6 mt-6">
          <section className="flex flex-row gap-4 justify-center flex-wrap">
            {games.map((game) => (
              <div key={game!.slug} className="flex flex-row gap-2">
                <input
                  id={`${game?.slug}-filter`}
                  type="checkbox"
                  onChange={() => toggleFilter(game!.slug!)}
                  checked={
                    !((getSearchParam("exclude") as string[]) ?? []).includes(
                      game!.slug!,
                    )
                  }
                />
                <label htmlFor={`${game?.slug}-filter`}>{game?.title}</label>
              </div>
            ))}
          </section>
          <article className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
            {visibleGames.map((game) => (
              <Card key={game!.slug} {...game} />
            ))}
          </article>
        </div>
      </div>
    </Layout>
  );
};

export { Head } from "../components/Layout";

export const query = graphql`
  query IndexPage {
    allMarkdownRemark(sort: { frontmatter: { order: ASC } }) {
      edges {
        node {
          frontmatter {
            title
            shortName
            slug
            order
            seasonKeyword
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
