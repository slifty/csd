import { FREQUENCY_LABELS } from "./report-labels.ts";
import { FREQUENCIES } from "./report.ts";
import type { Frequency } from "./report.ts";

const EXTRA_ANNUAL_FREQUENCIES = [
	"every-2-years",
	"every-3-years",
	"every-5-years",
	"every-6-years",
] as const satisfies readonly Frequency[];

const FREQUENCY_BANDS = [
	{
		id: "frequent",
		label: "Often",
		frequencies: ["per-meeting", "monthly", "quarterly"],
	},
	{ id: "yearly", label: "Yearly", frequencies: ["semiannual", "annual"] },
	{
		id: "extra-annual",
		label: "Extra-annually",
		frequencies: EXTRA_ANNUAL_FREQUENCIES,
	},
	{
		id: "ongoing",
		label: "Ongoing / as required",
		frequencies: ["ongoing", "as-required"],
	},
	{
		id: "triggered",
		label: "When triggered / one time",
		frequencies: ["event-triggered", "one-time"],
	},
] as const satisfies ReadonlyArray<{
	id: string;
	label: string;
	frequencies: readonly Frequency[];
}>;

type FrequencyBand = (typeof FREQUENCY_BANDS)[number];
type FrequencyBandId = FrequencyBand["id"];

const EXTRA_ANNUALLY = "extra-annually";

type ExtraAnnualFrequency = (typeof EXTRA_ANNUAL_FREQUENCIES)[number];
type FrequencyChoice =
	Exclude<Frequency, ExtraAnnualFrequency> | typeof EXTRA_ANNUALLY;

const isExtraAnnual = (
	frequency: Frequency,
): frequency is ExtraAnnualFrequency =>
	EXTRA_ANNUAL_FREQUENCIES.some((candidate) => candidate === frequency);

const frequencyChoiceOf = (frequency: Frequency): FrequencyChoice =>
	isExtraAnnual(frequency) ? EXTRA_ANNUALLY : frequency;

const FREQUENCY_CHOICES: readonly FrequencyChoice[] = [
	...new Set(FREQUENCIES.map(frequencyChoiceOf)),
];

const frequencyChoiceLabel = (choice: FrequencyChoice): string =>
	choice === EXTRA_ANNUALLY ? "Extra-annually" : FREQUENCY_LABELS[choice];

const frequencyBandOf = (frequency: Frequency): FrequencyBand => {
	const band = FREQUENCY_BANDS.find((candidate) =>
		candidate.frequencies.some((member) => member === frequency),
	);
	if (band === undefined) {
		throw new Error(`Frequency "${frequency}" belongs to no band`);
	}
	return band;
};

export {
	FREQUENCY_BANDS,
	FREQUENCY_CHOICES,
	frequencyBandOf,
	frequencyChoiceLabel,
	frequencyChoiceOf,
};
export type { FrequencyBand, FrequencyBandId, FrequencyChoice };
