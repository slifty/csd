import type { ReportFilter, ReportListing } from "../lib/report-listing.ts";
import type { Report } from "../lib/report.ts";

const createReportListing = (
	report: Partial<Report> = {},
	policy: Partial<ReportListing["policy"]> = {},
): ReportListing => ({
	report: {
		id: "test-report",
		policyId: "TESTID000001",
		name: "TEST Annual Report",
		description: "A TEST report.",
		type: "report",
		preparedBy: "TEST Superintendent",
		recipient: "TEST Board",
		recipientType: "board",
		frequency: "annual",
		deadline: null,
		quote: "The TEST Superintendent shall report annually.",
		...report,
	},
	policy: {
		id: "TESTID000001",
		code: "900",
		kind: "policy",
		title: "TEST Policy",
		section: { number: "900", name: "TEST Community" },
		lastRevised: null,
		...policy,
	},
});

const createReportFilter = (
	filter: Partial<ReportFilter> = {},
): ReportFilter => ({
	view: "all",
	search: "",
	frequency: null,
	sectionNumber: null,
	recipientGroupIds: new Set(),
	...filter,
});

export { createReportFilter, createReportListing };
