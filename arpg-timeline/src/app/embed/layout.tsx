import "../(site)/globals.css";

import { Metadata } from "next";
import { Cinzel, Montserrat } from "next/font/google";
import Script from "next/script";

import { SimpleAnalytics } from "@/components/SimpleAnalytics";

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
            <body className="scrollbar scrollbar-thumb-muted-foreground scrollbar-track-muted scrollbar-w-1.5 scrollbar-h-1.5 flex min-h-screen flex-col bg-transparent">
                <div className="relative">
                    <SimpleAnalytics />
                    {children}
                </div>
            </body>
            <Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
        </html>
    );
}

export const metadata: Metadata = {
    authors: [{ name: "Ayron", url: process.env.GITHUB_URL! }],
    creator: "Ayron",
    metadataBase: process.env.SITE_URL ? new URL(process.env.SITE_URL) : null,
    verification: {
        google: process.env.GOOGLE_SITE_VERIFICATION,
    },
};
