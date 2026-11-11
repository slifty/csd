<script lang="ts">
	import "@fontsource/public-sans/400.css";
	import "@fontsource/public-sans/500.css";
	import "@fontsource/public-sans/600.css";
	import "@fontsource/public-sans/700.css";
	import "@fontsource/public-sans/800.css";
	import "@fontsource/special-elite/400.css";
	import "../app.css";
	import { formatNumericIsoDate } from "#lib/dates.ts";
	import { SOURCE_CODE_URL } from "#lib/source-code.ts";
	import type { LayoutProps } from "./$types";

	const { data, children }: LayoutProps = $props();
</script>

<div class="unofficial">
	<div class="wrap banner">
		<p role="note">
			Not affiliated with or endorsed by the Cheltenham Township School District
		</p>
		<a
			class="source-code"
			href={SOURCE_CODE_URL}
			rel="external"
			aria-label="Source code on GitHub"
		>
			<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
				<path
					fill="currentColor"
					d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"
				/>
			</svg>
		</a>
	</div>
</div>

<main class="wrap">
	{@render children()}
</main>

<footer class="wrap">
	<p>
		Based on policy data from the district's
		<a href="https://go.boarddocs.com/pa/ctsd/Board.nsf/Public">BoardDocs</a>
		as of {formatNumericIsoDate(data.boardDocsRetrievedOn)}. Check the linked
		policy before relying on any entry.
	</p>
	<p>
		This site is free and open. Neat! The code is
		<a href={SOURCE_CODE_URL} rel="external">on GitHub</a>.
	</p>
</footer>

<style>
	.wrap {
		max-width: 1180px;
		margin: 0 auto;
	}

	.unofficial {
		margin-inline: calc(-1 * max(16px, env(safe-area-inset-left, 0px)));
		padding-inline: max(16px, env(safe-area-inset-left, 0px));
		background: var(--mark-soft);
		color: var(--mark);
		font-size: 13px;
		font-weight: 600;
	}

	.banner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	.banner p {
		margin-block: 0;
		padding-block: 8px;
	}

	.source-code {
		flex: none;
		display: flex;
		color: inherit;
		opacity: 0.85;
		transition: opacity 0.15s;
	}

	.source-code:hover,
	.source-code:focus-visible {
		opacity: 1;
	}

	main {
		padding-block: 40px 32px;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--section-gap);
	}

	footer {
		padding-block: 16px 48px;
		border-top: 1px solid var(--rule);
		color: var(--ink-2);
		font-size: 13px;
	}
</style>
