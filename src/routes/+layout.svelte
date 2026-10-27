<script lang="ts">
	import "../app.css";
	import { formatNumericIsoDate } from "#lib/dates.ts";
	import type { LayoutProps } from "./$types";

	const { data, children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link
		rel="preconnect"
		href="https://fonts.gstatic.com"
		crossorigin="anonymous"
	/>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;800&display=swap"
	/>
</svelte:head>

<div class="unofficial" role="note">
	<p class="wrap">
		Unofficial · Not affiliated with or endorsed by the Cheltenham Township
		School District
	</p>
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

	.unofficial p {
		margin-block: 0;
		padding-block: 8px;
	}

	main {
		padding-block: 40px 32px;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 28px;
	}

	footer {
		padding-block: 16px 48px;
		border-top: 1px solid var(--rule);
		color: var(--ink-2);
		font-size: 13px;
	}
</style>
