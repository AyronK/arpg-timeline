import { draftMode } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

/** Turns off draft mode and returns to the given path (or home). */
export async function GET(req: NextRequest) {
    (await draftMode()).disable();
    const to = new URL(req.url).searchParams.get("redirect") || "/";
    return NextResponse.redirect(new URL(to, req.url));
}
