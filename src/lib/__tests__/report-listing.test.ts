import { describe, expect, it } from "vitest";
import {
	createPreparer,
	createReportFilter,
	createReportListing,
} from "../../test/report-listing.ts";
import {
	RECIPIENT_GROUPS,
	countByPreparerType,
	countByRecipientGroup,
	isInView,
	matchesFilter,
} from "../report-listing.ts";
import { RECIPIENT_TYPES } from "../report.ts";

const annual = createReportListing({ id: "annual", frequency: "annual" });
const triggered = createReportListing({
	id: "triggered",
	frequency: "event-triggered",
});
const oneTime = createReportListing({ id: "one-time", frequency: "one-time" });

describe("RECIPIENT_GROUPS", () => {
	it("puts every recipient type in exactly one group", () => {
		const grouped = RECIPIENT_GROUPS.flatMap((group) => group.recipientTypes);
		expect(grouped.toSorted()).toEqual([...RECIPIENT_TYPES].toSorted());
	});
});

describe("isInView", () => {
	it("shows only scheduled reports in the recurring view", () => {
		expect(isInView("recurring", annual)).toBe(true);
		expect(isInView("recurring", triggered)).toBe(false);
		expect(isInView("recurring", oneTime)).toBe(false);
	});

	it("shows triggered and one-time reports in the non-recurring view", () => {
		expect(isInView("non-recurring", annual)).toBe(false);
		expect(isInView("non-recurring", triggered)).toBe(true);
		expect(isInView("non-recurring", oneTime)).toBe(true);
	});

	it("shows everything in the all view", () => {
		expect(isInView("all", annual)).toBe(true);
		expect(isInView("all", triggered)).toBe(true);
		expect(isInView("all", oneTime)).toBe(true);
	});
});

describe("matchesFilter", () => {
	it("matches everything when nothing is filtered", () => {
		expect(matchesFilter(createReportFilter(), annual)).toBe(true);
	});

	describe("searching", () => {
		const listing = createReportListing(
			{ name: "TEST Wellness Report", recipient: "PA Department of Education" },
			{ code: "246", title: "TEST Student Wellness" },
		);
		const matchesSearch = (search: string): boolean =>
			matchesFilter(createReportFilter({ search }), listing);

		it("ignores case", () => {
			expect(matchesSearch("WELLNESS")).toBe(true);
		});

		it("needs every word to appear somewhere", () => {
			expect(matchesSearch("wellness education")).toBe(true);
			expect(matchesSearch("wellness transportation")).toBe(false);
		});

		it("finds a report by its policy code", () => {
			expect(matchesSearch("246")).toBe(true);
		});

		it("finds a report by its frequency label", () => {
			expect(matchesSearch("annual")).toBe(true);
		});

		it("treats a blank search as no search", () => {
			expect(matchesSearch("   ")).toBe(true);
		});
	});

	it("narrows to every multi-year frequency at once", () => {
		const filter = createReportFilter({ frequency: "extra-annually" });
		expect(
			matchesFilter(
				filter,
				createReportListing({ frequency: "every-5-years" }),
			),
		).toBe(true);
		expect(matchesFilter(filter, annual)).toBe(false);
	});

	it("narrows to one frequency", () => {
		const filter = createReportFilter({ frequency: "monthly" });
		expect(matchesFilter(filter, annual)).toBe(false);
		expect(
			matchesFilter(filter, createReportListing({ frequency: "monthly" })),
		).toBe(true);
	});

	it("narrows to one section", () => {
		const filter = createReportFilter({ sectionNumber: "200" });
		expect(matchesFilter(filter, annual)).toBe(false);
		expect(
			matchesFilter(
				filter,
				createReportListing({}, { section: { number: "200", name: "TEST" } }),
			),
		).toBe(true);
	});

	it("matches any of the chosen recipient groups", () => {
		const filter = createReportFilter({
			recipientGroupIds: new Set(["public", "government"]),
		});
		expect(
			matchesFilter(
				filter,
				createReportListing({ recipientType: "federal-agency" }),
			),
		).toBe(true);
		expect(
			matchesFilter(filter, createReportListing({ recipientType: "board" })),
		).toBe(false);
	});

	it("matches a report when any of its preparers has a chosen type", () => {
		const filter = createReportFilter({ preparerTypes: new Set(["board"]) });
		const listing = createReportListing({
			preparers: [
				createPreparer({ type: "superintendent" }),
				createPreparer({ type: "board" }),
			],
		});
		expect(matchesFilter(filter, listing)).toBe(true);
	});

	it("matches any of the chosen preparer types", () => {
		const filter = createReportFilter({
			preparerTypes: new Set(["board", "employees"]),
		});
		expect(
			matchesFilter(
				filter,
				createReportListing({
					preparers: [createPreparer({ type: "employees" })],
				}),
			),
		).toBe(true);
		expect(
			matchesFilter(
				filter,
				createReportListing({
					preparers: [createPreparer({ type: "superintendent" })],
				}),
			),
		).toBe(false);
	});
});

describe("countByRecipientGroup", () => {
	const listings = [
		createReportListing({ id: "a", recipientType: "board" }),
		createReportListing({ id: "b", recipientType: "state-agency" }),
		createReportListing({ id: "c", recipientType: "federal-agency" }),
		createReportListing({
			id: "d",
			recipientType: "board",
			frequency: "event-triggered",
		}),
	];

	it("counts what each group would show under the other filters", () => {
		const counts = countByRecipientGroup(
			createReportFilter({ view: "recurring" }),
			listings,
		);
		expect(counts.get("board")).toBe(1);
		expect(counts.get("government")).toBe(2);
		expect(counts.get("public")).toBe(0);
	});

	it("ignores the recipient groups already chosen", () => {
		const counts = countByRecipientGroup(
			createReportFilter({ recipientGroupIds: new Set(["board"]) }),
			listings,
		);
		expect(counts.get("government")).toBe(2);
	});
});

describe("countByPreparerType", () => {
	const listings = [
		createReportListing({
			id: "a",
			preparers: [createPreparer({ type: "board" })],
		}),
		createReportListing({
			id: "b",
			preparers: [createPreparer({ type: "employees" })],
			recipientType: "public",
		}),
		createReportListing({
			id: "c",
			preparers: [createPreparer({ type: "employees" })],
		}),
	];

	it("counts what each preparer type would show under the other filters", () => {
		const counts = countByPreparerType(
			createReportFilter({ recipientGroupIds: new Set(["board"]) }),
			listings,
		);
		expect(counts.get("board")).toBe(1);
		expect(counts.get("employees")).toBe(1);
		expect(counts.get("unspecified")).toBe(0);
	});

	it("ignores the preparer types already chosen", () => {
		const counts = countByPreparerType(
			createReportFilter({ preparerTypes: new Set(["board"]) }),
			listings,
		);
		expect(counts.get("employees")).toBe(2);
	});
});
