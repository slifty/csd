import { describe, expect, it } from "vitest";
import { boardDocsUrl, policyNumber } from "../policy.ts";

describe("boardDocsUrl", () => {
	it("links to the policy's item on the district's BoardDocs site", () => {
		expect(boardDocsUrl({ id: "TESTID000001" })).toBe(
			"https://go.boarddocs.com/pa/ctsd/Board.nsf/goto?open&id=TESTID000001",
		);
	});
});

describe("policyNumber", () => {
	it("is the code of a policy", () => {
		expect(policyNumber({ code: "218.1" })).toBe("218.1");
	});

	it("drops the -Ar suffix from a regulation's code", () => {
		expect(policyNumber({ code: "218-AR" })).toBe("218");
	});

	it("keeps the rest of an attachment's code", () => {
		expect(policyNumber({ code: "707-Ar Attachment C: Fee Schedule" })).toBe(
			"707 Attachment C: Fee Schedule",
		);
	});
});
