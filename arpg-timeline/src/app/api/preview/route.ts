import { draftMode } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import { getArticlePath } from "@/lib/articles/articleUrl";
import type { ArticleCategory } from "@/lib/cms/queries/articleQuery";

/**
 * Enables Next draft mode so an unpublished article renders with the real
 * layout, then redirects to it. Configure this as the Studio preview URL:
 *   /api/preview?secret=<SANITY_PREVIEW_SECRET>&category=news&slug=<slug>[&gameSlug=<g>]
 */
export async function GET(req: NextRequest) {
    const secret = process.env.SANITY_PREVIEW_SECRET;
    const { searchParams } = new URL(req.url);

    if (!secret || searchParams.get("secret") !== secret) {
        return new NextResponse("Invalid preview secret", { status: 401 });
    }

    const category = searchParams.get("category");
    const slug = searchParams.get("slug");
    const gameSlug = searchParams.get("gameSlug");

    if ((category !== "news" && category !== "resources") || !slug) {
        return new NextResponse("Missing or invalid category/slug", { status: 400 });
    }

    (await draftMode()).enable();

    const target = getArticlePath({
        category: category as ArticleCategory,
        slug,
        gameSlug: gameSlug || undefined,
    });

    return NextResponse.redirect(new URL(target, req.url));
}
