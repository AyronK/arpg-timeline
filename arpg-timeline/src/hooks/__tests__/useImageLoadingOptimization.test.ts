import { renderHook } from "@testing-library/react";

import { useDashboardImageLoadingOptimization } from "../useDashboardImageLoadingOptimization";

// Mock the useBreakpoint hook
jest.mock("../useBreakpoint", () => ({
    useBreakpoint: jest.fn(),
}));

const mockUseBreakpoint = require("../useBreakpoint").useBreakpoint;

describe("useImageLoadingOptimization", () => {
    it("should load first 10 images on desktop (md breakpoint)", () => {
        mockUseBreakpoint.mockReturnValue({ isMd: true });

        const { result } = renderHook(() => useDashboardImageLoadingOptimization());

        expect(result.current.shouldLoadImage(0)).toBe(true);
        expect(result.current.shouldLoadImage(9)).toBe(true);
        expect(result.current.shouldLoadImage(10)).toBe(false);
        expect(result.current.shouldLoadImage(15)).toBe(false);
    });

    it("should load first 2 images on mobile (below md breakpoint)", () => {
        mockUseBreakpoint.mockReturnValue({ isMd: false });

        const { result } = renderHook(() => useDashboardImageLoadingOptimization());

        expect(result.current.shouldLoadImage(0)).toBe(true);
        expect(result.current.shouldLoadImage(1)).toBe(true);
        expect(result.current.shouldLoadImage(2)).toBe(false);
        expect(result.current.shouldLoadImage(5)).toBe(false);
    });
});
