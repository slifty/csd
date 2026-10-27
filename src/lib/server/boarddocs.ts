import { decodeHtmlEntities } from "./html.ts";
import type { IsoDate, Policy, PolicyKind, PolicySection } from "../policy.ts";

const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const MONTH_NUMBERS: ReadonlyMap<string, number> = new Map(
	MONTHS.map((month, index) => [month, index + 1]),
);

const ISO_PART_WIDTH = 2;

const METADATA_ROW_PATTERN =
	/<div class="col leftcol">(?<label>[^<]*)<\/div><div class="col rightcol">(?<value>[^<]*)<\/div>/gv;
const BOARD_DOCS_DATE_PATTERN =
	/^(?<month>[A-Za-z]+) (?<day>\d{1,2}), (?<year>\d{4})$/v;
const SECTION_PATTERN = /^(?<number>\d+) - (?<name>.+)$/v;
const ADMINISTRATIVE_REGULATION_CODE_PATTERN = /-ar\b/iv;
const SPACE_AROUND_REGULATION_DASH_PATTERN = /\s*-\s*(?=ar\b)/iv;
const WHITESPACE_RUN_PATTERN = /\s+/gv;

const padIsoPart = (part: number): string =>
	String(part).padStart(ISO_PART_WIDTH, "0");

const parseBoardDocsDate = (value: string): IsoDate => {
	const parts = BOARD_DOCS_DATE_PATTERN.exec(value.trim())?.groups;
	const monthNumber = MONTH_NUMBERS.get(parts?.month ?? "");
	if (parts === undefined || monthNumber === undefined) {
		throw new Error(`Unrecognized BoardDocs date: "${value}"`);
	}
	const month = padIsoPart(monthNumber);
	const day = padIsoPart(Number(parts.day));
	return `${Number(parts.year)}-${month}-${day}`;
};

const parseSection = (value: string): PolicySection => {
	const match = SECTION_PATTERN.exec(value.trim());
	if (match?.groups?.number === undefined || match.groups.name === undefined) {
		throw new Error(`Unrecognized BoardDocs section: "${value}"`);
	}
	return { number: match.groups.number, name: match.groups.name };
};

const collapseWhitespace = (value: string): string =>
	value.replace(WHITESPACE_RUN_PATTERN, " ").trim();

const normalizeCode = (code: string): string =>
	collapseWhitespace(code.replace(SPACE_AROUND_REGULATION_DASH_PATTERN, "-"));

const kindOfCode = (code: string): PolicyKind =>
	ADMINISTRATIVE_REGULATION_CODE_PATTERN.test(code)
		? "administrative-regulation"
		: "policy";

const readMetadataRows = (html: string): ReadonlyMap<string, string> =>
	new Map(
		[...html.matchAll(METADATA_ROW_PATTERN)].map(({ groups }) => [
			decodeHtmlEntities(groups?.label ?? "").trim(),
			decodeHtmlEntities(groups?.value ?? "").trim(),
		]),
	);

const requireRow = (
	rows: ReadonlyMap<string, string>,
	label: string,
	id: string,
): string => {
	const value = rows.get(label);
	if (value === undefined || value === "") {
		throw new Error(`BoardDocs item ${id} has no "${label}"`);
	}
	return value;
};

const optionalDate = (
	rows: ReadonlyMap<string, string>,
	label: string,
): IsoDate | null => {
	const value = rows.get(label);
	return value === undefined || value === "" ? null : parseBoardDocsDate(value);
};

const rawPolicyHtmlSource = (id: string): string =>
	`boarddocs/policies/${id}.html`;

const parsePolicy = (id: string, html: string): Policy => {
	const rows = readMetadataRows(html);
	const code = normalizeCode(requireRow(rows, "Code", id));
	return {
		id,
		code,
		kind: kindOfCode(code),
		title: collapseWhitespace(requireRow(rows, "Title", id)),
		section: parseSection(requireRow(rows, "Section", id)),
		adopted: optionalDate(rows, "Adopted"),
		lastRevised: optionalDate(rows, "Last Revised"),
		lastReviewed: optionalDate(rows, "Last Reviewed"),
		source: rawPolicyHtmlSource(id),
	};
};

export {
	kindOfCode,
	normalizeCode,
	parseBoardDocsDate,
	parsePolicy,
	parseSection,
	rawPolicyHtmlSource,
};
