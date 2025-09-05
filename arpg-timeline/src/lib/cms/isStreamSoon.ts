export function isStreamSoon(date: string): boolean {
    return !!date && Date.now() > new Date(date).getTime() - 30 * 60 * 1000;
}
