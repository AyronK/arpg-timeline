export interface GameNewsItem {
    title: string;
    link: string;
    description: string;
    pubDate: string;
}

export interface GameNewsDbEntry {
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

export interface GameNewsInsert {
    game_slug: string;
    steam_app_id: number;
    title: string;
    link: string;
    description: string;
    pub_date: string;
}
