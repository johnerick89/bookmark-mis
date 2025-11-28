import {
  formatCurrency,
  formatDateToLocal,
  generateYAxis,
  generatePagination,
} from "../utils";
import type { Revenue } from "../definitions";

describe("utils", () => {
  describe("formatCurrency", () => {
    it("should format currency correctly", () => {
      expect(formatCurrency(12345)).toBe("$123.45");
      expect(formatCurrency(0)).toBe("$0.00");
      expect(formatCurrency(100000)).toBe("$1,000.00");
      expect(formatCurrency(999999)).toBe("$9,999.99");
    });

    it("should handle negative amounts", () => {
      expect(formatCurrency(-12345)).toBe("-$123.45");
    });

    it("should format large amounts with comma separators", () => {
      expect(formatCurrency(1234567)).toBe("$12,345.67");
    });
  });

  describe("formatDateToLocal", () => {
    it("should format date correctly", () => {
      const dateStr = "2024-01-15T10:30:00Z";
      const formatted = formatDateToLocal(dateStr);
      expect(formatted).toMatch(/Jan/);
      expect(formatted).toMatch(/15/);
      expect(formatted).toMatch(/2024/);
    });

    it("should use default locale (en-US)", () => {
      const dateStr = "2024-01-15T10:30:00Z";
      const formatted = formatDateToLocal(dateStr);
      expect(typeof formatted).toBe("string");
      expect(formatted.length).toBeGreaterThan(0);
    });

    it("should accept custom locale", () => {
      const dateStr = "2024-01-15T10:30:00Z";
      const formatted = formatDateToLocal(dateStr, "en-GB");
      expect(typeof formatted).toBe("string");
    });

    it("should handle different date formats", () => {
      const dateStr = "2024-12-25";
      const formatted = formatDateToLocal(dateStr);
      expect(formatted).toMatch(/Dec/);
      expect(formatted).toMatch(/25/);
      expect(formatted).toMatch(/2024/);
    });
  });

  describe("generateYAxis", () => {
    it("should generate y-axis labels for revenue data", () => {
      const revenue: Revenue[] = [
        { month: "Jan", revenue: 1000 },
        { month: "Feb", revenue: 2000 },
        { month: "Mar", revenue: 3000 },
      ];
      const result = generateYAxis(revenue);

      expect(result).toHaveProperty("yAxisLabels");
      expect(result).toHaveProperty("topLabel");
      expect(result.topLabel).toBe(3000);
      expect(result.yAxisLabels).toContain("$3K");
      expect(result.yAxisLabels).toContain("$0K");
    });

    it("should handle empty revenue array", () => {
      const revenue: Revenue[] = [];
      const result = generateYAxis(revenue);

      expect(result.topLabel).toBe(-Infinity);
      expect(Array.isArray(result.yAxisLabels)).toBe(true);
    });

    it("should round up to nearest thousand", () => {
      const revenue: Revenue[] = [{ month: "Jan", revenue: 1500 }];
      const result = generateYAxis(revenue);

      expect(result.topLabel).toBe(2000);
      expect(result.yAxisLabels).toContain("$2K");
    });

    it("should handle large revenue values", () => {
      const revenue: Revenue[] = [
        { month: "Jan", revenue: 50000 },
        { month: "Feb", revenue: 75000 },
      ];
      const result = generateYAxis(revenue);

      expect(result.topLabel).toBe(75000);
      expect(result.yAxisLabels.length).toBeGreaterThan(0);
    });

    it("should include zero in labels", () => {
      const revenue: Revenue[] = [{ month: "Jan", revenue: 5000 }];
      const result = generateYAxis(revenue);

      expect(result.yAxisLabels).toContain("$0K");
    });
  });

  describe("generatePagination", () => {
    it("should return all pages when total pages is 7 or less", () => {
      expect(generatePagination(1, 5)).toEqual([1, 2, 3, 4, 5]);
      expect(generatePagination(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    it("should show first 3 pages, ellipsis, and last 2 when on first pages", () => {
      expect(generatePagination(1, 10)).toEqual([1, 2, 3, "...", 9, 10]);
      expect(generatePagination(2, 10)).toEqual([1, 2, 3, "...", 9, 10]);
      expect(generatePagination(3, 10)).toEqual([1, 2, 3, "...", 9, 10]);
    });

    it("should show first 2, ellipsis, and last 3 when on last pages", () => {
      expect(generatePagination(10, 12)).toEqual([1, 2, "...", 10, 11, 12]);
      expect(generatePagination(11, 12)).toEqual([1, 2, "...", 10, 11, 12]);
      expect(generatePagination(12, 12)).toEqual([1, 2, "...", 10, 11, 12]);
    });

    it("should show first page, ellipsis, current and neighbors, ellipsis, last page when in middle", () => {
      expect(generatePagination(5, 10)).toEqual([1, "...", 4, 5, 6, "...", 10]);
      expect(generatePagination(6, 10)).toEqual([1, "...", 5, 6, 7, "...", 10]);
    });

    it("should handle edge cases", () => {
      expect(generatePagination(1, 1)).toEqual([1]);
      expect(generatePagination(1, 2)).toEqual([1, 2]);
    });

    it("should handle large page numbers", () => {
      const result = generatePagination(50, 100);
      expect(result[0]).toBe(1);
      expect(result[result.length - 1]).toBe(100);
      expect(result).toContain(50);
    });
  });
});
