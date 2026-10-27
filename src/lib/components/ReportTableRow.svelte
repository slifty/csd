<script lang="ts">
	import type { Attachment } from "svelte/attachments";
	import FrequencyPill from "./FrequencyPill.svelte";
	import { formatIsoDate } from "#lib/dates.ts";
	import { frequencyBandOf } from "#lib/frequency.ts";
	import { boardDocsUrl, policyNumber } from "#lib/policy.ts";
	import {
		RECIPIENT_TYPE_LABELS,
		REPORT_COLUMN_COUNT,
		REPORT_COLUMN_LABELS,
		REPORT_TYPE_LABELS,
	} from "#lib/report-labels.ts";
	import type { ReportListing } from "#lib/report-listing.ts";

	const { listing }: { listing: ReportListing } = $props();
	const { report, policy } = $derived(listing);

	let isExpanded = $state(false);
	const toggleExpanded = (): void => {
		isExpanded = !isExpanded;
	};
	const isSelectingText = (): boolean =>
		window.getSelection()?.isCollapsed === false;
	const toggleOnClick: Attachment<HTMLTableRowElement> = (row) => {
		const onClick = (): void => {
			if (!isSelectingText()) {
				toggleExpanded();
			}
		};
		row.addEventListener("click", onClick);
		return (): void => {
			row.removeEventListener("click", onClick);
		};
	};
	const detailId = $derived(`report-${report.id}`);
	const band = $derived(frequencyBandOf(report.frequency));
	const bandColor = $derived(`var(--band-${band.id})`);
	const bandSoftColor = $derived(`var(--band-${band.id}-soft)`);
	const isAdministrativeRegulation = $derived(
		policy.kind === "administrative-regulation",
	);
</script>

<tr
	class="item"
	class:expanded={isExpanded}
	style:--band={bandColor}
	style:--band-soft={bandSoftColor}
	{@attach toggleOnClick}
