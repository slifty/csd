<script lang="ts">
	import BackToQuickReports from "./BackToQuickReports.svelte";
	import {
		DEFAULT_OPTION_ID,
		QUICK_REPORTS,
		availableOptions,
		optionFilter,
	} from "#lib/quick-reports.ts";
	import { UNFILTERED } from "#lib/report-listing.ts";
	import type { QuickReportSelection } from "#lib/quick-reports.ts";
	import type {
		ApplyReportFilter,
		ReportListing,
	} from "#lib/report-listing.ts";

	interface Props {
		listings: readonly ReportListing[];
		selected: QuickReportSelection | null;
		onselect: ApplyReportFilter;
		onmadlib: () => void;
		onrefine: () => void;
	}

	const { listings, selected, onselect, onmadlib, onrefine }: Props = $props();
</script>

{#snippet cardText(label: string, description: string | null)}
	<span class="name">{label}</span>
	{#if description !== null}
		<span class="description">{description}</span>
	{/if}
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
			{@const isSelected = selected?.quickReport === quickReport}
			{@const modifierMenu = isSelected ? quickReport.modifierMenu : null}
			<div class="card" class:selected={isSelected}>
				<button
					type="button"
					class="choose"
					class:has-menu={modifierMenu !== null}
					aria-pressed={isSelected}
					onclick={() => onselect(quickReport.filter)}
				>
					{@render cardText(
						quickReport.label,
						modifierMenu === null ? quickReport.description : null,
					)}
				</button>
				{#if modifierMenu !== null}
					<label class="modifier">
						{modifierMenu.label}
						<select
							value={selected?.modifier?.id ?? DEFAULT_OPTION_ID}
							onchange={(event) =>
								onselect(optionFilter(quickReport, event.currentTarget.value))}
						>
							<option value={DEFAULT_OPTION_ID}>
								{modifierMenu.defaultLabel}
							</option>
							{#each availableOptions(modifierMenu, listings, selected?.modifier ?? null) as option (option.id)}
								<option value={option.id}>{option.label}</option>
							{/each}
						</select>
					</label>
				{/if}
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
		<div class="card mad-lib">
			<button type="button" class="choose" onclick={onmadlib}>
				{@render cardText(
					"Switch to mad lib mode",
					"Describe the reports you want in a sentence.",
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

	.card.mad-lib {
		background: var(--mark);
		border-color: var(--mark);
		color: var(--sheet);
	}

	.mad-lib .description {
		color: inherit;
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

	.choose.has-menu {
		padding-bottom: 6px;
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

	.modifier {
		display: grid;
		gap: 4px;
		margin: 0 12px 10px;
		font-size: 13px;
		color: var(--ink-2);
	}

	.modifier select {
		font: inherit;
		min-width: 0;
		padding: 4px 8px;
		border: 1px solid var(--rule);
		border-radius: 6px;
		background: var(--sheet);
		color: var(--ink);
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
