<script lang="ts">
	const { onclick }: { onclick: () => void } = $props();
</script>

<button type="button" {onclick}>← Back to quick reports</button>

<style>
	button {
		font: inherit;
		font-size: 14px;
		border: 0;
		background: none;
		color: var(--accent);
		padding: 0;
		text-decoration: underline;
		cursor: pointer;
	}
</style>
