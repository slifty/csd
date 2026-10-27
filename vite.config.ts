import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

type BasePath = "" | `/${string}`;

const isBasePath = (path: string): path is BasePath =>
	path === "" || path.startsWith("/");

const readBasePath = (): BasePath => {
	const basePath = process.env.BASE_PATH ?? "";
	if (!isBasePath(basePath)) {
		throw new Error(
			`BASE_PATH must be empty or start with "/", but was "${basePath}"`,
		);
	}
	return basePath;
};

export default defineConfig({
	plugins: [
		sveltekit({
			adapter: adapter({ fallback: "404.html" }),
			paths: { base: readBasePath() },
		}),
	],
});
