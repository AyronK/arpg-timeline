export function isStreamSoon(date: string): boolean {
    return (
        !!date &&
        Date.now() < new Date(date).getTime() &&
        new Date(date).getTime() - Date.now() <= 30 * 60 * 1000
    );
}
