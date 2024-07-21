import type { GatsbyConfig } from "gatsby";
import adapter from "gatsby-adapter-netlify";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `aRPG Timeline`,
    siteUrl: `https://arpg-timeline.ayronk.com`,
  },
  graphqlTypegen: true,
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
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
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-relative-images`,
          {
            resolve: `gatsby-remark-images`,
            options: {},
          },
        ],
      },
    },
    `gatsby-plugin-image`,
    "gatsby-plugin-sharp",
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
          },
        ],
      },
    },
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
    `gatsby-plugin-sass`,
    "gatsby-plugin-postcss",
    {
      resolve: "gatsby-plugin-simple-analytics",
      options: {
        trackPageViews: true,
        events: true,
        eventsGlobal: "sa_event",
      },
    },
    {
      resolve: `gatsby-plugin-alias-imports`,
      options: {
        alias: {
          "@": "./src",
        },
        extensions: [],
      },
    },
  ],
  adapter: adapter({
    excludeDatastoreFromEngineFunction: false,
  }),
};

export default config;
