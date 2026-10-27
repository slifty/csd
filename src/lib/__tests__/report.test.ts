import { describe, expect, it } from "vitest";
import { isRecurring } from "../report.ts";

describe("isRecurring", () => {
	it("is true for a report on a schedule", () => {
		expect(isRecurring({ frequency: "annual" })).toBe(true);
	});

	it("is true for a standing duty", () => {
		expect(isRecurring({ frequency: "ongoing" })).toBe(true);
	});

	it("is false for a report something has to happen to trigger", () => {
		expect(isRecurring({ frequency: "event-triggered" })).toBe(false);
	});

	it("is false for a one-time report", () => {
		expect(isRecurring({ frequency: "one-time" })).toBe(false);
	});
});
