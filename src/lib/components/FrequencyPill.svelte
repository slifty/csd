<script lang="ts">
	import { FREQUENCY_LABELS } from "#lib/report-labels.ts";
	import type { Frequency } from "#lib/report.ts";

	const { frequency }: { frequency: Frequency } = $props();
</script>

<span class="frequency-pill">{FREQUENCY_LABELS[frequency]}</span>

<style>
	.frequency-pill {
		display: inline-block;
		padding: 1px 10px;
		border-radius: 999px;
		border: 1px solid var(--band);
		background: var(--band-soft);
		color: var(--band);
		font-size: 13px;
		font-weight: 600;
		line-height: 1.5;
		white-space: nowrap;
	}
</style>
