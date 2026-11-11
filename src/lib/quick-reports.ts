import { madLibChoicesOf } from "./mad-lib.ts";
import { PREPARER_TYPE_LABELS } from "./report-labels.ts";
import {
	RECIPIENT_GROUPS,
	UNFILTERED,
	isSameFilter,
	isUnfiltered,
	matchesFilter,
} from "./report-listing.ts";
import { PREPARER_TYPES } from "./report.ts";
import type { MadLibBlank } from "./mad-lib.ts";
import type { ReportMode } from "./report-filter-url.ts";
import type {
	RecipientGroupId,
	ReportFilter,
	ReportListing,
	ReportView,
} from "./report-listing.ts";
import type { FrequencyChoice } from "./frequency.ts";
import type { PreparerType } from "./report.ts";

interface QuickReportModifier {
	readonly id: string;
	readonly label: string;
	readonly filter: ReportFilter;
}

interface QuickReportModifierMenu {
	readonly label: string;
	readonly defaultLabel: string;
	readonly options: readonly QuickReportModifier[];
}

interface QuickReport {
	readonly id: string;
	readonly label: string;
	readonly description: string;
	readonly filter: ReportFilter;
	readonly modifierMenu: QuickReportModifierMenu | null;
}

interface QuickReportSelection {
	readonly quickReport: QuickReport;
	readonly modifier: QuickReportModifier | null;
}

interface QuickReportCriteria {
	readonly view?: ReportView;
	readonly frequency?: FrequencyChoice | null;
	readonly recipientGroupIds?: readonly RecipientGroupId[];
	readonly preparerTypes?: readonly PreparerType[];
	readonly sectionNumber?: string | null;
}

const FINANCES_SECTION_NUMBER = "600";

const filterFor = ({
	view = "all",
	frequency = null,
	recipientGroupIds = [],
	preparerTypes = [],
	sectionNumber = null,
}: QuickReportCriteria): ReportFilter => ({
	...UNFILTERED,
	view,
	frequency,
	sectionNumber,
	recipientGroupIds: new Set(recipientGroupIds),
	preparerTypes: new Set(preparerTypes),
});

const preparerMenu = (
	criteria: QuickReportCriteria,
): QuickReportModifierMenu => ({
	label: "Prepared by",
	defaultLabel: "Anyone",
	options: PREPARER_TYPES.map((preparerType) => ({
		id: preparerType,
		label: PREPARER_TYPE_LABELS[preparerType],
		filter: filterFor({ ...criteria, preparerTypes: [preparerType] }),
	})),
});

const recipientMenu = (
	criteria: QuickReportCriteria,
): QuickReportModifierMenu => ({
	label: "Goes to",
	defaultLabel: "Anyone",
	options: RECIPIENT_GROUPS.map((group) => ({
		id: group.id,
		label: group.label,
		filter: filterFor({ ...criteria, recipientGroupIds: [group.id] }),
	})),
});

const cadenceMenu = (
	criteria: QuickReportCriteria,
): QuickReportModifierMenu => ({
	label: "Cadence",
	defaultLabel: "Any",
	options: [
		{
			id: "regular",
			label: "Regular",
			filter: filterFor({ ...criteria, view: "recurring" }),
		},
		{
			id: "ad-hoc",
			label: "Ad hoc",
			filter: filterFor({ ...criteria, view: "non-recurring" }),
		},
	],
});

const ANNUAL: QuickReportCriteria = { frequency: "annual" };

const FINANCIAL: QuickReportCriteria = {
	sectionNumber: FINANCES_SECTION_NUMBER,
};

const TO_FAMILIES: QuickReportCriteria = { recipientGroupIds: ["families"] };

const PUBLIC: QuickReportCriteria = { recipientGroupIds: ["public"] };

const TO_GOVERNMENT: QuickReportCriteria = {
	recipientGroupIds: ["government"],
};

const INTERNAL_RECIPIENT_GROUP_IDS: readonly RecipientGroupId[] = [
	"administration",
	"employees",
	"board",
];

const EXTERNAL_RECIPIENT_GROUP_IDS: readonly RecipientGroupId[] =
	RECIPIENT_GROUPS.map(({ id }) => id).filter(
		(id) => !INTERNAL_RECIPIENT_GROUP_IDS.includes(id),
	);

const BY_EMPLOYEES: QuickReportCriteria = { preparerTypes: ["employees"] };

const REGULAR_TO_BOARD: QuickReportCriteria = {
	view: "recurring",
	recipientGroupIds: ["board"],
};

