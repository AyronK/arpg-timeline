import { Footer } from "@/components/Footer";
import useSiteMetadata from "@/hooks/useSiteMetadata";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/ui/Button";

export const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="arpgTimeline.uiTheme">
      <header>
        <div className="relative">
          <div className="flex justify-center">
            <a
              href="/"
              rel="self"
              className="relative z-20 mx-auto my-4 mb-2 text-2xl font-semibold md:my-8 md:text-4xl"
            >
              <h1>aRPG Timeline</h1>
            </a>
          </div>
          <div className="container absolute left-0 right-0 top-16 z-10 flex flex-row justify-end gap-2 md:top-8">
            <Button variant={"outline"} asChild className="px-2 md:px-4">
              <a
                href="https://www.buymeacoffee.com/ayron"
                rel="external nofollow noreferrer"
                target="_blank"
              >
                <div className="grid h-[1.4rem] w-[1.4rem] place-content-center rounded-full dark:bg-current 2xl:mr-2">
                  <img
                    src="/assets/bmc-logo-no-background.png"
                    className="m-auto h-[1rem] w-[1rem]"
                    alt="Buy me a coffee logo"
                  />
                </div>
                <span className="hidden 2xl:block">Support me</span>
              </a>
            </Button>
            <Button variant={"outline"} asChild className="px-2 2xl:px-4">
              <a
                href="https://github.com/AyronK/arpg-timeline/issues"
                rel="external nofollow noreferrer"
                target="_blank"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  version="1.1"
                  data-view-component="true"
                  className="h-[1.2rem] w-[1.2rem] fill-current 2xl:mr-2"
                >
                  <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                </svg>
                <span className="hidden 2xl:block">Request a feature</span>
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
    </>
  );
};