>
	<td class="report-cell">
		<button
			type="button"
			class="name"
			aria-expanded={isExpanded}
			aria-controls={detailId}
		>
			{report.name}
		</button>
		<div class="description">{report.description}</div>
		{#if report.deadline !== null}
			<div class="due">
				<span class="due-label">Deadline</span>
				{report.deadline}
			</div>
		{/if}
	</td>
	<td class="frequency-cell">
		<span class="cell-label">{REPORT_COLUMN_LABELS.frequency}</span>
		<FrequencyPill frequency={report.frequency} />
		{#if report.deadline !== null}
			<div class="deadline">{report.deadline}</div>
		{/if}
	</td>
	<td class="prepared-by">
		<span class="cell-label">{REPORT_COLUMN_LABELS.preparedBy}</span>
		<ul class="preparers">
			{#each report.preparers as preparer, index (index)}
				<li>
					{preparer.name}
					{#if preparer.detail !== null}
						<small>{preparer.detail}</small>
					{/if}
				</li>
			{/each}
		</ul>
	</td>
	<td class="recipient">
		<span class="cell-label">{REPORT_COLUMN_LABELS.recipient}</span>
		{report.recipient}
		<small>{RECIPIENT_TYPE_LABELS[report.recipientType]}</small>
	</td>
	<td class="type">
		<span class="cell-label">{REPORT_COLUMN_LABELS.type}</span>
		{REPORT_TYPE_LABELS[report.type]}
	</td>
	<td>
		<span class="cell-label">{REPORT_COLUMN_LABELS.source}</span>
		<div class="source" class:regulation={isAdministrativeRegulation}>
			<span class="identity">
				<span class="kind">{isAdministrativeRegulation ? "AR" : "Policy"}</span>
				<span class="number">{policyNumber(policy)}</span>
			</span>
			<span class="policy-title">{policy.title}</span>
		</div>
	</td>
</tr>
<tr class="detail" id={detailId} hidden={!isExpanded} style:--band={bandColor}>
	<td colspan={REPORT_COLUMN_COUNT}>
		<div class="detail-box">
			<blockquote>“{report.quote}”</blockquote>
			<div class="meta">
				{#if policy.lastRevised !== null}
					<span>Last revised {formatIsoDate(policy.lastRevised)}</span>
				{/if}
				<a href={boardDocsUrl(policy)} target="_blank" rel="external noopener">
					Read {policy.code} on BoardDocs
				</a>
			</div>
		</div>
	</td>
</tr>

<style>
	td {
		padding: 12px 14px;
		border-top: 1px solid var(--rule);
		vertical-align: top;
	}

	.cell-label {
		display: none;
	}

	.name {
		font: inherit;
		font-weight: 600;
		color: var(--ink);
		text-align: left;
		background: none;
		border: 0;
		padding: 0;
		cursor: pointer;
	}

	.name:hover {
		color: var(--accent);
	}

	.description {
		color: var(--ink-2);
		font-size: 14px;
		margin-top: 2px;
		max-width: 62ch;
	}

	.deadline,
	.type {
		font-size: 13px;
		color: var(--ink-2);
	}

	.deadline {
		margin-top: 4px;
	}

	.due {
		display: none;
	}

	.item > .report-cell,
	.detail > td {
		box-shadow: inset 3px 0 0 var(--band);
	}

	.prepared-by,
	.recipient {
		font-size: 14px;
	}

	.preparers {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 6px;
	}

	.prepared-by small,
	.recipient small {
		display: block;
		color: var(--ink-2);
		font-size: 12px;
	}

	.item {
		cursor: pointer;
	}

	.item:hover td,
	.item.expanded td {
		background: var(--accent-soft);
	}

	.source {
		--pill: var(--accent);
		--pill-soft: var(--accent-soft);
		display: inline-grid;
		max-width: 100%;
		border: 1px solid var(--pill);
		border-radius: 10px;
		overflow: hidden;
		font-size: 12px;
		line-height: 1.6;
	}

	.source.regulation {
		--pill: var(--mark);
		--pill-soft: var(--mark-soft);
	}

	.identity {
		display: flex;
	}

	.kind,
	.number,
	.policy-title {
		padding: 0 8px;
	}

	.kind {
		flex: none;
		white-space: nowrap;
		background: var(--pill);
		color: var(--sheet);
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.number {
		font-weight: 600;
		color: var(--pill);
		font-variant-numeric: tabular-nums;
	}

	.policy-title {
		border-top: 1px solid var(--pill);
		background: var(--pill-soft);
		color: var(--ink);
		line-height: 1.4;
		padding-block: 2px;
		text-align: center;
	}

	.detail td {
		border-top: 0;
		padding-top: 0;
	}

	.detail-box {
		border-left: 3px solid var(--accent);
		padding: 4px 0 4px 14px;
		display: grid;
		gap: 8px;
		max-width: 90ch;
	}

	blockquote {
		margin: 0;
		font-size: 17px;
		line-height: 1.45;
	}

	.meta {
		font-size: 13px;
		color: var(--ink-2);
		display: flex;
		flex-wrap: wrap;
		gap: 4px 16px;
	}

	@media (max-width: 960px) {
		.cell-label {
			display: block;
			font-size: 11px;
			font-weight: 600;
			letter-spacing: 0.06em;
			text-transform: uppercase;
			color: var(--ink-2);
		}

		tr,
		td {
			display: block;
			width: 100%;
		}

		.item {
			padding: 14px;
			border-top: 1px solid var(--rule);
			display: grid;
			grid-template-columns: minmax(0, 1fr) auto;
			gap: 6px 12px;
			box-shadow: inset 3px 0 0 var(--band);
		}

		.item:hover,
		.item.expanded {
			background: var(--accent-soft);
		}

		.item td {
			padding: 0;
			border: 0;
			grid-column: 1 / -1;
		}

		.item:hover td,
		.item.expanded td {
			background: none;
		}

		.item > .report-cell {
			grid-column: 1;
			box-shadow: none;
		}

		.item > .frequency-cell {
			grid-column: 2;
			grid-row: 1;
		}

		.frequency-cell .cell-label,
		.frequency-cell .deadline {
			display: none;
		}

		.due {
			display: block;
			margin-top: 6px;
			font-size: 13px;
			color: var(--ink-2);
		}

		.due-label {
			font-weight: 600;
		}

		.detail td {
			padding: 0 14px 14px;
		}

		.detail[hidden] {
			display: none;
		}
	}
</style>
