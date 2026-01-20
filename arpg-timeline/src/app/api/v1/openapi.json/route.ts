import { NextResponse } from "next/server";

import openApiSpec from "@/lib/openapi.json";

export async function GET() {
    const isProduction = process.env.NODE_ENV === "production";
    const baseUrl = process.env.SITE_URL || "http://localhost:3000";

    const servers =
        openApiSpec.servers?.filter((server) => {
            if (isProduction) {
                return server.url.includes("arpg-timeline.com");
            } else {
                return server.url.includes("localhost");
            }
        }) || [];

    const spec = {
        ...openApiSpec,
        servers:
            servers.length > 0
                ? servers
                : [
                      {
                          url: `${baseUrl}/api/v1`,
                          description: isProduction ? "Production server" : "Development server",
                      },
                  ],
    };

    return NextResponse.json(spec);
}

export const revalidate = 3600;
