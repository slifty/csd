import biffud from "@biffud/eslint-config";
import svelte from "eslint-plugin-svelte";
import ts from "typescript-eslint";

const testFiles = ["**/*.test.ts", "**/__tests__/**", "src/test/**"];
const svelteFiles = ["**/*.svelte", "**/*.svelte.ts"];

export default [
	{
		ignores: ["coverage/", "build/", ".svelte-kit/"],
	},
	...biffud,
	...svelte.configs.recommended,
	{
		languageOptions: {
			parserOptions: {
				extraFileExtensions: [".svelte"],
			},
		},
	},
	{
		files: svelteFiles,
		languageOptions: {
			parserOptions: {
				projectService: true,
				parser: ts.parser,
			},
		},
		rules: {
			"prefer-const": "off",
			"svelte/no-navigation-without-resolve": [
				"error",
				{ ignoreReplaceState: true },
			],
			"svelte/prefer-const": ["error", { destructuring: "all" }],
		},
	},
	{
		files: testFiles,
		rules: {
			"@typescript-eslint/explicit-function-return-type": "off",
			"no-magic-numbers": "off",
			"max-nested-callbacks": "off",
		},
	},
];
