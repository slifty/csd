import { describe, expect, it } from "vitest";
import {
	createReportFilter,
	createReportListing,
} from "../../test/report-listing.ts";
import {
	madLibBlanks,
	madLibChoicesOf,
	madLibFilter,
	matchingOptions,
} from "../mad-lib.ts";
import { UNFILTERED } from "../report-listing.ts";

const listings = [
	createReportListing({ frequency: "annual" }),
	createReportListing(
		{ frequency: "one-time" },
		{ section: { number: "800", name: "TEST Operations" } },
	),
];
const blanks = madLibBlanks(listings);

describe("madLibBlanks", () => {
	it("offers only options that some report matches", () => {
		const optionIds = blanks.map(({ options }) => options.map(({ id }) => id));
		expect(optionIds).toEqual([
			["recurring", "ad-hoc", "annual", "one-time"],
			["superintendent"],
			["board"],
			["800", "900"],
		]);
	});

	it("words each option to fit the sentence", () => {
		const [, preparer] = blanks;
		expect(preparer?.options.map(({ label }) => label)).toEqual([
			"the Superintendent",
		]);
	});
});

describe("madLibFilter", () => {
	it("is unfiltered when nothing is chosen", () => {
		expect(madLibFilter(blanks, {})).toEqual(UNFILTERED);
	});

	it("combines every chosen blank", () => {
		expect(
			madLibFilter(blanks, {
				frequency: "ad-hoc",
				preparer: "superintendent",
				recipient: "board",
				section: "900",
			}),
		).toEqual(
			createReportFilter({
				view: "non-recurring",
				preparerTypes: new Set(["superintendent"]),
				recipientGroupIds: new Set(["board"]),
				sectionNumber: "900",
			}),
		);
	});
});

describe("madLibChoicesOf", () => {
	it("recovers the choices behind a mad lib filter", () => {
		const choices = { frequency: "annual", recipient: "board" };
		expect(madLibChoicesOf(blanks, madLibFilter(blanks, choices))).toEqual(
			choices,
		);
	});

	it("rejects a filter the mad lib cannot show", () => {
		expect(
			madLibChoicesOf(blanks, createReportFilter({ reportType: "plan" })),
		).toBeNull();
		expect(
			madLibChoicesOf(
				blanks,
				createReportFilter({
					recipientGroupIds: new Set(["board", "public"]),
				}),
			),
		).toBeNull();
		expect(
			madLibChoicesOf(
				blanks,
				createReportFilter({ view: "recurring", frequency: "annual" }),
			),
		).toBeNull();
	});
});

describe("matchingOptions", () => {
	it("keeps options whose label contains the query, ignoring case", () => {
		const [, preparer] = blanks;
		expect(
			matchingOptions(preparer?.options ?? [], " SUPER ").map(({ id }) => id),
		).toEqual(["superintendent"]);
	});
});
