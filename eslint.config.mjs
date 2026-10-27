import biffud from "@biffud/eslint-config";

const testFiles = ["**/*.test.ts", "**/__tests__/**", "src/test/**"];

export default [
	{
		ignores: ["coverage/"],
	},
	...biffud,
	{
		files: testFiles,
		rules: {
			"@typescript-eslint/explicit-function-return-type": "off",
			"no-magic-numbers": "off",
			"max-nested-callbacks": "off",
		},
	},
];
