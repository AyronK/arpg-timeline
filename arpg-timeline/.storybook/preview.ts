import "../src/app/globals.css";

import type { Preview } from "@storybook/nextjs-vite";
import { create } from "storybook/theming";

const preview: Preview = {
    parameters: {
        backgrounds: {
            default: "website",
            values: [{ name: "website", value: "#17171c" }],
        },
        controls: {
            matchers: {
                date: /Date$/i,
            },
        },

        a11y: {
            // 'todo' - show a11y violations in the test UI only
            // 'error' - fail CI on a11y violations
            // 'off' - skip a11y checks entirely
            test: "todo",
        },

        docs: {
            theme: create({ base: "dark" }),
        },
    },
};

export default preview;
