import type { Preview } from "@storybook/react";
import { withThemeFromJSXProvider } from "@storybook/addon-themes";
import { ThemeProvider } from "../src/components/ThemeProvider";
import GlobalStyles from "./global-styles";
import React from "react";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    withThemeFromJSXProvider({
      Provider: ({ theme, children }) => {
        return (
          <ThemeProvider defaultTheme={theme} storageKey="arpgTimeline.uiTheme">
            {children}
          </ThemeProvider>
        );
      },
      GlobalStyles: GlobalStyles,
      defaultTheme: "dark",
      themes: {
        dark: "dark",
        light: "light",
      },
    }),
  ],
};

export default preview;
