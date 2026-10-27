const NO_BREAK_SPACE = "\u00A0";
const SOFT_HYPHEN = "\u00AD";

const NAMED_ENTITIES: Readonly<Record<string, string>> = {
	amp: "&",
	bull: "•",
	deg: "°",
	frac12: "½",
	gt: ">",
	ldquo: "“",
	lt: "<",
	mdash: "—",
	nbsp: NO_BREAK_SPACE,
	ndash: "–",
	not: "¬",
	quot: '"',
	rdquo: "”",
	rsquo: "’",
	sect: "§",
	shy: SOFT_HYPHEN,
};

const DECIMAL_RADIX = 10;
const HEXADECIMAL_RADIX = 16;
const HEXADECIMAL_PREFIX = "#x";
const DECIMAL_PREFIX = "#";

const ENTITY_PATTERN = /&(?<entity>#x[\da-f]+|#\d+|[a-z\d]+);/giv;
const TAG_PATTERN = /<[^>]*>/gv;
const BLOCK_BOUNDARY_PATTERN = /<br\s*\/?>|<\/(?:p|div|li|tr|td|h\d)>/giv;
const SCRIPT_OR_STYLE_PATTERN =
	/<(?<tag>script|style)[^>]*>[\s\S]*?<\/\k<tag>>/giv;
const INVISIBLE_PATTERN = /[\uFEFF\u00AD]/gv;
const WHITESPACE_RUN_PATTERN = /\s+/gv;

const decodeCodePoint = (digits: string, radix: number): string =>
	String.fromCodePoint(Number.parseInt(digits, radix));

const decodeEntity = (match: string, entity: string): string => {
	if (entity.toLowerCase().startsWith(HEXADECIMAL_PREFIX)) {
		return decodeCodePoint(
			entity.slice(HEXADECIMAL_PREFIX.length),
			HEXADECIMAL_RADIX,
		);
	}
	if (entity.startsWith(DECIMAL_PREFIX)) {
		return decodeCodePoint(entity.slice(DECIMAL_PREFIX.length), DECIMAL_RADIX);
	}
	return NAMED_ENTITIES[entity] ?? match;
};

const decodeHtmlEntities = (html: string): string =>
	html.replace(ENTITY_PATTERN, decodeEntity);

const htmlToText = (html: string): string =>
	decodeHtmlEntities(
		html
			.replace(SCRIPT_OR_STYLE_PATTERN, " ")
			.replace(BLOCK_BOUNDARY_PATTERN, "\n")
			.replace(TAG_PATTERN, " "),
	);

const normalizeForComparison = (text: string): string =>
	text
		.replace(INVISIBLE_PATTERN, "")
		.replace(WHITESPACE_RUN_PATTERN, " ")
		.trim();

export { decodeHtmlEntities, htmlToText, normalizeForComparison };
