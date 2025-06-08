import { StructureBuilder } from "sanity/structure";
import { FiCalendar, FiLink, FiServer, FiTwitch, FiMessageCircle, FiBell } from "react-icons/fi";
import { IoLogoGameControllerB } from "react-icons/io";
import { SiSteam, SiReddit } from "react-icons/si";

export const structure = {
    structure: (S: StructureBuilder) =>
        S.list()
            .title("Content")
            .items([
                // Games section
                S.listItem()
                    .title("Games")
                    .icon(IoLogoGameControllerB)
                    .child(S.documentTypeList("game").title("Games")),

                // Seasons section
                S.listItem()
                    .title("Seasons")
                    .icon(FiCalendar)
                    .child(
                        S.documentTypeList("game")
                            .title("Game's Seasons")
                            .child((gameId) =>
                                S.documentList()
                                    .title("Seasons")
                                    .filter('_type == "season" && references($gameId)')
                                    .defaultOrdering([
                                        { field: "start.startDate", direction: "desc" },
                                    ])
                                    .params({ gameId }),
                            ),
                    ),

                // Crawler Sources
                S.listItem()
                    .title("Crawler Sources")
                    .icon(FiLink)
                    .child(
                        S.list()
                            .title("Crawler Sources")
                            .items([
                                S.listItem()
                                    .title("HTTP Sources")
                                    .icon(FiServer)
                                    .child(
                                        S.documentTypeList("crawlerSourceHttp").title(
                                            "HTTP Sources",
                                        ),
                                    ),
                                S.listItem()
                                    .title("Steam Sources")
                                    .icon(SiSteam)
                                    .child(
                                        S.documentTypeList("crawlerSourceSteam").title(
                                            "Steam Sources",
                                        ),
                                    ),
                                S.listItem()
                                    .title("Reddit Sources")
                                    .icon(SiReddit)
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
                    .icon(FiTwitch)
                    .child(
                        S.list()
                            .title("Live Streams")
                            .items([
                                S.listItem()
                                    .title("Twitch Streams")
                                    .icon(FiTwitch)
                                    .child(
                                        S.documentTypeList("game")
                                            .title("Game's streams")
                                            .child((gameId) =>
                                                S.documentList()
                                                    .title("Twitch Streams")
                                                    .filter(
                                                        '_type == "liveStreamTwitch" && references($gameId)',
                                                    )
                                                    .params({ gameId })
                                                    .defaultOrdering([
                                                        { field: "date", direction: "desc" },
                                                    ]),
                                            ),
                                    ),
                                S.listItem()
                                    .title("Twitch Platforms")
                                    .icon(FiServer)
                                    .child(
                                        S.documentTypeList("liveStreamPlatformTwitch").title(
                                            "Twitch Platforms",
                                        ),
                                    ),
                            ]),
                    ),

                // FAQ
                S.listItem()
                    .title("FAQ")
                    .icon(FiMessageCircle)
                    .child(
                        S.documentTypeList("faq")
                            .title("FAQ")
                            .defaultOrdering([{ field: "order", direction: "asc" }]),
                    ),

                // Toasts
                S.listItem()
                    .title("Toasts")
                    .icon(FiBell)
                    .child(S.documentTypeList("toast").title("Toasts")),
            ]),
};
