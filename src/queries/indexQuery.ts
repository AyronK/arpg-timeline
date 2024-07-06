import { graphql } from "gatsby";

export type IndexQuery = {
  allMarkdownRemark: {
    edges: {
      node: {
        frontmatter: {
          title: string;
          slug: string;
          order: number;
          seasonKeyword: string;
          logo: string;
          currentSeason: {
            startDate: string;
            endDate: string;
            title: string;
            url: string;
            endDateNotice: string;
            startDateNotice: string;
          };
          nextSeason: {
            title: string;
            startDateNotice: string;
            url: string;
            showCountdown: string;
            startDate: string;
          };
        };
      };
    }[];
  };
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
