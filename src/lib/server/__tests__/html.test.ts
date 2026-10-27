import { describe, expect, it } from "vitest";
import {
	decodeHtmlEntities,
	htmlToText,
	normalizeForComparison,
} from "../html.ts";

describe("decodeHtmlEntities", () => {
	it("decodes named, decimal, and hexadecimal entities", () => {
		expect(decodeHtmlEntities("&ldquo;A&rdquo; &#39;B&#39; &#x41;")).toBe(
			"“A” 'B' A",
		);
	});

	it("leaves an entity it does not know alone", () => {
		expect(decodeHtmlEntities("&unknown;")).toBe("&unknown;");
	});
});

describe("htmlToText", () => {
	it("keeps the words and drops the markup", () => {
		expect(
			normalizeForComparison(
				htmlToText("<p>One&nbsp;<b>two</b></p><p>three</p>"),
			),
		).toBe("One two three");
	});

	it("drops scripts and styles entirely", () => {
		expect(
			normalizeForComparison(
				htmlToText("<style>p{}</style><p>kept</p><script>dropped()</script>"),
			),
		).toBe("kept");
	});
});

describe("normalizeForComparison", () => {
	it("removes soft hyphens and byte order marks", () => {
		expect(normalizeForComparison("non-\u00ADsub\uFEFFstantive")).toBe(
			"non-substantive",
		);
	});
});
