<script lang="ts">
	import { isRecurring } from "#lib/report.ts";
	import type { ReportListing } from "#lib/report-listing.ts";

	const { listings }: { listings: readonly ReportListing[] } = $props();

	const recurring = $derived(
		listings.filter(({ report }) => isRecurring(report)),
	);
	const tallies = $derived([
		{
			count: recurring.length,
			label: "recurring reports",
		},
		{
			count: recurring.filter(({ report }) => report.recipientType === "board")
				.length,
			label: "recurring board reports",
		},
		{
			count: recurring.filter(
				({ report }) =>
					report.recipientType === "state-agency" ||
					report.recipientType === "federal-agency",
			).length,
			label: "recurring state & federal reports",
		},
		{
			count: listings.length - recurring.length,
			label: "triggered or one-time reports",
		},
	]);
</script>

<section class="tallies" aria-label="Summary">
	{#each tallies as tally (tally.label)}
		<div class="tally">
			<b>{tally.count}</b>
			<span>{tally.label}</span>
		</div>
	{/each}
</section>

<style>
	.tallies {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		border-block: 1px solid var(--rule);
	}

	.tally {
		padding: 16px 18px;
		display: grid;
		gap: 2px;
		border-left: 1px solid var(--rule);
	}

	.tally:first-child {
		border-left: 0;
		padding-left: 0;
	}

	b {
		font-size: 34px;
		font-weight: 600;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}

	span {
		font-size: 13px;
		color: var(--ink-2);
	}

	@media (max-width: 720px) {
		.tallies {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.tally:nth-child(3) {
			border-left: 0;
			padding-left: 0;
		}

		.tally:nth-child(n + 3) {
			border-top: 1px solid var(--rule);
		}
	}
</style>
