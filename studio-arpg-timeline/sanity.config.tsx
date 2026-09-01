import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { table } from "@sanity/table";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./schemaTypes/structure";

export default defineConfig({
    name: "default",
    title: `aRPG Timeline | ${process.env.SANITY_STUDIO_DATASET}`,
    icon: () => (
        <img
            src="/static/icon.png"
            alt="Studio Logo"
            style={{ height: "inherit", objectFit: "contain" }}
        />
    ),

    projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
    dataset: process.env.SANITY_STUDIO_DATASET!,

    plugins: [structureTool(structure), visionTool(), table()],

    schema: {
        types: schemaTypes as any,
        // Category-scoped "New" buttons for the Articles desk lists.
        templates: (prev: any[]) => [
            ...prev,
            {
                id: "article-news",
                title: "Article: News",
                schemaType: "article",
                value: { category: "news" },
            },
            {
                id: "article-resources",
                title: "Article: Resources",
                schemaType: "article",
                value: { category: "resources" },
            },
        ],
    },
});
