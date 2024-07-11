import * as React from "react";
import { Footer } from "./Footer";
import useSiteMetadata from "../hooks/useSiteMetadata";
import { ThemeProvider } from "./ThemeProvider";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

export const Layout = ({
  children,
  themeButtonClassName,
}: React.PropsWithChildren & { themeButtonClassName?: string | undefined }) => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="arpgTimeline.uiTheme">
      <header>
        <div className="relative">
          <a href="/" rel="self">
            <h1 className="text-2xl md:text-4xl font-semibold text-center pt-4 md:pt-8 pb-2 px-4">
              aRPG Timeline
            </h1>
          </a>{" "}
          <div
            className={cn(
              "absolute right-12 top-3 md:right-20 md:top-8 flex flex-col md:flex-row justify-center gap-2",
              themeButtonClassName,
            )}
          >
            <Button variant={"outline"} asChild>
              <a
                href="https://www.buymeacoffee.com/ayron"
                rel="external nofollow"
                target="_blank"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  version="1.1"
                  data-view-component="true"
                  className="h-[1.2rem] w-[1.2rem] mr-4 fill-current"
                >
                  <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                </svg>
                Support
              </a>
            </Button>
            <Button variant={"outline"} asChild>
              <a
                href="https://github.com/AyronK/arpg-timeline/issues"
                rel="external nofollow"
                target="_blank"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  version="1.1"
                  data-view-component="true"
                  className="h-[1.2rem] w-[1.2rem] mr-4 fill-current"
                >
                  <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                </svg>
                Request a feature
              </a>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main>{children}</main>
      <Footer />
    </ThemeProvider>
  );
};

export const Head = () => {
  const { title, siteUrl } = useSiteMetadata();
  return (
    <>
      <title>{title}</title>
      {/* Workaround for flickering caused by a theme change due to loading from settings from  local storage */}
      <script
        dangerouslySetInnerHTML={{
          __html: `"dark"===localStorage["arpgTimeline.uiTheme"]||!(["arpgTimeline.uiTheme"]in localStorage)&&window.matchMedia("(prefers-color-scheme: dark)").matches?document.documentElement.classList.add("dark"):document.documentElement.classList.add("light");`,
        }}
      />
      <link rel="canonical" href={siteUrl} />
      <meta
        name="keywords"
        content="path of exile, diablo, last epoch, torchlight infinite, hero siege, new league release date, new season release date, diablo alternative, poe alternative, best arpgs, season start, league start, new cycle release date, diablo 2, diablo 3, diablo 4, diablo iv, action rpg, arpg, arpg-timeline, arpg tracker, season, seasons, arpg seasons, cycle, league, poe, poe2"
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
