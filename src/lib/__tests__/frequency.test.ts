import { describe, expect, it } from "vitest";
import {
	FREQUENCY_BANDS,
	FREQUENCY_CHOICES,
	frequencyBandOf,
	frequencyChoiceLabel,
	frequencyChoiceOf,
} from "../frequency.ts";
import { FREQUENCIES } from "../report.ts";

describe("FREQUENCY_BANDS", () => {
	it("puts every frequency in exactly one band", () => {
		const banded = FREQUENCY_BANDS.flatMap((band) => band.frequencies);
		expect(banded.toSorted()).toEqual([...FREQUENCIES].toSorted());
	});
});

describe("frequencyBandOf", () => {
	it("finds the band a frequency belongs to", () => {
		expect(frequencyBandOf("every-3-years").id).toBe("extra-annual");
		expect(frequencyBandOf("one-time").id).toBe("triggered");
	});
});

describe("frequencyChoiceOf", () => {
	it("collapses every multi-year frequency into one choice", () => {
		expect(frequencyChoiceOf("every-2-years")).toBe("extra-annually");
		expect(frequencyChoiceOf("every-6-years")).toBe("extra-annually");
	});

	it("keeps every other frequency as its own choice", () => {
		expect(frequencyChoiceOf("annual")).toBe("annual");
	});
});

describe("FREQUENCY_CHOICES", () => {
	it("offers extra-annually once, in place of the multi-year frequencies", () => {
		expect(FREQUENCY_CHOICES).toEqual([
			"per-meeting",
			"monthly",
			"quarterly",
			"semiannual",
			"annual",
			"extra-annually",
			"ongoing",
			"as-required",
			"one-time",
			"event-triggered",
		]);
	});
});

describe("frequencyChoiceLabel", () => {
	it("names the collapsed choice", () => {
		expect(frequencyChoiceLabel("extra-annually")).toBe("Extra-annually");
	});

	it("uses the frequency's own label otherwise", () => {
		expect(frequencyChoiceLabel("semiannual")).toBe("Twice a year");
	});
});
