import { describe, expect, it } from "vitest";
import { boardDocsItemHtml } from "./fixtures/board-docs-item.ts";
import {
	kindOfCode,
	normalizeCode,
	parseBoardDocsDate,
	parsePolicy,
	parseSection,
} from "../boarddocs.ts";

describe("parseBoardDocsDate", () => {
	it("turns a long-form date into an ISO date", () => {
		expect(parseBoardDocsDate("October 11, 1988")).toBe("1988-10-11");
	});

	it("pads single-digit days", () => {
		expect(parseBoardDocsDate("March 4, 2021")).toBe("2021-03-04");
	});

	it("refuses a month it does not know", () => {
		expect(() => parseBoardDocsDate("Smarch 4, 2021")).toThrow("Smarch");
	});
});

describe("parseSection", () => {
	it("splits the number from the name", () => {
		expect(parseSection("200 - Pupils")).toEqual({
			number: "200",
			name: "Pupils",
		});
	});

	it("refuses a section without a number", () => {
		expect(() => parseSection("Pupils")).toThrow("Pupils");
	});
});

describe("parsePolicy", () => {
	const policy = parsePolicy("TESTID000001", boardDocsItemHtml);

	it("reads the title from the item's metadata, tidying its spacing", () => {
		expect(policy.title).toBe(
			"TEST Visitors To Schools / Grounds and/or Offices",
		);
	});

	it("closes up the space BoardDocs leaves in the code", () => {
		expect(policy.code).toBe("907-Ar");
	});

	it("is an administrative regulation when the code ends in -Ar", () => {
		expect(policy.kind).toBe("administrative-regulation");
	});

	it("decodes entities in the section name", () => {
		expect(policy.section.name).toBe("TEST Community & Visitors");
	});

	it("leaves dates the item does not give as null", () => {
		expect(policy.adopted).toBeNull();
		expect(policy.lastRevised).toBe("2021-03-04");
	});

	it("points at the raw HTML it came from", () => {
		expect(policy.source).toBe("boarddocs/policies/TESTID000001.html");
	});
});

describe("normalizeCode", () => {
	it("closes up a space after the hyphen before Ar", () => {
		expect(normalizeCode("916- Ar")).toBe("916-Ar");
	});

	it("closes up a space before the hyphen before Ar", () => {
		expect(normalizeCode("262 -Ar")).toBe("262-Ar");
	});

	it("keeps the words of an attachment's code readable", () => {
		expect(normalizeCode("707-Ar Attachment C:  Fee Schedule ")).toBe(
			"707-Ar Attachment C: Fee Schedule",
		);
	});

	it("leaves a hyphen elsewhere in the code alone", () => {
		expect(
			normalizeCode("816-Ar (Attachment A - Employee User Agreement)"),
		).toBe("816-Ar (Attachment A - Employee User Agreement)");
	});
});

describe("kindOfCode", () => {
	it("is a policy for a plain number", () => {
		expect(kindOfCode("218.1")).toBe("policy");
	});

	it("is an administrative regulation for an -Ar code", () => {
		expect(kindOfCode("218-AR")).toBe("administrative-regulation");
	});

	it("is an administrative regulation for an attachment to one", () => {
		expect(kindOfCode("707-Ar Attachment A:Application")).toBe(
			"administrative-regulation",
		);
		expect(kindOfCode("816-Ar (Attachment B - Student User Agreement)")).toBe(
			"administrative-regulation",
		);
	});
});
