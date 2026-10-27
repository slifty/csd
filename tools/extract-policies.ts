import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import {
	DATA_DIRECTORY,
	extractPolicies,
} from "../src/lib/server/boarddocs-snapshot.ts";
import { serializePolicy } from "../src/lib/server/policy-file.ts";

const POLICIES_DIRECTORY = new URL("policies/", DATA_DIRECTORY);

const policyFile = (fileName: string): URL =>
	new URL(fileName, POLICIES_DIRECTORY);

mkdirSync(POLICIES_DIRECTORY, { recursive: true });

const policies = extractPolicies();
const currentFileNames = new Set(policies.map(({ id }) => `${id}.json`));

for (const policy of policies) {
	writeFileSync(policyFile(`${policy.id}.json`), serializePolicy(policy));
}

const staleFileNames = readdirSync(POLICIES_DIRECTORY).filter(
	(fileName) => fileName.endsWith(".json") && !currentFileNames.has(fileName),
);
for (const fileName of staleFileNames) {
	rmSync(policyFile(fileName));
}

process.stdout.write(
	`Wrote ${policies.length} policies, removed ${staleFileNames.length} stale files\n`,
);
