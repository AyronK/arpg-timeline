import * as React from "react";
import { graphql, PageProps } from "gatsby";
import Card from "../components/Card";
import { Layout } from "../components/Layout";
import { IndexQuery } from "../queries/indexQuery";

const IndexPage = ({ data }: PageProps<IndexQuery>) => {
  const games = data.allMarkdownRemark.edges;

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
        <article className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-12 gap-4 md:gap-8">
          {games.map((dataElement) => (
            <Card
              key={dataElement.node.frontmatter.slug}
              {...dataElement.node.frontmatter}
            />
          ))}
        </article>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query IndexQuery {
    allMarkdownRemark(sort: { frontmatter: { order: ASC } }) {
      edges {
        node {
          frontmatter {
            title
            slug
            order
            seasonKeyword
            logo
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
