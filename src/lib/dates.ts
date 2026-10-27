import type { IsoDate } from "./policy.ts";

const LONG_DATE = new Intl.DateTimeFormat("en-US", {
	dateStyle: "long",
	timeZone: "UTC",
});

const formatIsoDate = (date: IsoDate): string =>
	LONG_DATE.format(new Date(`${date}T00:00:00Z`));

export { formatIsoDate };
