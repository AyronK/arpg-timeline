import { NextRequest, NextResponse } from "next/server";

const validRoutes = [
    "/",
    "/faq",
    "/looking-for-moderators",
    "/privacy",
    "/api/revalidate",
    "/api/webhook",
];
const routePrefixes = [
    "/docs/html/",
    "/docs/obs/",
    "/docs/api",
    "/embed/season-widget/",
    "/embed/countdown-widget/",
    "/dashboard/",
    "/game/",
    "/assets/",
    "/api/v1/",
];

function isValidRoute(pathname: string): boolean {
    if (validRoutes.includes(pathname)) {
        return true;
    }

    if (routePrefixes.some((prefix) => pathname.startsWith(prefix))) {
        return true;
    }

    if (pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|webp|avif|css|js|woff|woff2|ttf|eot)$/)) {
        return true;
    }

    return false;
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (!isValidRoute(pathname)) {
        const url = request.nextUrl.clone();
        url.pathname = "/404";
        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|manifest.webmanifest).*)",
    ],
};
