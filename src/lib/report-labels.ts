import type {
	Frequency,
	PreparerType,
	RecipientType,
	ReportType,
} from "./report.ts";

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

const REPORT_TYPE_DEFINITIONS: Readonly<Record<ReportType, string>> = {
	audit:
		"An examination of accounts or records, usually by an independent auditor.",
	certification:
		"Proof that a requirement is met, such as a signed statement, credential, clearance, or evidence of completion.",
	"data-submission":
		"Records or data filed in a set form for an agency or office to process or keep, such as state forms, financial filings, and reimbursement requests.",
	notification:
		"Tells particular people that something happened, was decided, or is coming, or what their rights are.",
	plan: "A document setting out future action, prepared for approval or adoption.",
	presentation: "Delivered in person, such as at a meeting.",
	"public-posting":
		"Made available to anyone who looks: posted, published, or kept on file for inspection.",
	recommendation:
		"Brought to a decision-maker, usually the Board, for approval: a proposal, a candidate, or a list to ratify.",
	report:
		"A written account of findings, results, data, or status for its recipient to review.",
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

const PREPARER_TYPE_LABELS: Readonly<Record<PreparerType, string>> = {
	board: "Board",
	superintendent: "Superintendent",
	administrators: "Administration",
	employees: "Employees",
	"parents-and-students": "Parents & students",
	"outside-parties": "Outside parties",
	unspecified: "Not specified",
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
	PREPARER_TYPE_LABELS,
	RECIPIENT_TYPE_LABELS,
	REPORT_COLUMN_COUNT,
	REPORT_COLUMN_LABELS,
	REPORT_TYPE_DEFINITIONS,
	REPORT_TYPE_LABELS,
};
