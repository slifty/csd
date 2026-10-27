<script lang="ts">
	import ReportTableRow from "./ReportTableRow.svelte";
	import { REPORT_COLUMN_LABELS } from "#lib/report-labels.ts";
	import type { ReportListing } from "#lib/report-listing.ts";

	const { listings }: { listings: readonly ReportListing[] } = $props();
</script>

<div class="ledger">
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
					<td colspan="5" class="empty">
						No reports match these filters. Clear the search or pick another
						recipient.
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.ledger {
		overflow-x: auto;
		background: var(--sheet);
		border: 1px solid var(--rule);
		border-radius: 8px;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th {
		text-align: left;
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-2);
		padding: 10px 14px;
		white-space: nowrap;
	}

	.empty {
		padding: 32px 14px;
		text-align: center;
		color: var(--ink-2);
		border-top: 1px solid var(--rule);
	}

	@media (max-width: 760px) {
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
