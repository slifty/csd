import { requirePolicy } from "#lib/server/policies.ts";
import { reports } from "#lib/server/reports.ts";
import type { PolicySummary, ReportListing } from "#lib/report-listing.ts";
import type { Policy } from "#lib/policy.ts";

interface ReportsPageData {
	readonly listings: readonly ReportListing[];
}

const summarizePolicy = ({
	id,
	code,
	kind,
	title,
	section,
	lastRevised,
}: Policy): PolicySummary => ({ id, code, kind, title, section, lastRevised });

const load = (): ReportsPageData => ({
	listings: reports.map((report) => ({
		report,
		policy: summarizePolicy(requirePolicy(report.policyId)),
	})),
});

export { load };
