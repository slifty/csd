import { compareCodes, policiesById } from "./policies.ts";
import { FREQUENCIES, RECIPIENT_TYPES, REPORT_TYPES } from "../report.ts";
import type { Policy } from "../policy.ts";
import type { Report } from "../report.ts";

const reportFiles = import.meta.glob<unknown>("/data/reports/*.json", {
	import: "default",
	eager: true,
});

const REPORT_FILE_ID_PATTERN = /\/(?<id>[^\/]+)\.json$/v;

type RawReport = Readonly<Record<string, unknown>>;

const isRawReport = (value: unknown): value is RawReport =>
	typeof value === "object" && value !== null && !Array.isArray(value);

const requireString = (raw: RawReport, field: string, file: string): string => {
	const { [field]: value } = raw;
	if (typeof value !== "string" || value === "") {
		throw new Error(`${file}: "${field}" must be a non-empty string`);
	}
	return value;
};

const optionalString = (
	raw: RawReport,
	field: string,
	file: string,
): string | null => {
	const { [field]: value } = raw;
	if (value === null) {
		return null;
	}
	return requireString(raw, field, file);
};

const requireOneOf = <T extends string>(
	allowed: readonly T[],
	raw: RawReport,
	field: string,
	file: string,
): T => {
	const value = requireString(raw, field, file);
	const match = allowed.find((candidate) => candidate === value);
	if (match === undefined) {
		throw new Error(`${file}: unknown ${field} "${value}"`);
	}
	return match;
};

const reportIdOfFile = (file: string): string => {
	const id = REPORT_FILE_ID_PATTERN.exec(file)?.groups?.id;
	if (id === undefined) {
		throw new Error(`${file}: not a report file`);
	}
	return id;
};

const requireCitedPolicy = (policyId: string, file: string): Policy => {
	const policy = policiesById.get(policyId);
	if (policy === undefined) {
		throw new Error(`${file}: cites unknown policy ${policyId}`);
	}
	return policy;
};

const parseReport = (file: string, raw: unknown): Report => {
	if (!isRawReport(raw)) {
		throw new Error(`${file}: a report must be a JSON object`);
	}
	const id = requireString(raw, "id", file);
	if (id !== reportIdOfFile(file)) {
		throw new Error(`${file}: id "${id}" does not match its file name`);
	}
	const policyId = requireString(raw, "policyId", file);
	requireCitedPolicy(policyId, file);
	return {
		id,
		policyId,
		name: requireString(raw, "name", file),
		description: requireString(raw, "description", file),
		type: requireOneOf(REPORT_TYPES, raw, "type", file),
		preparedBy: requireString(raw, "preparedBy", file),
		recipient: requireString(raw, "recipient", file),
		recipientType: requireOneOf(RECIPIENT_TYPES, raw, "recipientType", file),
		frequency: requireOneOf(FREQUENCIES, raw, "frequency", file),
		deadline: optionalString(raw, "deadline", file),
		quote: requireString(raw, "quote", file),
	};
};

const citedPolicy = (report: Report): Policy =>
	requireCitedPolicy(report.policyId, report.id);

const compareByPolicyThenName = (a: Report, b: Report): number => {
	const byPolicy = compareCodes(citedPolicy(a), citedPolicy(b));
	return byPolicy === 0 ? a.name.localeCompare(b.name) : byPolicy;
};

const reports: readonly Report[] = Object.entries(reportFiles)
	.map(([file, raw]) => parseReport(file, raw))
	.toSorted(compareByPolicyThenName);

export { parseReport, reports };
