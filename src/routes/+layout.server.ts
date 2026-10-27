import { boardDocsRetrievedOn } from "#lib/server/source.ts";
import type { IsoDate } from "#lib/policy.ts";

interface LayoutData {
	readonly boardDocsRetrievedOn: IsoDate;
}

const load = (): LayoutData => ({ boardDocsRetrievedOn });

export { load };
