<script lang="ts">
	import "../app.css";
	import type { Snippet } from "svelte";

	const { children }: { children: Snippet } = $props();
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
		href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;800&family=Newsreader:opsz,wght@6..72,500;6..72,600&family=IBM+Plex+Mono:wght@500&display=swap"
	/>
</svelte:head>

<main class="wrap">
	{@render children()}
</main>

<footer class="wrap">
	<p>
		An unofficial project, not affiliated with the Cheltenham Township School
		District. The district publishes its policies on
		<a href="https://go.boarddocs.com/pa/ctsd/Board.nsf/Public">BoardDocs</a>.
	</p>
</footer>

<style>
	.wrap {
		max-width: 1180px;
		margin: 0 auto;
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
