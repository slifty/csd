type IsoDate = string;

type PolicyKind = "administrative-regulation" | "policy";

interface PolicySection {
	readonly number: string;
	readonly name: string;
}

interface Policy {
	readonly id: string;
	readonly code: string;
	readonly kind: PolicyKind;
	readonly title: string;
	readonly section: PolicySection;
	readonly adopted: IsoDate | null;
	readonly lastRevised: IsoDate | null;
	readonly lastReviewed: IsoDate | null;
	readonly source: string;
}

const BOARD_DOCS_ITEM_URL =
	"https://go.boarddocs.com/pa/ctsd/Board.nsf/goto?open&id=";

const REGULATION_SUFFIX_PATTERN = /-ar\b/iv;

const boardDocsUrl = (policy: Pick<Policy, "id">): string =>
	`${BOARD_DOCS_ITEM_URL}${encodeURIComponent(policy.id)}`;

const policyNumber = (policy: Pick<Policy, "code">): string =>
	policy.code.replace(REGULATION_SUFFIX_PATTERN, "");

export { boardDocsUrl, policyNumber };
export type { IsoDate, Policy, PolicyKind, PolicySection };
