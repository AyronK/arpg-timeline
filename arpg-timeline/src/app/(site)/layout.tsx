import "../globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";
import { Cinzel, Montserrat } from "next/font/google";
import Script from "next/script";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SimpleAnalytics } from "@/components/SimpleAnalytics";
import { Toaster } from "@/ui/Toaster";

const cinzel = Cinzel({
    subsets: ["latin"],
    variable: "--font-cinzel",
    weight: ["400", "500", "600", "700", "800", "900"],
});

const montserrat = Montserrat({
    subsets: ["latin"],
    variable: "--font-montserrat",
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    style: ["normal", "italic"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${cinzel.variable} ${montserrat.variable}`}>
            <body className="scrollbar scrollbar-thumb-muted-foreground scrollbar-track-muted scrollbar-w-1.5 scrollbar-h-1.5 flex min-h-screen flex-col overflow-x-hidden">
                <SimpleAnalytics />
                {process.env.SPEED_INSIGHTS_ENABLED && <SpeedInsights />}
                <Toaster />
                <Header />
                <main className="flex flex-1 flex-col">{children}</main>
                <Footer />
            </body>
            <Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
        </html>
    );
}

export const metadata: Metadata = {
    authors: [{ name: "Ayron", url: process.env.NEXT_PUBLIC_GITHUB_URL }],
    creator: "Ayron",
    metadataBase: process.env.SITE_URL ? new URL(process.env.SITE_URL) : null,
    verification: {
        google: process.env.GOOGLE_SITE_VERIFICATION,
    },
    other: {
        "msapplication-TileColor": "#082f49",
        "theme-color": "#082f49",
    },
};
