import type { IsoDate } from "../policy.ts";

const sourceFiles = import.meta.glob<unknown>("/data/source.json", {
	import: "default",
	eager: true,
});

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/v;

const isRealDate = (date: string): boolean => {
	const parsed = new Date(`${date}T00:00:00Z`);
	return (
		!Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(date)
	);
};

const readRetrievedOn = (raw: unknown): IsoDate => {
	const retrievedOn =
		typeof raw === "object" && raw !== null && "boardDocsRetrievedOn" in raw
			? raw.boardDocsRetrievedOn
			: undefined;
	if (
		typeof retrievedOn !== "string" ||
		!ISO_DATE_PATTERN.test(retrievedOn) ||
		!isRealDate(retrievedOn)
	) {
		throw new Error(
			'data/source.json: "boardDocsRetrievedOn" must be a YYYY-MM-DD date',
		);
	}
	return retrievedOn;
};

const boardDocsRetrievedOn: IsoDate = readRetrievedOn(
	sourceFiles["/data/source.json"],
);

export { boardDocsRetrievedOn, readRetrievedOn };
