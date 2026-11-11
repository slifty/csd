import { describe, expect, it } from "vitest";
import { createReportFilter } from "../../test/report-listing.ts";
import {
	QUICK_REPORTS,
	findQuickReport,
	fitsQuickReports,
	initialMode,
} from "../quick-reports.ts";
import { UNFILTERED } from "../report-listing.ts";
import { policies } from "../server/policies.ts";

describe("QUICK_REPORTS", () => {
	it("gives every quick report its own id", () => {
		const ids = QUICK_REPORTS.map(({ id }) => id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it("gives every quick report its own filter", () => {
		QUICK_REPORTS.forEach((quickReport) => {
			expect(findQuickReport(quickReport.filter)).toBe(quickReport);
		});
	});

	it("names only policy sections that exist", () => {
		const sectionNumbers = new Set(
			policies.map(({ section }) => section.number),
		);
		QUICK_REPORTS.forEach(({ filter }) => {
			if (filter.sectionNumber !== null) {
				expect(sectionNumbers).toContain(filter.sectionNumber);
			}
		});
	});

	it("never offers the unfiltered list as a quick report", () => {
		expect(findQuickReport(UNFILTERED)).toBeNull();
	});
});

describe("findQuickReport", () => {
	const regularToBoard = createReportFilter({
		view: "recurring",
		recipientGroupIds: new Set(["board"]),
	});

	it("finds the quick report a filter matches", () => {
		expect(findQuickReport(regularToBoard)?.id).toBe("regular-to-board");
	});

	it("finds nothing once a filter is narrowed further", () => {
		expect(
			findQuickReport({ ...regularToBoard, reportType: "plan" }),
		).toBeNull();
		expect(findQuickReport({ ...regularToBoard, search: "budget" })).toBeNull();
	});

	it("ignores a search that is only whitespace", () => {
		expect(findQuickReport({ ...regularToBoard, search: "  " })?.id).toBe(
			"regular-to-board",
		);
	});
});

describe("fitsQuickReports", () => {
	it("fits the unfiltered list and every quick report", () => {
		expect(fitsQuickReports(UNFILTERED)).toBe(true);
		QUICK_REPORTS.forEach(({ filter }) => {
			expect(fitsQuickReports(filter)).toBe(true);
		});
	});

	it("does not fit a filter no quick report shows", () => {
		expect(fitsQuickReports(createReportFilter({ reportType: "plan" }))).toBe(
			false,
		);
	});
});

describe("initialMode", () => {
	const matched = createReportFilter({
		recipientGroupIds: new Set(["public"]),
	});
	const unmatched = createReportFilter({ reportType: "plan" });

	it("keeps the requested mode when quick reports can show the filter", () => {
		expect(initialMode(matched, "quick")).toBe("quick");
		expect(initialMode(matched, "advanced")).toBe("advanced");
		expect(initialMode(UNFILTERED, "quick")).toBe("quick");
	});

	it("opens advanced mode when quick reports would hide the filter", () => {
		expect(initialMode(unmatched, "quick")).toBe("advanced");
	});
});
