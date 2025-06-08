import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
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

    plugins: [structureTool(structure), visionTool()],

    schema: {
        types: schemaTypes as any,
    },
});
