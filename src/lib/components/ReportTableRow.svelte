<script lang="ts">
	import { formatIsoDate } from "#lib/dates.ts";
	import { boardDocsUrl } from "#lib/policy.ts";
	import {
		FREQUENCY_LABELS,
		RECIPIENT_TYPE_LABELS,
		REPORT_COLUMN_LABELS,
		REPORT_TYPE_LABELS,
	} from "#lib/report-labels.ts";
	import { isRecurring } from "#lib/report.ts";
	import type { ReportListing } from "#lib/report-listing.ts";

	const { listing }: { listing: ReportListing } = $props();
	const { report, policy } = $derived(listing);

	let isExpanded = $state(false);
	const toggleExpanded = (): void => {
		isExpanded = !isExpanded;
	};
	const detailId = $derived(`report-${report.id}`);
	const isAdministrativeRegulation = $derived(
		policy.kind === "administrative-regulation",
	);
</script>

<tr class="item">
	<td>
		<button
			type="button"
			class="name"
			aria-expanded={isExpanded}
			aria-controls={detailId}
			onclick={toggleExpanded}
		>
			{report.name}
		</button>
		<div class="description">{report.description}</div>
	</td>
	<td>
		<span class="cell-label">{REPORT_COLUMN_LABELS.frequency}</span>
		<div class="frequency" class:event={!isRecurring(report)}>
			{FREQUENCY_LABELS[report.frequency]}
		</div>
		{#if report.deadline !== null}
			<div class="deadline">{report.deadline}</div>
		{/if}
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
		<div class="code">
			<span class="kind" class:regulation={isAdministrativeRegulation}>
				{isAdministrativeRegulation ? "AR" : "Policy"}
			</span>
			{policy.code}
		</div>
		<div class="policy-title">{policy.title}</div>
	</td>
</tr>
<tr class="detail" id={detailId} hidden={!isExpanded}>
	<td colspan="5">
		<div class="detail-box">
			<blockquote>“{report.quote}”</blockquote>
			<div class="meta">
				<span>Prepared by {report.preparedBy}</span>
				<span>{policy.section.number} – {policy.section.name}</span>
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

	.frequency {
		font-weight: 600;
		white-space: nowrap;
	}

	.frequency.event {
		color: var(--mark);
	}

	.deadline,
	.policy-title,
	.type {
		font-size: 13px;
		color: var(--ink-2);
	}

	.deadline {
		margin-top: 2px;
	}

	.recipient {
		font-size: 14px;
	}

	.recipient small {
		display: block;
		color: var(--ink-2);
		font-size: 12px;
	}

	.code {
		font-family: var(--mono);
		font-size: 13px;
		white-space: nowrap;
	}

	.kind {
		display: inline-block;
		font-family: var(--body);
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		padding: 1px 6px;
		border-radius: 4px;
		margin-right: 6px;
		background: var(--accent-soft);
		color: var(--accent);
	}

	.kind.regulation {
		background: var(--mark-soft);
		color: var(--mark);
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
		font-family: var(--display);
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

	@media (max-width: 760px) {
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
			gap: 6px;
		}

		.item td {
			padding: 0;
			border: 0;
		}

		.detail td {
			padding: 0 14px 14px;
		}

		.detail[hidden] {
			display: none;
		}
	}
</style>
