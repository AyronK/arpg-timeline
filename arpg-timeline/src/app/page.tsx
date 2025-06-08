import { Metadata } from "next";

import { Faq } from "@/components/Faq";
import { Main } from "@/components/Home/HomePage";
import { SingleToast } from "@/components/SingleToast";
import { StructuredDataScripts } from "@/components/StructuredDataScripts";
import { parseGamesFromSanity } from "@/lib/cms/parseGamesFromSanity";
import { parseGameStreamsFromSanity } from "@/lib/cms/parseGameStreamsFromSanity";
import { sanityClient } from "@/lib/sanity/sanityClient";

const query = `{
  "games": *[_type == "game"]{
    "slug":slug.current,
    name,
    shortName,
    official,
    seasonKeyword,
    url,
    group,
    "logo": logo.asset->{
      _id,
      url
    }
  },
  "seasons": *[_type == "season"]{
    name,
    "game": game->slug.current,
    url,
    start {
      startDate,
      confirmed,
      overrideText,
      additionalText
    },
    end {
      endDate,
      confirmed,
      overrideText,
      additionalText
    }
  },
  "faq": *[_type == "faq"] | order(order asc){
    title,
    content,
    order
  },
  "liveStreamsOnTwitch": *[_type == "liveStreamTwitch"]{
    "game": game->slug.current,
    "platform": platform->_id,
    date,
    name,
    "slug": slug.current
  },
  "twitchChannels": *[_type == "liveStreamPlatformTwitch"]{
    "game": game->slug.current,
    category,
    channel
  },
  "toast": *[_type == "toast"] | order(order asc)[0]{
    title,
    description,
    withLogo,
    duration,
    order
  }
}`;

const Home = async () => {
    const data = await sanityClient.fetch(query, { revalidate: 3600 });
    const games = parseGamesFromSanity(data);
    const streams = parseGameStreamsFromSanity(data);

    return (
        <>
            <SingleToast data={data.toast} />
            <div className="relative container mx-auto mb-8">
                <Kicker />
                <Main games={games} streams={streams} />
            </div>
            <StructuredDataScripts games={games} />
            <Faq faq={data.faq} />
        </>
    );
};

export default Home;

const Kicker = () => (
    <p className="font-heading mx-auto hidden max-w-prose text-center text-lg md:mt-8 md:block md:text-xl">
        Stay ahead in your favorite ARPGs with the season tracker.
        <br />
        Never miss a season start or end again!
    </p>
);

export const metadata: Metadata = {
    title: "ARPG Timeline | Season Tracker",
    description: "Stay ahead in your favorite ARPGs with our season tracker",
    openGraph: {
        title: "ARPG Timeline",
        description: "Track ARPG seasons for Path of Exile, Diablo, and more",
        siteName: "ARPG Timeline",
        type: "website",
        url: "https://arpg-timeline.com",
        images: [
            {
                url: "/assets/seoimage.png",
                width: 1200,
                height: 630,
                alt: "ARPG Timeline | Season Tracker",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        images: ["/assets/seoimage.png"],
    },
};
