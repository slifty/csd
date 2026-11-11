<script lang="ts">
	import { SvelteSet } from "svelte/reactivity";
	import ReportTableRow from "./ReportTableRow.svelte";
	import {
		REPORT_COLUMN_COUNT,
		REPORT_COLUMN_LABELS,
	} from "#lib/report-labels.ts";
	import { groupBySection } from "#lib/report-listing.ts";
	import type { ReportListing } from "#lib/report-listing.ts";

	interface Props {
		listings: readonly ReportListing[];
		totalCount: number;
		stickyTop: number;
	}

	const { listings, totalCount, stickyTop }: Props = $props();

	const sectionGroups = $derived(groupBySection(listings));
	const collapsedSectionNumbers = new SvelteSet<string>();

	const toggleSection = (sectionNumber: string): void => {
		if (collapsedSectionNumbers.has(sectionNumber)) {
			collapsedSectionNumbers.delete(sectionNumber);
		} else {
			collapsedSectionNumbers.add(sectionNumber);
		}
	};
</script>

<div class="results">
	<p class="shown">{listings.length} of {totalCount} shown</p>

	<div class="ledger" style:--sticky-top="{stickyTop}px">
		<table>
			<thead>
				<tr>
					{#each Object.values(REPORT_COLUMN_LABELS) as label (label)}
						<th scope="col">{label}</th>
					{/each}
				</tr>
			</thead>
			{#each sectionGroups as { section, listings: sectionListings } (section.number)}
				{@const isCollapsed = collapsedSectionNumbers.has(section.number)}
				{@const sectionId = `section-${section.number}`}
				<tbody>
					<tr class="section-row">
						<th colspan={REPORT_COLUMN_COUNT}>
							<button
								type="button"
								class="section-toggle"
								aria-expanded={!isCollapsed}
								aria-controls={sectionId}
								onclick={() => {
									toggleSection(section.number);
								}}
							>
								<span class="section-number">{section.number}</span>
								<span class="section-name">{section.name}</span>
								<span class="section-count">{sectionListings.length}</span>
							</button>
						</th>
					</tr>
				</tbody>
				<tbody id={sectionId} hidden={isCollapsed}>
					{#each sectionListings as listing (listing.report.id)}
						<ReportTableRow {listing} />
					{/each}
				</tbody>
			{:else}
				<tbody>
					<tr>
						<td colspan={REPORT_COLUMN_COUNT} class="empty">
							No reports match. Clear the search or change the filters.
						</td>
					</tr>
				</tbody>
			{/each}
		</table>
	</div>
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

	thead th {
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

	.section-row th {
		padding: 0;
		border-top: 1px solid var(--rule);
		background: var(--paper);
	}

	.section-toggle {
		display: flex;
		align-items: baseline;
		gap: 10px;
		width: 100%;
		padding: 10px 14px;
		font: inherit;
		font-weight: 600;
		color: var(--ink);
		text-align: left;
		background: none;
		border: 0;
		cursor: pointer;
	}

	.section-toggle::before {
		content: "";
		align-self: center;
		border-block: 5px solid transparent;
		border-inline-start: 7px solid currentcolor;
		transform: rotate(90deg);
		transition: transform 0.15s;
	}

	.section-toggle[aria-expanded="false"]::before {
		transform: none;
	}

	.section-toggle:hover {
		color: var(--accent);
	}

	.section-number {
		color: var(--ink-2);
		font-variant-numeric: tabular-nums;
	}

	.section-count {
		margin-left: auto;
		font-size: 13px;
		font-weight: 400;
		color: var(--ink-2);
		font-variant-numeric: tabular-nums;
	}

	.shown {
		margin: 0 0 6px;
		text-align: right;
		font-size: 13px;
		color: var(--ink-2);
		font-variant-numeric: tabular-nums;
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
		tbody,
		.section-row,
		.section-row th {
			display: block;
			width: 100%;
		}

		tbody[hidden] {
			display: none;
		}
	}
</style>
