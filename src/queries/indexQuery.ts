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
            showCountdown: boolean;
            startDate: string;
          };
        };
      };
    }[];
  };
};
