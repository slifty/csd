import { existsSync, readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DATA_DIRECTORY, extractPolicies } from "../boarddocs-snapshot.ts";
import { compareCodes, policies } from "../policies.ts";
import { serializePolicy } from "../policy-file.ts";

const policiesDirectory = new URL("policies/", DATA_DIRECTORY);

describe("policies", () => {
	it("includes every policy in the BoardDocs listing", () => {
		expect(policies).toHaveLength(333);
	});

	it("gives every policy a distinct id", () => {
		expect(new Set(policies.map((policy) => policy.id)).size).toBe(
			policies.length,
		);
	});

	it("is ordered by code", () => {
		expect(policies.toSorted(compareCodes)).toEqual(policies);
	});

	it.each(policies.map((policy) => [policy.id, policy] as const))(
		"%s points at raw HTML that exists",
		(_id, policy) => {
			expect(existsSync(new URL(policy.source, DATA_DIRECTORY))).toBe(true);
		},
	);
});

describe("data/policies", () => {
	const extracted = extractPolicies();

	it("has a file for exactly the policies in the BoardDocs listing", () => {
		expect(readdirSync(policiesDirectory).toSorted()).toEqual(
			extracted.map(({ id }) => `${id}.json`).toSorted(),
		);
	});

	it.each(extracted.map((policy) => [policy.id, policy] as const))(
		"%s matches what tools/extract-policies.ts would write",
		(id, policy) => {
			expect(
				readFileSync(new URL(`${id}.json`, policiesDirectory), "utf8"),
			).toBe(serializePolicy(policy));
		},
	);
});

describe("compareCodes", () => {
	const sorted = ["218.1", "218-Ar", "218", "1000", "99"]
		.map((code) => ({ code }))
		.toSorted(compareCodes)
		.map(({ code }) => code);

	it("orders codes numerically and keeps a regulation beside its policy", () => {
		expect(sorted).toEqual(["99", "218", "218-Ar", "218.1", "1000"]);
	});
});
