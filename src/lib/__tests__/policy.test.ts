import { describe, expect, it } from "vitest";
import { boardDocsUrl } from "../policy.ts";

describe("boardDocsUrl", () => {
	it("links to the policy's item on the district's BoardDocs site", () => {
		expect(boardDocsUrl({ id: "TESTID000001" })).toBe(
			"https://go.boarddocs.com/pa/ctsd/Board.nsf/goto?open&id=TESTID000001",
		);
	});
});
