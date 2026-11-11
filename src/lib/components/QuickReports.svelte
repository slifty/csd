<script lang="ts">
	import BackToQuickReports from "./BackToQuickReports.svelte";
	import { QUICK_REPORTS } from "#lib/quick-reports.ts";
	import { UNFILTERED } from "#lib/report-listing.ts";
	import type { QuickReport } from "#lib/quick-reports.ts";
	import type { ApplyReportFilter } from "#lib/report-listing.ts";

	interface Props {
		selected: QuickReport | null;
		onselect: ApplyReportFilter;
		onrefine: () => void;
	}

	const { selected, onselect, onrefine }: Props = $props();
</script>

{#snippet cardText(label: string, description: string)}
	<span class="name">{label}</span>
	<span class="description">{description}</span>
{/snippet}

<section class="quick" aria-label="Quick reports">
	{#if selected !== null}
		<div class="back">
			<BackToQuickReports onclick={() => onselect(UNFILTERED)} />
		</div>
	{/if}
	<div class="choices" class:focused={selected !== null}>
		<div class="card" class:selected={selected === null}>
			<button
				type="button"
				class="choose"
				aria-pressed={selected === null}
				onclick={() => onselect(UNFILTERED)}
			>
				{@render cardText("All reports", "Every report the policies require.")}
			</button>
		</div>
		{#each QUICK_REPORTS as quickReport (quickReport.id)}
			{@const isSelected = selected === quickReport}
			<div class="card" class:selected={isSelected}>
				<button
					type="button"
					class="choose"
					aria-pressed={isSelected}
					onclick={() => onselect(quickReport.filter)}
				>
					{@render cardText(quickReport.label, quickReport.description)}
				</button>
			</div>
		{/each}
		<div class="card refine">
			<button type="button" class="choose" onclick={onrefine}>
				{@render cardText(
					"Open in advanced mode",
					"Narrow by type, frequency, policy section, and more.",
				)}
			</button>
		</div>
	</div>
</section>

<style>
	.quick {
		padding-block: 12px;
		border-bottom: 1px solid var(--rule);
	}

	.choices {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 8px;
	}

	.card {
		display: grid;
		align-content: start;
		border: 1px solid var(--rule);
		border-radius: 6px;
		background: var(--sheet);
		color: var(--ink);
	}

	.card.selected {
		background: var(--accent-soft);
		border-color: var(--accent);
	}

	.card.refine {
		background: var(--accent);
		border-color: var(--accent);
		color: var(--sheet);
	}

	.choose {
		font: inherit;
		text-align: left;
		cursor: pointer;
		color: inherit;
		border: 0;
		background: none;
		display: grid;
		align-content: start;
		gap: 2px;
		padding: 10px 12px;
	}

	.name {
		font-weight: 600;
	}

	.description {
		font-size: 13px;
		color: var(--ink-2);
	}

	.refine .description {
		color: inherit;
	}

	.back {
		display: none;
		padding-bottom: 8px;
	}

	@media (max-width: 640px) {
		.back {
			display: block;
		}

		.focused > .card:not(.selected, .refine) {
			display: none;
		}
	}
</style>
