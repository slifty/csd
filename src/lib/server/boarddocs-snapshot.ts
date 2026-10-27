import { readFileSync } from "node:fs";
import { parsePolicy, rawPolicyHtmlSource } from "./boarddocs.ts";
import type { Policy } from "../policy.ts";

const DATA_DIRECTORY = new URL("../../../data/", import.meta.url);

const readDataFile = (path: string): string =>
	readFileSync(new URL(path, DATA_DIRECTORY), "utf8");

const hasStringId = (value: unknown): value is { id: string } =>
	typeof value === "object" &&
	value !== null &&
	"id" in value &&
	typeof value.id === "string";

const readListedPolicyIds = (): readonly string[] => {
	const listing: unknown = JSON.parse(readDataFile("boarddocs/index.json"));
	if (!Array.isArray(listing) || !listing.every(hasStringId)) {
		throw new Error("boarddocs/index.json must list items with string ids");
	}
	return listing.map(({ id }) => id);
};

const readRawPolicyHtml = (id: string): string =>
	readDataFile(rawPolicyHtmlSource(id));

const extractPolicies = (): readonly Policy[] =>
	readListedPolicyIds().map((id) => parsePolicy(id, readRawPolicyHtml(id)));

export { DATA_DIRECTORY, extractPolicies, readRawPolicyHtml };
