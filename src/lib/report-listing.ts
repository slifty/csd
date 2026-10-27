import { frequencyChoiceOf } from "./frequency.ts";
import { FREQUENCY_LABELS, REPORT_TYPE_LABELS } from "./report-labels.ts";
import type { FrequencyChoice } from "./frequency.ts";
import { PREPARER_TYPES, isRecurring } from "./report.ts";
import type { Policy } from "./policy.ts";
import type {
	PreparerType,
	RecipientType,
	Report,
	ReportType,
} from "./report.ts";

type PolicySummary = Pick<
	Policy,
	"code" | "id" | "kind" | "lastRevised" | "section" | "title"
>;

interface ReportListing {
	readonly report: Report;
	readonly policy: PolicySummary;
}

const RECIPIENT_GROUPS = [
	{ id: "board", label: "Board", recipientTypes: ["board"] },
	{
		id: "government",
		label: "State & federal",
		recipientTypes: ["state-agency", "federal-agency"],
	},
	{ id: "public", label: "Public", recipientTypes: ["public"] },
	{
		id: "families",
		label: "Parents & students",
		recipientTypes: ["parents-and-students"],
	},
	{ id: "employees", label: "Employees", recipientTypes: ["employees"] },
	{
		id: "law-enforcement",
		label: "Law enforcement",
		recipientTypes: ["law-enforcement"],
	},
	{
		id: "other-external",
		label: "Other external",
		recipientTypes: ["other-external"],
	},
	{
		id: "administration",
		label: "Administration",
		recipientTypes: ["administration"],
	},
] as const satisfies ReadonlyArray<{
	id: string;
	label: string;
	recipientTypes: readonly RecipientType[];
}>;

type RecipientGroup = (typeof RECIPIENT_GROUPS)[number];
type RecipientGroupId = RecipientGroup["id"];

const REPORT_VIEWS = ["all", "recurring", "non-recurring"] as const;
type ReportView = (typeof REPORT_VIEWS)[number];

interface ReportFilter {
	readonly view: ReportView;
	readonly search: string;
	readonly frequency: FrequencyChoice | null;
	readonly reportType: ReportType | null;
	readonly sectionNumber: string | null;
	readonly recipientGroupIds: ReadonlySet<RecipientGroupId>;
	readonly preparerTypes: ReadonlySet<PreparerType>;
}

const SEARCH_TERM_SEPARATOR = /\s+/v;

const isInGroup = (group: RecipientGroup, listing: ReportListing): boolean =>
	group.recipientTypes.some(
		(recipientType) => recipientType === listing.report.recipientType,
	);

const isInView = (view: ReportView, listing: ReportListing): boolean => {
	switch (view) {
		case "all":
			return true;
		case "recurring":
			return isRecurring(listing.report);
		case "non-recurring":
			return !isRecurring(listing.report);
	}
};

const searchableText = ({ report, policy }: ReportListing): string =>
	[
		report.name,
		report.description,
		report.recipient,
		...report.preparers.flatMap(({ name, detail }) => [name, detail ?? ""]),
		report.deadline ?? "",
		report.quote,
		REPORT_TYPE_LABELS[report.type],
		FREQUENCY_LABELS[report.frequency],
		policy.code,
		policy.title,
	]
		.join(" ")
		.toLowerCase();

const searchTerms = (search: string): readonly string[] =>
	search
		.trim()
		.toLowerCase()
		.split(SEARCH_TERM_SEPARATOR)
		.filter((term) => term !== "");

const matchesSearch = (search: string, listing: ReportListing): boolean => {
	const text = searchableText(listing);
	return searchTerms(search).every((term) => text.includes(term));
};

const matchesRecipientGroups = (
	recipientGroupIds: ReadonlySet<RecipientGroupId>,
	listing: ReportListing,
): boolean =>
	recipientGroupIds.size === 0 ||
	RECIPIENT_GROUPS.some(
		(group) => recipientGroupIds.has(group.id) && isInGroup(group, listing),
	);

const hasPreparerType = (
	preparerType: PreparerType,
	listing: ReportListing,
): boolean =>
	listing.report.preparers.some(({ type }) => type === preparerType);

const matchesPreparerTypes = (
	preparerTypes: ReadonlySet<PreparerType>,
	listing: ReportListing,
): boolean =>
	preparerTypes.size === 0 ||
	[...preparerTypes].some((preparerType) =>
		hasPreparerType(preparerType, listing),
	);

const matchesSelectAndSearchFilters = (
	filter: ReportFilter,
	listing: ReportListing,
): boolean =>
	isInView(filter.view, listing) &&
	(filter.frequency === null ||
		filter.frequency === frequencyChoiceOf(listing.report.frequency)) &&
	(filter.reportType === null || filter.reportType === listing.report.type) &&
	(filter.sectionNumber === null ||
		filter.sectionNumber === listing.policy.section.number) &&
	matchesSearch(filter.search, listing);

const matchesFilter = (filter: ReportFilter, listing: ReportListing): boolean =>
	matchesSelectAndSearchFilters(filter, listing) &&
	matchesRecipientGroups(filter.recipientGroupIds, listing) &&
	matchesPreparerTypes(filter.preparerTypes, listing);

const countByRecipientGroup = (
	filter: ReportFilter,
	listings: readonly ReportListing[],
): ReadonlyMap<RecipientGroupId, number> => {
	const withoutRecipients = { ...filter, recipientGroupIds: new Set<never>() };
	const candidates = listings.filter((listing) =>
		matchesFilter(withoutRecipients, listing),
	);
	return new Map(
		RECIPIENT_GROUPS.map((group) => [
			group.id,
			candidates.filter((listing) => isInGroup(group, listing)).length,
		]),
	);
};

const countByPreparerType = (
	filter: ReportFilter,
	listings: readonly ReportListing[],
): ReadonlyMap<PreparerType, number> => {
	const withoutPreparers = { ...filter, preparerTypes: new Set<never>() };
	const candidates = listings.filter((listing) =>
		matchesFilter(withoutPreparers, listing),
	);
	return new Map(
		PREPARER_TYPES.map((preparerType) => [
			preparerType,
			candidates.filter((listing) => hasPreparerType(preparerType, listing))
				.length,
		]),
	);
};

export {
	RECIPIENT_GROUPS,
	REPORT_VIEWS,
	countByPreparerType,
	countByRecipientGroup,
	isInView,
	matchesFilter,
};
export type {
	PolicySummary,
	RecipientGroupId,
	ReportFilter,
	ReportListing,
	ReportView,
};
