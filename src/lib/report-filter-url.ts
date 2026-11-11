import { FREQUENCY_CHOICES, frequencyChoiceOf } from "./frequency.ts";
import { RECIPIENT_GROUPS, REPORT_VIEWS } from "./report-listing.ts";
import { FREQUENCIES, PREPARER_TYPES, REPORT_TYPES } from "./report.ts";
import type {
	RecipientGroupId,
	ReportFilter,
	ReportView,
} from "./report-listing.ts";
import type { FrequencyChoice } from "./frequency.ts";
import type { Frequency, PreparerType, ReportType } from "./report.ts";

const FILTER_PARAMS = {
	view: "view",
	search: "q",
	frequency: "frequency",
	reportType: "type",
	sectionNumber: "section",
	recipientGroupIds: "to",
	preparerTypes: "from",
} as const;

const MODE_PARAM = "mode";
const REPORT_MODES = ["quick", "mad-lib", "advanced"] as const;
type ReportMode = (typeof REPORT_MODES)[number];

type ReadableSearchParams = Pick<URLSearchParams, "get">;

const DEFAULT_MODE: ReportMode = "quick";
const DEFAULT_VIEW: ReportView = "all";
const LIST_SEPARATOR = ",";

const isReportMode = (value: string): value is ReportMode =>
	REPORT_MODES.some((mode) => mode === value);

const isReportView = (value: string): value is ReportView =>
	REPORT_VIEWS.some((view) => view === value);

const isFrequency = (value: string): value is Frequency =>
	FREQUENCIES.some((frequency) => frequency === value);

const isFrequencyChoice = (value: string): value is FrequencyChoice =>
	FREQUENCY_CHOICES.some((choice) => choice === value);

const isReportType = (value: string): value is ReportType =>
	REPORT_TYPES.some((reportType) => reportType === value);

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

const readFrequency = (
	params: ReadableSearchParams,
): FrequencyChoice | null => {
	const value = params.get(FILTER_PARAMS.frequency) ?? "";
	if (isFrequencyChoice(value)) {
		return value;
	}
	return isFrequency(value) ? frequencyChoiceOf(value) : null;
};

const readReportType = (params: ReadableSearchParams): ReportType | null => {
	const value = params.get(FILTER_PARAMS.reportType) ?? "";
	return isReportType(value) ? value : null;
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
	reportType: readReportType(params),
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
	if (filter.reportType !== null) {
		params.set(FILTER_PARAMS.reportType, filter.reportType);
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

const readReportMode = (params: ReadableSearchParams): ReportMode => {
	const value = params.get(MODE_PARAM) ?? "";
	return isReportMode(value) ? value : DEFAULT_MODE;
};

const writeReportMode = (params: URLSearchParams, mode: ReportMode): void => {
	if (mode !== DEFAULT_MODE) {
		params.set(MODE_PARAM, mode);
	}
};

export { readReportFilter, readReportMode, writeReportFilter, writeReportMode };
export type { ReportMode };
