import { FREQUENCY_CHOICES } from "./frequency.ts";
import {
	RECIPIENT_GROUPS,
	UNFILTERED,
	isSameFilter,
	matchesFilter,
	policySections,
} from "./report-listing.ts";
import { PREPARER_TYPES } from "./report.ts";
import type {
	RecipientGroupId,
	ReportFilter,
	ReportListing,
} from "./report-listing.ts";
import type { FrequencyChoice } from "./frequency.ts";
import type { PreparerType } from "./report.ts";

type FilterPatch = Partial<ReportFilter>;

interface MadLibOption {
	readonly id: string;
	readonly label: string;
	readonly patch: FilterPatch;
}

type MadLibBlankId = "frequency" | "preparer" | "recipient" | "section";

interface MadLibBlank {
	readonly id: MadLibBlankId;
	readonly term: string;
	readonly anyLabel: string;
	readonly options: readonly MadLibOption[];
}

type MadLibChoices = Readonly<Partial<Record<MadLibBlankId, string>>>;

const FREQUENCY_PHRASES: Readonly<Record<FrequencyChoice, string>> = {
	"per-meeting": "per-meeting",
	monthly: "monthly",
	quarterly: "quarterly",
	semiannual: "twice-yearly",
	annual: "annual",
	"extra-annually": "multi-year",
	ongoing: "ongoing",
	"as-required": "as-required",
	"one-time": "one-time",
	"event-triggered": "event-triggered",
};

const PREPARER_PHRASES: Readonly<Record<PreparerType, string>> = {
	board: "the Board",
	superintendent: "the Superintendent",
	administrators: "administrators",
	employees: "employees",
	"parents-and-students": "parents & students",
	"outside-parties": "outside parties",
	unspecified: "someone unnamed",
};

const RECIPIENT_PHRASES: Readonly<Record<RecipientGroupId, string>> = {
	board: "the Board",
	government: "state & federal agencies",
	public: "the public",
	families: "parents & students",
	employees: "employees",
	"law-enforcement": "law enforcement",
	"other-external": "other outside parties",
	administration: "administrators",
};

const FREQUENCY_OPTIONS: readonly MadLibOption[] = [
	{ id: "recurring", label: "recurring", patch: { view: "recurring" } },
	{ id: "ad-hoc", label: "ad hoc", patch: { view: "non-recurring" } },
	...FREQUENCY_CHOICES.map((choice) => ({
		id: choice,
		label: FREQUENCY_PHRASES[choice],
		patch: { frequency: choice },
	})),
];

const PREPARER_OPTIONS: readonly MadLibOption[] = PREPARER_TYPES.map(
	(preparerType) => ({
		id: preparerType,
		label: PREPARER_PHRASES[preparerType],
		patch: { preparerTypes: new Set([preparerType]) },
	}),
);

const RECIPIENT_OPTIONS: readonly MadLibOption[] = RECIPIENT_GROUPS.map(
	({ id }) => ({
		id,
		label: RECIPIENT_PHRASES[id],
		patch: { recipientGroupIds: new Set([id]) },
	}),
);

const sectionOptions = (
	listings: readonly ReportListing[],
): readonly MadLibOption[] =>
	policySections(listings).map(({ number, name }) => ({
		id: number,
		label: `${number} – ${name}`,
		patch: { sectionNumber: number },
	}));

const optionsWithReports = (
	options: readonly MadLibOption[],
	listings: readonly ReportListing[],
): readonly MadLibOption[] =>
	options.filter(({ patch }) =>
		listings.some((listing) =>
			matchesFilter({ ...UNFILTERED, ...patch }, listing),
		),
	);

const madLibBlanks = (
	listings: readonly ReportListing[],
): readonly MadLibBlank[] => [
	{
		id: "frequency",
		term: "frequency",
		anyLabel: "all",
		options: optionsWithReports(FREQUENCY_OPTIONS, listings),
	},
	{
		id: "preparer",
		term: "preparer",
		anyLabel: "anyone",
		options: optionsWithReports(PREPARER_OPTIONS, listings),
	},
	{
		id: "recipient",
		term: "recipient",
		anyLabel: "anyone",
		options: optionsWithReports(RECIPIENT_OPTIONS, listings),
	},
	{
		id: "section",
		term: "policy section",
		anyLabel: "any policy section",
		options: sectionOptions(listings),
	},
];

const chosenOption = (
	blank: MadLibBlank,
	choices: MadLibChoices,
): MadLibOption | null =>
	blank.options.find(({ id }) => id === choices[blank.id]) ?? null;

const madLibFilter = (
	blanks: readonly MadLibBlank[],
	choices: MadLibChoices,
): ReportFilter =>
	blanks.reduce<ReportFilter>(
		(filter, blank) => ({ ...filter, ...chosenOption(blank, choices)?.patch }),
		UNFILTERED,
	);

const isInFilter = (option: MadLibOption, filter: ReportFilter): boolean =>
	isSameFilter({ ...filter, ...option.patch }, filter);

const madLibChoicesOf = (
	blanks: readonly MadLibBlank[],
	filter: ReportFilter,
): MadLibChoices | null => {
	const choices = Object.fromEntries(
		blanks.flatMap((blank) => {
			const option = blank.options.find((candidate) =>
				isInFilter(candidate, filter),
			);
			return option === undefined ? [] : [[blank.id, option.id]];
		}),
	);
	return isSameFilter(madLibFilter(blanks, choices), filter) ? choices : null;
};

const matchingOptions = (
	options: readonly MadLibOption[],
	query: string,
): readonly MadLibOption[] => {
	const needle = query.trim().toLowerCase();
	return options.filter(({ label }) => label.toLowerCase().includes(needle));
};

export { madLibBlanks, madLibChoicesOf, madLibFilter, matchingOptions };
export type { MadLibBlank, MadLibBlankId, MadLibChoices, MadLibOption };
