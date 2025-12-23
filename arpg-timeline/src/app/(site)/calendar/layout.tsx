import { Metadata } from "next";

export const metadata: Metadata = {
    title: "aRPG Calendar Subscription | Season & League Start Dates",
    description:
        "Subscribe to aRPG season calendars and never miss a launch. Get Path of Exile 2 league dates, Diablo 4 season starts, Last Epoch cycles and more in Google Calendar, Apple Calendar, or Outlook.",
    keywords: [
        "arpg calendar",
        "poe 2 calendar",
        "poe2 league calendar",
        "path of exile 2 calendar",
        "diablo 4 calendar",
        "diablo 4 season calendar",
        "last epoch calendar",
        "arpg season calendar",
        "gaming calendar subscription",
        "ics calendar arpg",
        "poe league calendar",
        "season start calendar",
        "arpg release dates calendar",
        "subscribe arpg calendar",
        "d4 season calendar",
    ],
    openGraph: {
        title: "aRPG Season Calendar - Subscribe Now",
        description:
            "Get aRPG season launches directly in your calendar. PoE2 leagues, D4 seasons, Last Epoch cycles and more.",
        siteName: "aRPG Timeline",
        type: "website",
        url: "https://www.arpg-timeline.com/calendar",
        locale: "en_US",
        images: [
            {
                url: "/assets/seoimage.png",
                width: 1200,
                height: 630,
                alt: "aRPG Timeline Calendar Subscription",
                type: "image/png",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "aRPG Season Calendar Subscription",
        description:
            "Never miss a season launch. Subscribe to get PoE2 leagues, D4 seasons, and more in your calendar.",
        images: ["/assets/seoimage.png"],
    },
    alternates: { canonical: "/calendar" },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

const calendarStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": "https://www.arpg-timeline.com/calendar#app",
    name: "aRPG Timeline Calendar",
    description:
        "Subscribe to aRPG season calendar feeds for Path of Exile 2, Diablo 4, Last Epoch and more. Get automatic updates in Google Calendar, Apple Calendar, or Outlook.",
    url: "https://www.arpg-timeline.com/calendar",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
    },
    featureList: [
        "Season start date notifications",
        "Season end date alerts",
        "Developer livestream schedules",
        "Works with Google Calendar, Apple Calendar, Outlook",
        "Automatic sync updates",
    ],
    author: {
        "@type": "Organization",
        name: "aRPG Timeline",
        url: "https://www.arpg-timeline.com",
    },
};

const howToStructuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Subscribe to aRPG Season Calendar",
    description:
        "Learn how to add aRPG season dates to your calendar app for automatic updates on Path of Exile 2 leagues, Diablo 4 seasons, and more.",
    step: [
        {
            "@type": "HowToStep",
            name: "Copy the calendar URL",
            text: "Copy the subscription URL from the aRPG Timeline calendar page",
        },
        {
            "@type": "HowToStep",
            name: "Open your calendar app",
            text: "Open Google Calendar, Apple Calendar, Outlook, or your preferred calendar application",
        },
        {
            "@type": "HowToStep",
            name: "Add calendar from URL",
            text: "Find the 'Add calendar from URL' or 'Subscribe to calendar' option in your app settings",
        },
        {
            "@type": "HowToStep",
            name: "Paste and subscribe",
            text: "Paste the copied URL and confirm to start receiving automatic updates for aRPG season launches",
        },
    ],
};

export default function CalendarLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <script type="application/ld+json">
                {JSON.stringify(calendarStructuredData, null, 2)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(howToStructuredData, null, 2)}
            </script>
            {children}
        </>
    );
}
