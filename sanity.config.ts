import { defineConfig } from "sanity";
import { visionTool } from "@sanity/vision";

import { schemaTypes } from "./src/sanity/schemaTypes";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "demo";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
    name: "default",
    title: "GIMO Studio",
    projectId,
    dataset,
    basePath: "/studio",
    plugins: [visionTool()],
    schema: {
        types: schemaTypes,
    },
});
