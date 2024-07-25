import {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = PropsWithChildren & {
  defaultTheme?: Theme;
  storageKey?: string | null;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  getPreference: () => "dark" | "light";
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  getPreference: () => "dark",
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);
const isServer = typeof window === "undefined";

// Include this in the head to avoid flickering on page load
// "dark"===localStorage["arpgTimeline.uiTheme"]||!(["arpgTimeline.uiTheme"]in localStorage)&&window.matchMedia("(prefers-color-scheme: dark)").matches?document.documentElement.classList.add("dark"):document.documentElement.classList.add("light");

export const ThemeProvider = ({
  children,
  defaultTheme = "system",
  storageKey,
  ...props
}: ThemeProviderProps) => {
  if (isServer) {
    return children;
  }

  const [theme, setTheme] = useState<Theme>(() =>
    isServer || !storageKey
      ? defaultTheme
      : (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );

  useEffect(() => {
    if (isServer) {
      return;
    }

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    setTheme(defaultTheme);
  }, [defaultTheme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      if (storageKey) {
        localStorage.setItem(storageKey, theme);
      }
      setTheme(theme);
    },
    getPreference: () =>
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
