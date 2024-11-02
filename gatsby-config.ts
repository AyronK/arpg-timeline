import type { GatsbyConfig } from "gatsby";
import adapter from "gatsby-adapter-netlify";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `aRPG Timeline | Seasons tracker`,
    siteUrl: `https://arpg-timeline.com`    
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
        path: `${__dirname}/src/documents`,
        name: "documents",
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
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        host: "https://arpg-timeline.com/",
        sitemap: "https://arpg-timeline.com/sitemap-index.xml",
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
    {
      resolve: `gatsby-plugin-decap-cms`,
      options: {
        manualInit: true,
        enableIdentityWidget: false,
        modulePath: `${__dirname}/src/cms.ts`,
      },
    },
  ],
  adapter: adapter({
    excludeDatastoreFromEngineFunction: false,
  }),
};

export default config;
