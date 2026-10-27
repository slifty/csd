import { describe, expect, it } from "vitest";
import { boardDocsRetrievedOn, readRetrievedOn } from "../source.ts";

describe("boardDocsRetrievedOn", () => {
	it("is the date the BoardDocs snapshot was taken", () => {
		expect(boardDocsRetrievedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/v);
	});
});

describe("readRetrievedOn", () => {
	it("refuses a date that is not YYYY-MM-DD", () => {
		expect(() =>
			readRetrievedOn({ boardDocsRetrievedOn: "October 26, 2026" }),
		).toThrow("boardDocsRetrievedOn");
	});

	it("refuses a date that does not exist", () => {
		expect(() =>
			readRetrievedOn({ boardDocsRetrievedOn: "2026-02-30" }),
		).toThrow("boardDocsRetrievedOn");
	});

	it("refuses a file without the date", () => {
		expect(() => readRetrievedOn({})).toThrow("boardDocsRetrievedOn");
	});
});
