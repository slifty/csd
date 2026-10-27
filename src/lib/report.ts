const REPORT_TYPES = [
	"audit",
	"certification",
	"data-submission",
	"notification",
	"plan",
	"presentation",
	"public-posting",
	"recommendation",
	"report",
] as const;

const RECIPIENT_TYPES = [
	"administration",
	"board",
	"employees",
	"federal-agency",
	"law-enforcement",
	"other-external",
	"parents-and-students",
	"public",
	"state-agency",
] as const;

const RECURRING_FREQUENCIES = [
	"per-meeting",
	"monthly",
	"quarterly",
	"semiannual",
	"annual",
	"every-2-years",
	"every-3-years",
	"every-5-years",
	"every-6-years",
	"ongoing",
	"as-required",
] as const;

const NON_RECURRING_FREQUENCIES = ["one-time", "event-triggered"] as const;

const FREQUENCIES = [
	...RECURRING_FREQUENCIES,
	...NON_RECURRING_FREQUENCIES,
] as const;

type ReportType = (typeof REPORT_TYPES)[number];
type RecipientType = (typeof RECIPIENT_TYPES)[number];
type Frequency = (typeof FREQUENCIES)[number];

interface Report {
	readonly id: string;
	readonly policyId: string;
	readonly name: string;
	readonly description: string;
	readonly type: ReportType;
	readonly preparedBy: string;
	readonly recipient: string;
	readonly recipientType: RecipientType;
	readonly frequency: Frequency;
	readonly deadline: string | null;
	readonly quote: string;
}

const isRecurring = (report: Pick<Report, "frequency">): boolean =>
	RECURRING_FREQUENCIES.some((frequency) => frequency === report.frequency);

export {
	FREQUENCIES,
	RECIPIENT_TYPES,
	RECURRING_FREQUENCIES,
	REPORT_TYPES,
	isRecurring,
};
export type { Frequency, RecipientType, Report, ReportType };
