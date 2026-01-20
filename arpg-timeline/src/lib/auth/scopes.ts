import { JWTPayload } from "./jwt";

export type Scope =
    | "read_games"
    | "read_active_seasons"
    | "read_all_seasons"
    | "read_streams"
    | "read_game_statistics";

export function hasScope(payload: JWTPayload, requiredScope: Scope): boolean {
    return payload.scopes.includes(requiredScope);
}

export function hasAnyScope(payload: JWTPayload, requiredScopes: Scope[]): boolean {
    return requiredScopes.some((scope) => payload.scopes.includes(scope));
}

export function hasAllScopes(payload: JWTPayload, requiredScopes: Scope[]): boolean {
    return requiredScopes.every((scope) => payload.scopes.includes(scope));
}

export const ENDPOINT_SCOPES: Record<string, Scope[]> = {
    "/api/v1/games": ["read_games"],
    "/api/v1/games/seasons": ["read_active_seasons", "read_all_seasons"],
    "/api/v1/games/{slug}/seasons": ["read_active_seasons", "read_all_seasons"],
};

export function getRequiredScopes(pathname: string): Scope[] {
    if (ENDPOINT_SCOPES[pathname]) {
        return ENDPOINT_SCOPES[pathname];
    }

    for (const [pattern, scopes] of Object.entries(ENDPOINT_SCOPES)) {
        if (pattern.includes("{slug}")) {
            const regex = new RegExp(pattern.replace("{slug}", "[^/]+"));
            if (regex.test(pathname)) {
                return scopes;
            }
        }
    }

    return [];
}
