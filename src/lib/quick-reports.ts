import { UNFILTERED, isSameFilter, isUnfiltered } from "./report-listing.ts";
import type { ReportMode } from "./report-filter-url.ts";
import type {
	RecipientGroupId,
	ReportFilter,
	ReportView,
} from "./report-listing.ts";
import type { FrequencyChoice } from "./frequency.ts";
import type { PreparerType } from "./report.ts";

interface QuickReport {
	readonly id: string;
	readonly label: string;
	readonly description: string;
	readonly filter: ReportFilter;
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

const QUICK_REPORTS: readonly QuickReport[] = [
	{
		id: "public",
		label: "Public reports",
		description:
			"What the district publishes, posts, or keeps on file for anyone to see.",
		filter: filterFor({ recipientGroupIds: ["public"] }),
	},
	{
		id: "to-government",
		label: "Reports to the state",
		description: "Filings and reports sent to state and federal agencies.",
		filter: filterFor({ recipientGroupIds: ["government"] }),
	},
	{
		id: "financial",
		label: "Financial reporting",
		description:
			"Budgets, audits, investments, and other duties from the finance policies.",
		filter: filterFor({ sectionNumber: FINANCES_SECTION_NUMBER }),
	},
	{
		id: "regular-to-board",
		label: "Regular reports to the Board",
		description: "Recurring reports and recommendations brought to the Board.",
		filter: filterFor({ view: "recurring", recipientGroupIds: ["board"] }),
	},
	{
		id: "annual",
		label: "Annual reports",
		description: "Everything that comes due once a year.",
		filter: filterFor({ frequency: "annual" }),
	},
	{
		id: "employee",
		label: "Employee reports",
		description:
			"What staff must report, whether to the district or to people outside it.",
		filter: filterFor({ preparerTypes: ["employees"] }),
	},
	{
		id: "to-families",
		label: "Notices to families",
		description:
			"Notices, reports, and postings that go to parents and students.",
		filter: filterFor({ recipientGroupIds: ["families"] }),
	},
	{
		id: "to-law-enforcement",
		label: "Reports to law enforcement",
		description:
			"What the district must tell the police and other law enforcement.",
		filter: filterFor({ recipientGroupIds: ["law-enforcement"] }),
	},
];

const findQuickReport = (filter: ReportFilter): QuickReport | null =>
	QUICK_REPORTS.find((quickReport) =>
		isSameFilter(quickReport.filter, filter),
	) ?? null;

const fitsQuickReports = (filter: ReportFilter): boolean =>
	isUnfiltered(filter) || findQuickReport(filter) !== null;

const initialMode = (
	filter: ReportFilter,
	requestedMode: ReportMode,
): ReportMode => (fitsQuickReports(filter) ? requestedMode : "advanced");

export { QUICK_REPORTS, findQuickReport, fitsQuickReports, initialMode };
export type { QuickReport };
