import { describe, expect, it } from "vitest";
import { createReportFilter } from "../../test/report-listing.ts";
import { readReportFilter, writeReportFilter } from "../report-filter-url.ts";

const SECTION_NUMBERS: ReadonlySet<string> = new Set(["200", "800"]);

const read = (query: string): ReturnType<typeof readReportFilter> =>
	readReportFilter(new URLSearchParams(query), SECTION_NUMBERS);

describe("readReportFilter", () => {
	it("starts from the default view with nothing filtered", () => {
		expect(read("")).toEqual(createReportFilter());
	});

	it("reads every filter", () => {
		expect(
			read(
				"view=recurring&q=wellness&frequency=annual&type=plan&section=200&to=board,government&from=superintendent,employees",
			),
		).toEqual(
			createReportFilter({
				view: "recurring",
				search: "wellness",
				frequency: "annual",
				reportType: "plan",
				sectionNumber: "200",
				recipientGroupIds: new Set(["board", "government"]),
				preparerTypes: new Set(["superintendent", "employees"]),
			}),
		);
	});

	it("reads an old multi-year frequency as extra-annually", () => {
		expect(read("frequency=every-3-years")).toEqual(
			createReportFilter({ frequency: "extra-annually" }),
		);
	});

	it("ignores values it does not know", () => {
		expect(
			read(
				"view=TEST&frequency=TEST&type=TEST&section=TEST&to=TEST,public&from=TEST",
			),
		).toEqual(createReportFilter({ recipientGroupIds: new Set(["public"]) }));
	});
});

describe("writeReportFilter", () => {
	it("leaves defaults out of the query", () => {
		expect(writeReportFilter(createReportFilter()).toString()).toBe("");
	});

	it("lists recipient groups in their display order", () => {
		const filter = createReportFilter({
			recipientGroupIds: new Set(["government", "board"]),
		});
		expect(writeReportFilter(filter).get("to")).toBe("board,government");
	});

	it("lists preparer types in their display order", () => {
		const filter = createReportFilter({
			preparerTypes: new Set(["employees", "board"]),
		});
		expect(writeReportFilter(filter).get("from")).toBe("board,employees");
	});

	it("round-trips through readReportFilter", () => {
		const filter = createReportFilter({
			view: "non-recurring",
			search: "TEST notice",
			frequency: "event-triggered",
			reportType: "certification",
			sectionNumber: "800",
			recipientGroupIds: new Set(["families"]),
			preparerTypes: new Set(["outside-parties"]),
		});
		expect(
			readReportFilter(writeReportFilter(filter), SECTION_NUMBERS),
		).toEqual(filter);
	});
});
