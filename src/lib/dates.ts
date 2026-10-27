import type { IsoDate } from "./policy.ts";

const LONG_DATE = new Intl.DateTimeFormat("en-US", {
	dateStyle: "long",
	timeZone: "UTC",
});

const NUMERIC_DATE = new Intl.DateTimeFormat("en-US", {
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
	timeZone: "UTC",
});

const atUtcMidnight = (date: IsoDate): Date => new Date(`${date}T00:00:00Z`);

const formatIsoDate = (date: IsoDate): string =>
	LONG_DATE.format(atUtcMidnight(date));

const formatNumericIsoDate = (date: IsoDate): string =>
	NUMERIC_DATE.format(atUtcMidnight(date));

export { formatIsoDate, formatNumericIsoDate };
