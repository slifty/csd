import { describe, expect, it } from "vitest";
import { formatIsoDate } from "../dates.ts";

describe("formatIsoDate", () => {
	it("writes the date out in full", () => {
		expect(formatIsoDate("2021-03-09")).toBe("March 9, 2021");
	});

	it("does not shift the day with the local time zone", () => {
		expect(formatIsoDate("2024-01-01")).toBe("January 1, 2024");
	});
});
