import { RECIPIENT_GROUPS, REPORT_VIEWS } from "./report-listing.ts";
import { FREQUENCIES, PREPARER_TYPES } from "./report.ts";
import type {
	RecipientGroupId,
	ReportFilter,
	ReportView,
} from "./report-listing.ts";
import type { Frequency, PreparerType } from "./report.ts";

const FILTER_PARAMS = {
	view: "view",
	search: "q",
	frequency: "frequency",
	sectionNumber: "section",
	recipientGroupIds: "to",
	preparerTypes: "from",
} as const;

type ReadableSearchParams = Pick<URLSearchParams, "get">;

const DEFAULT_VIEW: ReportView = "recurring";
const LIST_SEPARATOR = ",";

const isReportView = (value: string): value is ReportView =>
	REPORT_VIEWS.some((view) => view === value);

const isFrequency = (value: string): value is Frequency =>
	FREQUENCIES.some((frequency) => frequency === value);

const isRecipientGroupId = (value: string): value is RecipientGroupId =>
	RECIPIENT_GROUPS.some((group) => group.id === value);

const isPreparerType = (value: string): value is PreparerType =>
	PREPARER_TYPES.some((preparerType) => preparerType === value);

const readList = (params: ReadableSearchParams, name: string): string[] =>
	(params.get(name) ?? "").split(LIST_SEPARATOR);

const writeList = (
	params: URLSearchParams,
	name: string,
	values: readonly string[],
): void => {
	if (values.length > 0) {
		params.set(name, values.join(LIST_SEPARATOR));
	}
};

const readView = (params: ReadableSearchParams): ReportView => {
	const value = params.get(FILTER_PARAMS.view) ?? "";
	return isReportView(value) ? value : DEFAULT_VIEW;
};

const readFrequency = (params: ReadableSearchParams): Frequency | null => {
	const value = params.get(FILTER_PARAMS.frequency) ?? "";
	return isFrequency(value) ? value : null;
};

const readSectionNumber = (
	params: ReadableSearchParams,
	sectionNumbers: ReadonlySet<string>,
): string | null => {
	const value = params.get(FILTER_PARAMS.sectionNumber) ?? "";
	return sectionNumbers.has(value) ? value : null;
};

const readRecipientGroupIds = (
	params: ReadableSearchParams,
): ReadonlySet<RecipientGroupId> =>
	new Set(
		readList(params, FILTER_PARAMS.recipientGroupIds).filter(
			isRecipientGroupId,
		),
	);

const readPreparerTypes = (
	params: ReadableSearchParams,
): ReadonlySet<PreparerType> =>
	new Set(readList(params, FILTER_PARAMS.preparerTypes).filter(isPreparerType));

const readReportFilter = (
	params: ReadableSearchParams,
	sectionNumbers: ReadonlySet<string>,
): ReportFilter => ({
	view: readView(params),
	search: params.get(FILTER_PARAMS.search) ?? "",
	frequency: readFrequency(params),
	sectionNumber: readSectionNumber(params, sectionNumbers),
	recipientGroupIds: readRecipientGroupIds(params),
	preparerTypes: readPreparerTypes(params),
});

const writeReportFilter = (filter: ReportFilter): URLSearchParams => {
	const params = new URLSearchParams();
	if (filter.view !== DEFAULT_VIEW) {
		params.set(FILTER_PARAMS.view, filter.view);
	}
	if (filter.search.trim() !== "") {
		params.set(FILTER_PARAMS.search, filter.search);
	}
	if (filter.frequency !== null) {
		params.set(FILTER_PARAMS.frequency, filter.frequency);
	}
	if (filter.sectionNumber !== null) {
		params.set(FILTER_PARAMS.sectionNumber, filter.sectionNumber);
	}
	writeList(
		params,
		FILTER_PARAMS.recipientGroupIds,
		RECIPIENT_GROUPS.map((group) => group.id).filter((id) =>
			filter.recipientGroupIds.has(id),
		),
	);
	writeList(
		params,
		FILTER_PARAMS.preparerTypes,
		PREPARER_TYPES.filter((preparerType) =>
			filter.preparerTypes.has(preparerType),
		),
	);
	return params;
};

export { readReportFilter, writeReportFilter };
