export const metadata = {
    title: "aRPG Timeline | API Docs",
    description: "Interactive documentation for the aRPG Timeline API",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
