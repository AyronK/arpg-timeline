import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

export default defineConfig({
    name: "default",
    title: "arpg-timeline",

    projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
    dataset: process.env.SANITY_STUDIO_DATASET!,

    plugins: [
        structureTool({
            structure: (S) =>
                S.list()
                    .title("Content")
                    .items([
                        // Games section
                        S.listItem()
                            .title("Games")
                            .child(S.documentTypeList("game").title("Games")),

                        // Seasons section
                        S.listItem()
                            .title("Seasons")
                            .child(S.documentTypeList("season").title("Seasons")),

                        // Crawler Sources
                        S.listItem()
                            .title("Crawler Sources")
                            .child(
                                S.list()
                                    .title("Crawler Sources")
                                    .items([
                                        S.listItem()
                                            .title("HTTP Sources")
                                            .child(
                                                S.documentTypeList("crawlerSourceHttp").title(
                                                    "HTTP Sources",
                                                ),
                                            ),
                                        S.listItem()
                                            .title("Steam Sources")
                                            .child(
                                                S.documentTypeList("crawlerSourceSteam").title(
                                                    "Steam Sources",
                                                ),
                                            ),
                                        S.listItem()
                                            .title("Reddit Sources")
                                            .child(
                                                S.documentTypeList("crawlerSourceReddit").title(
                                                    "Reddit Sources",
                                                ),
                                            ),
                                    ]),
                            ),

                        // Live Streams
                        S.listItem()
                            .title("Live Streams")
                            .child(
                                S.list()
                                    .title("Live Streams")
                                    .items([
                                        S.listItem()
                                            .title("Twitch Streams")
                                            .child(
                                                S.documentTypeList("liveStreamTwitch").title(
                                                    "Twitch Streams",
                                                ),
                                            ),
                                        S.listItem()
                                            .title("Twitch Platforms")
                                            .child(
                                                S.documentTypeList(
                                                    "liveStreamPlatformTwitch",
                                                ).title("Twitch Platforms"),
                                            ),
                                    ]),
                            ),

                        // FAQ
                        S.listItem()
                            .title("FAQ")
                            .child(
                                S.documentTypeList("faq")
                                    .title("FAQ")
                                    .defaultOrdering([{ field: "order", direction: "asc" }]),
                            ),

                        // Toasts
                        S.listItem()
                            .title("Toasts")
                            .child(S.documentTypeList("toast").title("Toasts")),
                    ]),
        }),
        visionTool(),
    ],

    schema: {
        types: schemaTypes as any,
    },
});
