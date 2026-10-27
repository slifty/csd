<script lang="ts">
	import { SvelteSet } from "svelte/reactivity";
	import {
		FREQUENCY_LABELS,
		PREPARER_TYPE_LABELS,
	} from "#lib/report-labels.ts";
	import { RECIPIENT_GROUPS, isInView } from "#lib/report-listing.ts";
	import { FREQUENCIES, PREPARER_TYPES } from "#lib/report.ts";
	import type {
		RecipientGroupId,
		ReportListing,
		ReportView,
	} from "#lib/report-listing.ts";
	import type { Frequency, PreparerType } from "#lib/report.ts";

	interface Props {
		listings: readonly ReportListing[];
		recipientCounts: ReadonlyMap<RecipientGroupId, number>;
		preparerCounts: ReadonlyMap<PreparerType, number>;
		shownCount: number;
		view: ReportView;
		search: string;
		frequency: Frequency | null;
		sectionNumber: string | null;
		recipientGroupIds: SvelteSet<RecipientGroupId>;
		preparerTypes: SvelteSet<PreparerType>;
		height: number;
	}

	let {
		listings,
		recipientCounts,
		preparerCounts,
		shownCount,
		view = $bindable(),
		search = $bindable(),
		frequency = $bindable(),
		sectionNumber = $bindable(),
		recipientGroupIds,
		preparerTypes,
		height = $bindable(),
	}: Props = $props();

	const VIEW_LABELS: Readonly<Record<ReportView, string>> = {
		recurring: "Recurring",
		"non-recurring": "Triggered or one-time",
		all: "All",
	};
	const VIEWS = Object.keys(VIEW_LABELS) as ReportView[];

	const frequenciesInView = $derived(
		FREQUENCIES.filter((candidate) =>
			listings.some(
				(listing) =>
					listing.report.frequency === candidate && isInView(view, listing),
			),
		),
	);

	const sections = $derived(
		[
			...new Map(
				listings.map(({ policy }) => [
					policy.section.number,
					policy.section.name,
				]),
			),
		].toSorted(([a], [b]) => a.localeCompare(b)),
	);

	const selectView = (selected: ReportView): void => {
		view = selected;
		if (frequency !== null && !frequenciesInView.includes(frequency)) {
			frequency = null;
		}
	};

	const toggle = <T,>(selected: SvelteSet<T>, value: T): void => {
		if (selected.has(value)) {
			selected.delete(value);
		} else {
			selected.add(value);
		}
	};
</script>

<section class="controls" aria-label="Filters" bind:offsetHeight={height}>
	<div class="row">
		<div class="segments" role="group" aria-label="Which reports">
			{#each VIEWS as candidate (candidate)}
				<button
					type="button"
					aria-pressed={view === candidate}
					onclick={() => selectView(candidate)}
				>
					{VIEW_LABELS[candidate]}
				</button>
			{/each}
		</div>
		<input
			id="report-search"
			type="search"
			placeholder="Search reports, recipients, policy numbers…"
			aria-label="Search"
			bind:value={search}
		/>
		<select id="report-frequency" aria-label="Frequency" bind:value={frequency}>
			<option value={null}>Any frequency</option>
			{#each frequenciesInView as candidate (candidate)}
				<option value={candidate}>{FREQUENCY_LABELS[candidate]}</option>
			{/each}
		</select>
		<select
			id="report-section"
			aria-label="Policy section"
			bind:value={sectionNumber}
		>
			<option value={null}>All sections</option>
			{#each sections as [number, name] (number)}
				<option value={number}>{number} – {name}</option>
			{/each}
		</select>
	</div>
	<div class="row">
		<span class="label">Goes to</span>
		<div class="chips">
			{#each RECIPIENT_GROUPS as group (group.id)}
				<button
					type="button"
					class="chip"
					aria-pressed={recipientGroupIds.has(group.id)}
					onclick={() => toggle(recipientGroupIds, group.id)}
				>
					{group.label}
					<span class="count">{recipientCounts.get(group.id) ?? 0}</span>
				</button>
			{/each}
		</div>
	</div>
	<div class="row">
		<span class="label">Prepared by</span>
		<div class="chips">
			{#each PREPARER_TYPES as preparerType (preparerType)}
				<button
					type="button"
					class="chip"
					aria-pressed={preparerTypes.has(preparerType)}
					onclick={() => toggle(preparerTypes, preparerType)}
				>
					{PREPARER_TYPE_LABELS[preparerType]}
					<span class="count">{preparerCounts.get(preparerType) ?? 0}</span>
				</button>
			{/each}
		</div>
		<span class="shown">{shownCount} of {listings.length} shown</span>
	</div>
</section>

<style>
	.controls {
		position: sticky;
		top: env(safe-area-inset-top, 0px);
		z-index: 5;
		background: var(--paper);
		display: grid;
		gap: 12px;
		padding-block: 12px;
		border-bottom: 1px solid var(--rule);
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 12px;
		align-items: center;
	}

	.segments {
		display: inline-flex;
		border: 1px solid var(--rule);
		border-radius: 6px;
		overflow: hidden;
		background: var(--sheet);
	}

	.segments button {
		font: inherit;
		font-size: 14px;
		border: 0;
		border-left: 1px solid var(--rule);
		background: none;
		color: var(--ink);
		padding: 7px 12px;
		cursor: pointer;
	}

	.segments button:first-child {
		border-left: 0;
	}

	.segments button[aria-pressed="true"] {
		background: var(--accent);
		color: var(--sheet);
		font-weight: 600;
	}

	input,
	select {
		font: inherit;
		font-size: 14px;
		padding: 7px 10px;
		border: 1px solid var(--rule);
		border-radius: 6px;
		background: var(--sheet);
		color: var(--ink);
	}

	input {
		flex: 1 1 240px;
		min-width: 0;
	}

	.label {
		min-width: 92px;
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	.chip {
		font: inherit;
		font-size: 13px;
		padding: 4px 10px;
		border-radius: 999px;
		border: 1px solid var(--rule);
		background: var(--sheet);
		color: var(--ink);
		cursor: pointer;
	}

	.chip[aria-pressed="true"] {
		background: var(--accent-soft);
		border-color: var(--accent);
		font-weight: 600;
	}

	.count {
		color: var(--ink-2);
		font-variant-numeric: tabular-nums;
		margin-left: 4px;
		font-weight: 400;
	}

	.shown {
		font-size: 13px;
		color: var(--ink-2);
		margin-left: auto;
		font-variant-numeric: tabular-nums;
	}

	@media (max-width: 960px) {
		.controls {
			position: static;
		}
	}
</style>
