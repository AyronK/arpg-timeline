declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_PATREON_URL: string;
            NEXT_PUBLIC_GITHUB_URL: string;
            NEXT_PUBLIC_GITHUB_REPO: string;
            NEXT_PUBLIC_DISCORD_URL: string;
            NEXT_PUBLIC_CONTACT_EMAIL: string;
        }
    }
}

export {};
