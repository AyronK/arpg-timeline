declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_PATREON_URL: string;
            NEXT_PUBLIC_GITHUB_URL: string;
            NEXT_PUBLIC_GITHUB_REPO: string;
            NEXT_PUBLIC_DISCORD_URL: string;
            NEXT_PUBLIC_CONTACT_EMAIL: string;
            NEXT_PUBLIC_BUY_ME_A_COFFEE_URL?: string;
        }
    }
}

export {};
