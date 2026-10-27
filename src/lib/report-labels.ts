import type { Frequency, RecipientType, ReportType } from "./report.ts";

const FREQUENCY_LABELS: Readonly<Record<Frequency, string>> = {
	"per-meeting": "Per meeting",
	monthly: "Monthly",
	quarterly: "Quarterly",
	semiannual: "Twice a year",
	annual: "Annual",
	"every-2-years": "Every 2 years",
	"every-3-years": "Every 3 years",
	"every-5-years": "Every 5 years",
	"every-6-years": "Every 6 years",
	ongoing: "Ongoing",
	"as-required": "As required",
	"one-time": "One time",
	"event-triggered": "When triggered",
};

const REPORT_TYPE_LABELS: Readonly<Record<ReportType, string>> = {
	audit: "Audit",
	certification: "Certification",
	"data-submission": "Data submission",
	notification: "Notification",
	plan: "Plan",
	presentation: "Presentation",
	"public-posting": "Public posting",
	recommendation: "Recommendation",
	report: "Report",
};

const RECIPIENT_TYPE_LABELS: Readonly<Record<RecipientType, string>> = {
	administration: "District administration",
	board: "School Board",
	employees: "Employees",
	"federal-agency": "Federal agency",
	"law-enforcement": "Law enforcement",
	"other-external": "Other outside party",
	"parents-and-students": "Parents and students",
	public: "Public",
	"state-agency": "State agency",
};

const REPORT_COLUMN_LABELS = {
	report: "Report",
	frequency: "Frequency / deadline",
	preparedBy: "Prepared by",
	recipient: "Goes to",
	type: "Type",
	source: "Required by",
} as const;

const { length: REPORT_COLUMN_COUNT } = Object.keys(REPORT_COLUMN_LABELS);

export {
	FREQUENCY_LABELS,
	RECIPIENT_TYPE_LABELS,
	REPORT_COLUMN_COUNT,
	REPORT_COLUMN_LABELS,
	REPORT_TYPE_LABELS,
};