const QUICK_REPORTS: readonly QuickReport[] = [
	{
		id: "public",
		label: "Public reports",
		description:
			"What the district publishes, posts, or keeps on file for anyone to see.",
		filter: filterFor(PUBLIC),
		modifierMenu: preparerMenu(PUBLIC),
	},
	{
		id: "to-government",
		label: "Reports to the state",
		description: "Filings and reports sent to state and federal agencies.",
		filter: filterFor(TO_GOVERNMENT),
		modifierMenu: cadenceMenu(TO_GOVERNMENT),
	},
	{
		id: "financial",
		label: "Financial reporting",
		description:
			"Budgets, audits, investments, and other duties from the finance policies.",
		filter: filterFor(FINANCIAL),
		modifierMenu: cadenceMenu(FINANCIAL),
	},
	{
		id: "regular-to-board",
		label: "Regular reports to the Board",
		description: "Recurring reports and recommendations brought to the Board.",
		filter: filterFor(REGULAR_TO_BOARD),
		modifierMenu: preparerMenu(REGULAR_TO_BOARD),
	},
	{
		id: "annual",
		label: "Annual reports",
		description: "Everything that comes due once a year.",
		filter: filterFor(ANNUAL),
		modifierMenu: recipientMenu(ANNUAL),
	},
	{
		id: "employee",
		label: "Employee reports",
		description:
			"What staff must report, whether to the district or to people outside it.",
		filter: filterFor(BY_EMPLOYEES),
		modifierMenu: {
			label: "Audience",
			defaultLabel: "Any",
			options: [
				{
					id: "internal",
					label: "Internal",
					filter: filterFor({
						...BY_EMPLOYEES,
						recipientGroupIds: INTERNAL_RECIPIENT_GROUP_IDS,
					}),
				},
				{
					id: "external",
					label: "External",
					filter: filterFor({
						...BY_EMPLOYEES,
						recipientGroupIds: EXTERNAL_RECIPIENT_GROUP_IDS,
					}),
				},
			],
		},
	},
	{
		id: "to-families",
		label: "Notices to families",
		description:
			"Notices, reports, and postings that go to parents and students.",
		filter: filterFor(TO_FAMILIES),
		modifierMenu: cadenceMenu(TO_FAMILIES),
	},
	{
		id: "to-law-enforcement",
		label: "Reports to law enforcement",
		description:
			"What the district must tell the police and other law enforcement.",
		filter: filterFor({ recipientGroupIds: ["law-enforcement"] }),
		modifierMenu: null,
	},
];

const selectionsOf = (
	quickReport: QuickReport,
): readonly QuickReportSelection[] => [
	{ quickReport, modifier: null },
	...(quickReport.modifierMenu?.options ?? []).map((modifier) => ({
		quickReport,
		modifier,
	})),
];

const selectionFilter = ({
	quickReport,
	modifier,
}: QuickReportSelection): ReportFilter =>
	modifier === null ? quickReport.filter : modifier.filter;

const findQuickReport = (filter: ReportFilter): QuickReportSelection | null =>
	QUICK_REPORTS.flatMap(selectionsOf).find((selection) =>
		isSameFilter(selectionFilter(selection), filter),
	) ?? null;

const fitsQuickReports = (filter: ReportFilter): boolean =>
	isUnfiltered(filter) || findQuickReport(filter) !== null;

const initialMode = (
	filter: ReportFilter,
	requestedMode: ReportMode,
	madLibBlanks: readonly MadLibBlank[],
): ReportMode => {
	switch (requestedMode) {
		case "quick":
			return fitsQuickReports(filter) ? "quick" : "advanced";
		case "mad-lib":
			return madLibChoicesOf(madLibBlanks, filter) === null
				? "advanced"
				: "mad-lib";
		case "advanced":
			return "advanced";
	}
};

const DEFAULT_OPTION_ID = "";

const optionFilter = (
	quickReport: QuickReport,
	optionId: string,
): ReportFilter =>
	quickReport.modifierMenu?.options.find(({ id }) => id === optionId)?.filter ??
	quickReport.filter;

const availableOptions = (
	modifierMenu: QuickReportModifierMenu,
	listings: readonly ReportListing[],
	selected: QuickReportModifier | null,
): readonly QuickReportModifier[] =>
	modifierMenu.options.filter(
		(option) =>
			option === selected ||
			listings.some((listing) => matchesFilter(option.filter, listing)),
	);

export {
	DEFAULT_OPTION_ID,
	QUICK_REPORTS,
	availableOptions,
	findQuickReport,
	fitsQuickReports,
	initialMode,
	optionFilter,
	selectionFilter,
	selectionsOf,
};
export type {
	QuickReport,
	QuickReportModifier,
	QuickReportModifierMenu,
	QuickReportSelection,
};
