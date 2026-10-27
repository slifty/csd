<script lang="ts">
	import ReportTableRow from "./ReportTableRow.svelte";
	import {
		REPORT_COLUMN_COUNT,
		REPORT_COLUMN_LABELS,
	} from "#lib/report-labels.ts";
	import type { ReportListing } from "#lib/report-listing.ts";

	const {
		listings,
		stickyTop,
	}: { listings: readonly ReportListing[]; stickyTop: number } = $props();
</script>

<div class="ledger" style:--sticky-top="{stickyTop}px">
	<table>
		<thead>
			<tr>
				{#each Object.values(REPORT_COLUMN_LABELS) as label (label)}
					<th scope="col">{label}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each listings as listing (listing.report.id)}
				<ReportTableRow {listing} />
			{:else}
				<tr>
					<td colspan={REPORT_COLUMN_COUNT} class="empty">
						No reports match. Clear the search or change the filters.
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.ledger {
		overflow: clip;
		background: var(--sheet);
		border: 1px solid var(--rule);
		border-radius: 8px;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th {
		position: sticky;
		top: calc(env(safe-area-inset-top, 0px) + var(--sticky-top));
		z-index: 1;
		background: var(--sheet);
		box-shadow: inset 0 -1px 0 var(--rule);
		text-align: left;
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-2);
		padding: 10px 14px;
	}

	.empty {
		padding: 32px 14px;
		text-align: center;
		color: var(--ink-2);
		border-top: 1px solid var(--rule);
	}

	@media (max-width: 960px) {
		thead {
			display: none;
		}

		table,
		tbody {
			display: block;
			width: 100%;
		}
	}
</style>
