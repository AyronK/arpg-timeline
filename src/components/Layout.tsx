import { Footer } from "@/components/Footer";
import useSiteMetadata from "@/hooks/useSiteMetadata";
import { Button } from "@/ui/Button";

export const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <header className="container relative mt-4 md:mt-8">
        <div className="relative">
          <div className="flex flex-row items-center justify-between gap-2 md:justify-center">
            <a
              href="/"
              rel="self"
              className="relative z-20 text-base font-semibold tracking-[0.3rem] sm:text-lg md:ml-auto md:mr-auto md:text-4xl"
            >
              <h1 className="flex flex-row items-center md:gap-2">
                <svg
                  width="56"
                  height="56"
                  className="mx-auto scale-75 md:scale-100"
                  viewBox="0 0 135.5 135.5"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ fill: "currentcolor" }}
                >
                  <g id="g30">
                    <path d="m 70.81945,42.064616 c 0,3.981897 -0.176669,9.020496 0.867531,12.917506 0.134933,0.503576 2.215487,6.551009 2.215487,1.904734 V 42.064634 c -1.027673,3e-6 -2.055345,-3e-6 -3.083018,-1.8e-5 z" />
                    <path d="m 42.673364,41.954545 c -0.606056,12.099291 7.664416,18.605211 15.892775,25.393157 1.145259,1.410279 1.784909,3.328684 1.018926,5.069775 -1.948451,4.893115 -17.504605,7.58712 -16.961871,30.605423 1.688969,1.06786 1.91691,1.34714 3.574188,2.21871 22.955139,13.74077 18.499945,33.08757 22.926098,25.12286 6.156155,-12.78112 10.697663,-19.18217 22.818196,-26.53645 2.446085,-0.47651 2.940288,-18.742702 -12.948434,-28.206733 -1.437529,-1.248325 -3.319114,-2.663745 -2.993796,-4.807272 -0.577689,-6.134481 16.957807,-8.549756 16.957807,-28.859213 H 87.06807 c 0.183648,7.946797 -4.784093,15.063498 -12.840669,19.988893 0,5.629239 0.0058,11.768107 0.0058,17.639301 3.623685,1.783747 13.783346,8.135593 13.434322,23.156734 -3.153635,-1.82075 -6.505354,-3.680604 -13.080338,-5.505615 0.781359,11.347615 -1.099322,19.707865 -6.19032,29.403495 -0.0373,-29.474863 -0.07434,-55.207948 -0.1111,-84.682808 H 61.899586 V 61.335531 C 59.537512,61.107002 48.85447,55.512821 48.469531,41.98506 c -2.124499,0 -4.368585,-0.0304 -5.796167,-0.03051 z M 61.667037,79.83492 c 0.543678,0.715893 0.07678,2.442357 0.232544,3.546168 v 13.85277 c -2.124546,0.230348 -4.180639,1.091065 -6.244667,1.658369 -2.632414,1.250083 -5.304628,2.428153 -7.695567,4.115443 0.163231,-2.90418 0.0092,-5.857672 1.050661,-8.625745 1.056052,-3.624934 2.953426,-7.015823 5.677084,-9.649997 1.953199,-2.050992 4.40747,-3.713661 6.979945,-4.897008 z" />
                    <path d="m 91.984566,29.854508 c -1.935171,4.7e-5 -3.556717,1.325377 -4.017842,3.116606 l -40.369629,-0.04651 c -0.531391,-1.750021 -2.144998,-2.946483 -3.973918,-2.94659 -2.293743,5.5e-5 -4.15318,1.859492 -4.153235,4.153235 5.5e-5,2.293743 1.859492,4.15318 4.153235,4.153235 l 2.217953,-0.09302 c 14.287226,-0.05255 27.786928,-0.05579 41.903902,-0.08062 l 4.239534,0.05013 c 2.293743,-5.5e-5 4.15318,-1.859492 4.153235,-4.153235 -5.5e-5,-2.293742 -1.859492,-4.15318 -4.153235,-4.153235 z" />
                    <path d="m 71.331563,23.344312 -7.338244,1.904398 -0.472124,4.54148 8.189878,-0.0016 z" />
                    <path d="m 82.202218,20.113501 c 0.558608,2.298248 1.318533,4.55545 1.559594,6.918441 1.406334,0.74476 2.759169,1.583425 4.132048,2.386934 C 91.168781,26.212 99.927024,27.130212 98.755338,36.137222 97.095533,38.457168 118.09052,51.572948 111.71136,81.044371 103.51771,108.65172 86.755387,107.1133 78.897354,120.49845 76.921409,123.72208 116.62784,111.70317 119.55052,75.332366 122.00527,41.58475 96.398375,24.147688 82.202198,20.113491 Z" />
                    <path d="M 53.487692,19.940902 C 26.37067,28.670796 16.109162,51.194971 15.851856,71.250029 16.596482,109.15992 54.181956,121.74488 57.054399,121.11053 50.798992,109.71802 24.14341,101.45587 22.857936,73.670739 20.891725,55.491159 32.47581,41.908185 36.980688,37.375586 35.721801,26.162022 44.393249,26.576216 47.9764,29.2474 c 1.306886,-0.855081 2.658724,-1.624937 4.118612,-2.189013 0.396312,-2.327415 1.023286,-4.601714 1.629874,-6.880717 l -0.118855,-0.118339 z" />
                    <path d="m 71.000317,17.880045 -6.479708,1.666049 -0.343131,3.434932 7.01611,-1.846398 z" />
                    <path d="m 67.796379,2.7610718 c -3.525274,-10e-8 -6.383073,2.857799 -6.383073,6.3830729 0.0036,2.5426753 1.247081,4.7237603 3.580954,5.7328423 l -0.29485,2.630988 6.230111,-1.558561 v -1.261938 c 2.002206,-1.128016 3.243489,-3.245244 3.24993,-5.5433313 0,-3.5252735 -2.857799,-6.3830724 -6.383072,-6.3830729 z" />
                  </g>
                </svg>
                <span className="text-nowrap">aRPG Timeline</span>
              </h1>
            </a>
            <div className="relative right-0 flex flex-row items-center justify-center gap-2 md:absolute md:top-1/2 md:-translate-y-1/2">
              <Button variant={"ghost"} asChild className="px-2 md:px-4">
                <a
                  href="https://www.buymeacoffee.com/ayron"
                  rel="external nofollow noreferrer"
                  target="_blank"
                >
                  <div className="grid h-[1.4rem] w-[1.4rem] place-content-center rounded-full bg-current 2xl:mr-2">
                    <img
                      src="/assets/bmc-logo-no-background.png"
                      className="m-auto h-[1rem] w-[1rem]"
                      alt="Buy me a coffee logo"
                    />
                  </div>
                  <span className="hidden 2xl:block">Support me</span>
                </a>
              </Button>
              <Button variant={"ghost"} asChild className="px-2 2xl:px-4">
                <a
                  href="https://github.com/AyronK/arpg-timeline/issues"
                  rel="external nofollow noreferrer"
                  target="_blank"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    version="1.1"
                    className="h-[1.2rem] w-[1.2rem] fill-current 2xl:mr-2"
                  >
                    <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                  </svg>
                  <span className="hidden 2xl:block">Request a feature</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>
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
      <meta property="og:image" content="/assets/seoimage.png" />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={siteUrl} />
      <meta property="twitter:title" content={title} />
      <meta
        property="twitter:description"
        content="Stay ahead in your favorite ARPGs with our season tracker for Path of Exile and Path of Exile 2 leagues, Diablo IV seasons, and Last Epoch cycles. Never miss a release again!"
      />
      <meta property="twitter:image" content="/assets/seoimage.png" />
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </>
  );
};
