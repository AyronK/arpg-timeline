import * as React from "react";
import { Helmet } from "react-helmet";
import { Footer } from "./Footer";

export const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <Helmet>
        <title>aRPG Seasons Timeline</title>

        <link rel="canonical" href="https://arpg-timeline.ayronk.com" />
        <meta
          name="keywords"
          content="path of exile, diablo 4, diablo iv, last epoch, action rpg, arpg, season, cycle, league"
        />
        <meta name="title" content="aRPG Seasons Timeline" />
        <meta
          name="description"
          content="Stay ahead in your favorite ARPGs with our season tracker for Path of Exile leagues, Diablo and Torchlight seasons, and Last Epoch cycles. Never miss a release again!"
        />
        <meta name="author" content="Ayron, https://github.com/AyronK" />

        <meta
          name="google-site-verification"
          content="mip_V2TnnP_VIKq30oWBXCZoleGzNDaemmdqflXjOYI"
        />

        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://ayronk.github.io/arpg-timeline/"
        />
        <meta property="og:title" content="aRPG Seasons Timeline" />
        <meta
          property="og:description"
          content="Stay ahead in your favorite ARPGs with our season tracker for Path of Exile and Path of Exile 2 leagues, Diablo IV seasons, and Last Epoch cycles. Never miss a release again!"
        />
        <meta property="og:image" content="/assets/seoimage.jpeg" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://ayronk.github.io/arpg-timeline/"
        />
        <meta property="twitter:title" content="aRPG Seasons Timeline" />
        <meta
          property="twitter:description"
          content="Stay ahead in your favorite ARPGs with our season tracker for Path of Exile and Path of Exile 2 leagues, Diablo IV seasons, and Last Epoch cycles. Never miss a release again!"
        />
        <meta property="twitter:image" content="/assets/seoimage.jpeg" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/assets/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/assets/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/assets/favicon-16x16.png"
        />
        <link rel="manifest" href="/assets/site.webmanifest" />

        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="styles.min.css" />
        <script type="module" src="src.js"></script>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS Feed"
          href="/rss.xml"
        />
      </Helmet>
      <main>{children}</main>
      <Footer />
    </>
  );
};
