export interface SteamNewsItem {
    title: string;
    link: string;
    description: string;
    pubDate: string;
}

export interface SteamNewsDbEntry {
    id: string;
    game_slug: string;
    steam_app_id: number;
    title: string;
    link: string;
    description: string;
    pub_date: string;
    created_at: string;
    updated_at: string;
}

export interface SteamNewsInsert {
    game_slug: string;
    steam_app_id: number;
    title: string;
    link: string;
    description: string;
    pub_date: string;
}
