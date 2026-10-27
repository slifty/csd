<script lang="ts">
	import type { Attachment } from "svelte/attachments";
	import {
		REPORT_TYPE_DEFINITIONS,
		REPORT_TYPE_LABELS,
	} from "#lib/report-labels.ts";
	import type { ReportType } from "#lib/report.ts";

	const { type, id }: { type: ReportType; id: string } = $props();
	const label = $derived(REPORT_TYPE_LABELS[type]);
	const anchorName = $derived(`--${id}`);

	const keepClicksFromRow: Attachment<HTMLElement> = (element) => {
		const stopPropagation = (event: Event): void => {
			event.stopPropagation();
		};
		element.addEventListener("click", stopPropagation);
		return (): void => {
			element.removeEventListener("click", stopPropagation);
		};
	};
</script>

<span class="type-label" {@attach keepClicksFromRow}>
	{label}
	<button
		type="button"
		class="help"
		popovertarget={id}
		aria-label={`What does “${label}” mean?`}
		style:anchor-name={anchorName}
	>
		?
	</button>
	<span
		class="definition"
		{id}
		popover="auto"
		style:position-anchor={anchorName}
	>
		<strong>{label}</strong>
		{REPORT_TYPE_DEFINITIONS[type]}
	</span>
</span>

<style>
	.type-label {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}

	.help {
		position: relative;
		flex: none;
		width: 18px;
		height: 18px;
		padding: 0;
		border: 1px solid currentColor;
		border-radius: 50%;
		background: none;
		color: var(--ink-2);
		font: inherit;
		font-size: 11px;
		font-weight: 700;
		line-height: 1;
		cursor: pointer;
	}

	.help::after {
		content: "";
		position: absolute;
		inset: -10px;
	}

	.help:hover,
	.help:focus-visible {
		color: var(--accent);
	}

	.definition {
		max-width: min(320px, calc(100vw - 32px));
		padding: 10px 12px;
		border: 1px solid var(--rule);
		border-radius: 8px;
		background: var(--sheet);
		color: var(--ink);
		font-size: 14px;
		line-height: 1.45;
		box-shadow: 0 4px 16px rgb(0 0 0 / 15%);
	}

	.definition strong {
		display: block;
		margin-bottom: 2px;
	}

	@supports (position-area: bottom) {
		.definition {
			inset: auto;
			margin: 6px 16px 6px 0;
			position-area: bottom span-right;
			position-try-fallbacks: flip-block, flip-inline;
		}
	}
</style>
