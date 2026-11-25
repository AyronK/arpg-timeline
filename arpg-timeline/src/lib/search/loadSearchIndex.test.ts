import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SearchIndex } from "./types";

const INDEX: SearchIndex = { games: [] };

const ok = () => Promise.resolve(new Response("[]", { status: 200 }));
const failed = () => Promise.resolve(new Response("", { status: 500 }));

const importLoader = async () => {
    vi.resetModules();
    return import("./loadSearchIndex");
};

describe("loadSearchIndex", () => {
    const fetchMock = vi.fn<typeof fetch>();

    beforeEach(() => {
        fetchMock.mockReset();
        vi.stubGlobal("fetch", fetchMock);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("fetches once and reuses the result", async () => {
        fetchMock.mockImplementation(ok);
        const { loadSearchIndex, SEARCH_INDEX_URL } = await importLoader();

        const [first, second] = await Promise.all([loadSearchIndex(), loadSearchIndex()]);
        const third = await loadSearchIndex();

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(SEARCH_INDEX_URL);
        expect(first).toEqual(INDEX);
        expect(second).toBe(first);
        expect(third).toBe(first);
    });

    it("retries after a failed request", async () => {
        fetchMock.mockImplementationOnce(failed).mockImplementation(ok);
        const { loadSearchIndex } = await importLoader();

        await expect(loadSearchIndex()).rejects.toThrow("500");
        await expect(loadSearchIndex()).resolves.toEqual(INDEX);
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("prefetch warms the cache", async () => {
        fetchMock.mockImplementation(ok);
        const { loadSearchIndex, prefetchSearchIndex } = await importLoader();

        prefetchSearchIndex();
        await expect(loadSearchIndex()).resolves.toEqual(INDEX);
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("prefetch swallows errors", async () => {
        fetchMock.mockImplementation(failed);
        const { prefetchSearchIndex } = await importLoader();

        prefetchSearchIndex();
        await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
        await new Promise((resolve) => setTimeout(resolve, 0));
    });
});
