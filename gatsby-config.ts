import type { GatsbyConfig } from "gatsby";
import adapter from "gatsby-adapter-netlify";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `aRPG Timeline`,
    siteUrl: `https://arpg-timeline.ayronk.com`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "aRPG Seasons Timeline",
        short_name: "aRPG Timeline",
        start_url: "/",
        theme_color: "#082f49",
        background_color: "#082f49",
        display: "standalone",
        icon: "./static/assets/icon.png",
        crossOrigin: `use-credentials`,
      },
    },
    "gatsby-plugin-postcss",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/static/img`,
        name: "uploads",
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/static/img`,
        name: "img",
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/src/pages`,
        name: "pages",
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/static/assets`,
        name: "assets",
      },
    },
    `gatsby-plugin-image`,
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          "gatsby-remark-relative-images",
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 512,
            },
          },
          {
            resolve: "gatsby-remark-copy-linked-files",
            options: {
              destinationDir: "static",
            },
          },
        ],
      },
    },
    "gatsby-plugin-sitemap",
    "gatsby-plugin-decap-cms",
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        host: "https://arpg-timeline.ayronk.com/",
        sitemap: "https://arpg-timeline.ayronk.com/sitemap-index.xml",
        policy: [
          {
            userAgent: "*",
            allow: ["/"],
            disallow: [],
          }
        ],
      },
    },
  ],
  adapter: adapter({
    excludeDatastoreFromEngineFunction: false,
  }),
};

export default config;
