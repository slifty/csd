import { describe, expect, it } from "vitest";
import { readRawPolicyHtml } from "../boarddocs-snapshot.ts";
import { htmlToText, normalizeForComparison } from "../html.ts";
import { parseReport, reports } from "../reports.ts";

const policyText = (policyId: string): string =>
	normalizeForComparison(htmlToText(readRawPolicyHtml(policyId)));

describe("reports", () => {
	it("includes every report in data/reports", () => {
		expect(reports).toHaveLength(645);
	});

	it("gives every report a distinct id", () => {
		expect(new Set(reports.map((report) => report.id)).size).toBe(
			reports.length,
		);
	});

	it.each(reports.map((report) => [report.id, report] as const))(
		"%s quotes its policy word for word",
		(_id, report) => {
			expect(policyText(report.policyId)).toContain(
				normalizeForComparison(report.quote),
			);
		},
	);
});

describe("parseReport", () => {
	const [validReport] = reports;
	if (validReport === undefined) {
		throw new Error("There are no reports to build a test case from");
	}
	const fileOf = (id: string): string => `/data/reports/${id}.json`;
	const parseVariant = (changes: Record<string, unknown>): unknown =>
		parseReport(fileOf(validReport.id), { ...validReport, ...changes });

	it("accepts a valid report", () => {
		expect(parseVariant({})).toEqual(validReport);
	});

	it("refuses a report whose id does not match its file name", () => {
		expect(() => parseReport(fileOf("test-other-name"), validReport)).toThrow(
			"does not match its file name",
		);
	});

	it("refuses a report citing a policy that does not exist", () => {
		expect(() => parseVariant({ policyId: "TESTMISSING0" })).toThrow(
			"TESTMISSING0",
		);
	});

	it("refuses a frequency it does not know", () => {
		expect(() => parseVariant({ frequency: "fortnightly" })).toThrow(
			"fortnightly",
		);
	});

	it("refuses a missing field", () => {
		expect(() => parseVariant({ quote: undefined })).toThrow('"quote"');
	});

	it("accepts a report with no deadline", () => {
		expect(parseVariant({ deadline: null })).toMatchObject({ deadline: null });
	});

	it("refuses something that is not an object", () => {
		expect(() => parseReport(fileOf(validReport.id), ["TEST"])).toThrow(
			"must be a JSON object",
		);
	});
});
