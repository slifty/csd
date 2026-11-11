import { describe, expect, it } from "vitest";
import {
	createReportFilter,
	createReportListing,
} from "../../test/report-listing.ts";
import {
	DEFAULT_OPTION_ID,
	QUICK_REPORTS,
	availableOptions,
	findQuickReport,
	fitsQuickReports,
	initialMode,
	optionFilter,
	selectionFilter,
	selectionsOf,
} from "../quick-reports.ts";
import type { QuickReport } from "../quick-reports.ts";
import { UNFILTERED } from "../report-listing.ts";
import { policies } from "../server/policies.ts";

const allSelections = QUICK_REPORTS.flatMap(selectionsOf);

describe("QUICK_REPORTS", () => {
	it("gives every quick report its own id", () => {
		const ids = QUICK_REPORTS.map(({ id }) => id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it("gives every modifier its own id within its quick report", () => {
		QUICK_REPORTS.forEach(({ modifierMenu }) => {
			const ids = (modifierMenu?.options ?? []).map(({ id }) => id);
			expect(new Set(ids).size).toBe(ids.length);
		});
	});

	it("gives every quick report and modifier its own filter", () => {
		allSelections.forEach((selection) => {
			expect(findQuickReport(selectionFilter(selection))).toEqual(selection);
		});
	});

	it("names only policy sections that exist", () => {
		const sectionNumbers = new Set(
			policies.map(({ section }) => section.number),
		);
		allSelections.map(selectionFilter).forEach(({ sectionNumber }) => {
			if (sectionNumber !== null) {
				expect(sectionNumbers).toContain(sectionNumber);
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
		const found = findQuickReport(regularToBoard);
		expect(found?.quickReport.id).toBe("regular-to-board");
		expect(found?.modifier).toBeNull();
	});

	it("finds the modifier a filter matches", () => {
		const found = findQuickReport({
			...regularToBoard,
			preparerTypes: new Set(["superintendent"]),
		});
		expect(found?.quickReport.id).toBe("regular-to-board");
		expect(found?.modifier?.id).toBe("superintendent");
	});

	it("finds nothing when more than one preparer is chosen", () => {
		expect(
			findQuickReport({
				...regularToBoard,
				preparerTypes: new Set(["administrators", "superintendent"]),
			}),
		).toBeNull();
	});

	it("finds nothing once a filter is narrowed further", () => {
		expect(
			findQuickReport({ ...regularToBoard, reportType: "plan" }),
		).toBeNull();
		expect(findQuickReport({ ...regularToBoard, search: "budget" })).toBeNull();
	});

	it("ignores a search that is only whitespace", () => {
		expect(
			findQuickReport({ ...regularToBoard, search: "  " })?.quickReport.id,
		).toBe("regular-to-board");
	});
});

const requireQuickReport = (id: string): QuickReport => {
	const quickReport = QUICK_REPORTS.find((candidate) => candidate.id === id);
	if (quickReport === undefined) {
		throw new Error(`No quick report has id ${id}`);
	}
	return quickReport;
};

const regularToBoardReport = requireQuickReport("regular-to-board");

describe("fitsQuickReports", () => {
	it("fits the unfiltered list and every quick report", () => {
		expect(fitsQuickReports(UNFILTERED)).toBe(true);
		allSelections.forEach((selection) => {
			expect(fitsQuickReports(selectionFilter(selection))).toBe(true);
		});
	});

	it("does not fit a filter no quick report shows", () => {
		expect(fitsQuickReports(createReportFilter({ reportType: "plan" }))).toBe(
			false,
		);
	});
});

describe("initialMode", () => {
	const unmatched = createReportFilter({ reportType: "plan" });

	it("keeps the requested mode when quick reports can show the filter", () => {
		expect(initialMode(regularToBoardReport.filter, "quick")).toBe("quick");
		expect(initialMode(regularToBoardReport.filter, "advanced")).toBe(
			"advanced",
		);
		expect(initialMode(UNFILTERED, "quick")).toBe("quick");
	});

	it("opens advanced mode when quick reports would hide the filter", () => {
		expect(initialMode(unmatched, "quick")).toBe("advanced");
	});
});

describe("optionFilter", () => {
	it("finds the filter for an option", () => {
		expect(
			optionFilter(regularToBoardReport, "superintendent").preparerTypes,
		).toEqual(new Set(["superintendent"]));
	});

	it("falls back to the quick report's own filter", () => {
		expect(optionFilter(regularToBoardReport, DEFAULT_OPTION_ID)).toBe(
			regularToBoardReport.filter,
		);
		expect(optionFilter(regularToBoardReport, "TEST")).toBe(
			regularToBoardReport.filter,
		);
	});
});

describe("availableOptions", () => {
	const { modifierMenu: menu } = regularToBoardReport;
	if (menu === null) {
		throw new Error("regular-to-board has no menu");
	}
	const listings = [createReportListing()];
	const ids = (options: ReturnType<typeof availableOptions>): string[] =>
		options.map(({ id }) => id);

	it("offers only options that have reports", () => {
		expect(ids(availableOptions(menu, listings, null))).toEqual([
			"superintendent",
		]);
	});

	it("keeps the selected option even when it has no reports", () => {
		const boardOption = menu.options.find(({ id }) => id === "board") ?? null;
		expect(ids(availableOptions(menu, listings, boardOption))).toEqual([
			"board",
			"superintendent",
		]);
	});
});
