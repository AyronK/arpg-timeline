// tailwind.config.ts was deprecated in Tailwind v4, keep this file in sync with global.css to have control over breakpoints from code
const config = {
    theme: {
        screens: {
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            "2xl": "1536px",
            "3xl": "1920px",
            "4xl": "2560px",
        },
    },
};

export default config;
