import type { Policy } from "../policy.ts";

const serializePolicy = (policy: Policy): string =>
	`${JSON.stringify(policy, null, "\t")}\n`;

export { serializePolicy };
