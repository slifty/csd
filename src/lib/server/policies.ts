import type { Policy } from "../policy.ts";

const policyFiles = import.meta.glob<Policy>("/data/policies/*.json", {
	import: "default",
	eager: true,
});

const compareCodes = (
	a: Pick<Policy, "code">,
	b: Pick<Policy, "code">,
): number => a.code.localeCompare(b.code, "en", { numeric: true });

const policies: readonly Policy[] =
	Object.values(policyFiles).toSorted(compareCodes);

const policiesById: ReadonlyMap<string, Policy> = new Map(
	policies.map((policy) => [policy.id, policy]),
);

const requirePolicy = (id: string): Policy => {
	const policy = policiesById.get(id);
	if (policy === undefined) {
		throw new Error(`No policy has id ${id}`);
	}
	return policy;
};

export { compareCodes, policies, policiesById, requirePolicy };
