// Non-production deploys (and `SHOW_UNRELEASED_ARTICLES=true`) show articles that
// aren't `productionReady` yet.
export const showUnreleasedArticles =
    process.env.SHOW_UNRELEASED_ARTICLES === "true" || process.env.VERCEL_ENV !== "production";
