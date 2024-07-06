import * as React from "react";
import { Footer } from "./Footer";
import useSiteMetadata from "../hooks/useSiteMetadata";

export const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <main>{children}</main>
      <Footer />
    </>
  );
};

export const Head = () => {
  const { title, siteUrl } = useSiteMetadata();
  return (
    <>
      <title>{title}</title>
      <link rel="canonical" href={siteUrl} />
      <meta
        name="keywords"
        content="path of exile, diablo 4, diablo iv, last epoch, action rpg, arpg, season, cycle, league"
      />
      <meta name="title" content={title} />
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
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={title} />
      <meta
        property="og:description"
        content="Stay ahead in your favorite ARPGs with our season tracker for Path of Exile and Path of Exile 2 leagues, Diablo IV seasons, and Last Epoch cycles. Never miss a release again!"
      />
      <meta property="og:image" content="/assets/seoimage.jpeg" />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={siteUrl} />
      <meta property="twitter:title" content={title} />
      <meta
        property="twitter:description"
        content="Stay ahead in your favorite ARPGs with our season tracker for Path of Exile and Path of Exile 2 leagues, Diablo IV seasons, and Last Epoch cycles. Never miss a release again!"
      />
      <meta property="twitter:image" content="/assets/seoimage.jpeg" />
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link
        rel="alternate"
        type="application/rss+xml"
        title="RSS Feed"
        href="/rss.xml"
      />
    </>
  );
};
