// pages/index.js

import * as React from 'react';
import { graphql } from 'gatsby';
import Card from '../components/Card';

const IndexPage = ({ data }) => {
    const games = data.allMarkdownRemark.edges;

    return (
        <html lang="en"> 
            <head>
                <title>aRPG Seasons Timeline</title>

                <link rel="canonical" href="https://arpg-timeline.ayronk.com" />
                <meta name="keywords"
                    content="path of exile, diablo 4, diablo iv, last epoch, action rpg, arpg, season, cycle, league" />
                <meta name="title" content="aRPG Seasons Timeline" />
                <meta name="description"
                    content="Stay ahead in your favorite ARPGs with our season tracker for Path of Exile leagues, Diablo and Torchlight seasons, and Last Epoch cycles. Never miss a release again!" />
                <meta name="author" content="Ayron, https://github.com/AyronK" />

                <meta name="google-site-verification" content="mip_V2TnnP_VIKq30oWBXCZoleGzNDaemmdqflXjOYI" />

                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://ayronk.github.io/arpg-timeline/" />
                <meta property="og:title" content="aRPG Seasons Timeline" />
                <meta property="og:description"
                    content="Stay ahead in your favorite ARPGs with our season tracker for Path of Exile and Path of Exile 2 leagues, Diablo IV seasons, and Last Epoch cycles. Never miss a release again!" />
                <meta property="og:image" content="https://ayronk.github.io/arpg-timeline/assets/seoimage.jpeg" />

                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://ayronk.github.io/arpg-timeline/" />
                <meta property="twitter:title" content="aRPG Seasons Timeline" />
                <meta property="twitter:description"
                    content="Stay ahead in your favorite ARPGs with our season tracker for Path of Exile and Path of Exile 2 leagues, Diablo IV seasons, and Last Epoch cycles. Never miss a release again!" />
                <meta property="twitter:image" content="https://ayronk.github.io/arpg-timeline/assets/seoimage.jpeg" />

                <link rel="apple-touch-icon" sizes="180x180"
                    href="https://ayronk.github.io/arpg-timeline/assets/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32"
                    href="https://ayronk.github.io/arpg-timeline/assets/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16"
                    href="https://ayronk.github.io/arpg-timeline/assets/favicon-16x16.png" />
                <link rel="manifest" href="https://ayronk.github.io/arpg-timeline/assets/site.webmanifest" />

                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="stylesheet" href="styles.min.css" />
                <script type="module" src="src.js"></script>
                <link rel="alternate" type="application/rss+xml" title="RSS Feed" href="/rss.xml" />
            </head>

            <body className="bg-gray-900 text-neutral-200">
                <main className="container mx-auto px-4 mb-20">
                    <h1 className="text-4xl font-semibold text-center pt-12 pb-4">aRPG Timeline</h1>
                    <p className="max-w-prose mx-auto text-center text-xl">Stay ahead in your favorite ARPGs with the season tracker.
                        <br />
                        Never miss a season start or end again!
                    </p>
                    <article className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-12 gap-4 md:gap-8">
                        {games.map(game => (
                            <Card key={game.id} {...game.node.frontmatter} />
                        ))}
                    </article>
                    <footer className="mt-12">
                        <div className="flex flex-row justify-center gap-8">
                            <a href="https://www.buymeacoffee.com/ayron" rel="external nofollow" target="_blank">
                                <img src="/assets/bmc-button.png" width="200" alt="Buy me a coffee logo" /></a>
                            <a href="https://github.com/AyronK/arpg-timeline/issues" rel="external nofollow" target="_blank">
                                <div
                                    className="rounded-lg block p-3 bg-emerald-200 text-black font-semibold flex flex-row gap-3 align-middle">
                                    <svg height="32" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="32"
                                        data-view-component="true"
                                        className="octicon octicon-mark-github v-align-middle color-fg-default">
                                        <path
                                            d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z">
                                        </path>
                                    </svg>
                                    <span className="my-auto text-nowrap">
                                        Request a feature
                                    </span>
                                </div>
                            </a>
                        </div>
                        <section className="mx-auto my-12 flex flex-col gap-4 container max-w-prose">
                            <h2 className="text-2xl">FAQ</h2>

                            <h3 className="font-semibold mt-1">Why does this page exist?</h3>
                            <p className="ml-2">ARPG is a very special genre. The large part of these games' community are the same
                                people
                                cycling between new cycles. If you are one of these people that play these games for a couple of
                                days or weeks
                                each cycle, this site can help you plan your time in regard of new releases!</p>

                            <h3 className="font-semibold mt-1">Are dates displayed in my local time?</h3>
                            <p className="ml-2">Yes! All dates are displayed in the local time of your machine. You can even add an
                                event to
                                your Google Calendar!</p>

                            <h3 className="font-semibold mt-4">How often is this site updated?</h3>
                            <p className="ml-2">The site is updated promptly upon receiving notifications. Expect updates for upcoming
                                seasons
                                within one day of their availability to the public. End dates may experience slight delays as they
                                are less
                                prominently advertised by game publishers.</p>

                            <h3 className="font-semibold mt-1">Can I subscribe to the news?</h3>
                            <p className="ml-2">Certainly! You need to have a RSS feed reader. You can find RSS link at the bottom of
                                the page.
                            </p>

                            <h3 className="font-semibold mt-4">Do you update the site manually?</h3>
                            <p className="ml-2">Unfortunately, yes, at the moment. Automation is being considered for future
                                implementation.</p>

                            <h3 className="font-semibold mt-4">Would you add a new game to the list?</h3>
                            <p className="ml-2">Absolutely! Please submit an issue on our GitHub page (linked above).</p>

                            <h3 className="font-semibold mt-4">Would you add a new feature?</h3>
                            <p className="ml-2">Certainly! Feel free to suggest new features by submitting an issue on our GitHub page.
                            </p>

                            <h3 className="font-semibold mt-4">Can I support your work?</h3>
                            <p className="ml-2">Yes! You can support us by donating a coffee (via the yellow button) or contributing to
                                the
                                development of this site (contact us via GitHub).</p>
                        </section>

                        <div className="flex flex-row justify-end mt-4 gap-1"><a title="RSS Feed" target="_blank"
                            rel="noopener noreferrer nofollow" className="font-semibold hover:opacity-75" href="/assets/rss.xml"
                        >RSS</a></div>

                        <div className="flex flex-row justify-end mt-4 gap-1"><a title="RSS Feed" target="_blank"
                            rel="noopener noreferrer nofollow licence" className="font-semibold hover:opacity-75" href="/assets/about.txt"
                        >About site and
                            licences</a>
                        </div>

                        <div className="flex flex-row justify-end mt-4 gap-1"><a target="_blank" className="font-semibold hover:opacity-75"
                            href="https://100dayscss.ayronk.com/" rel="me">My other work</a></div>


                        <div className="flex flex-row justify-end mt-4 gap-1">
                            &copy; <span id="currentYear">2024</span>-<a className="font-semibold hover:opacity-75"
                                href="https://github.com/AyronK" rel="external nofollow" target="_blank"
                                aria-label="Author's Github Profile - AyronK">AyronK</a>
                        </div>
                    </footer>
                </main>
            </body>
        </html >
    );
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

export default IndexPage;
