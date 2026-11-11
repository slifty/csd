<script lang="ts">
	const { title }: { title: string } = $props();
</script>

<header>
	<h1>{title}</h1>
</header>

<style>
	header {
		margin-bottom: calc(-1 * var(--section-gap) / 2);
	}

	h1 {
		font-family: var(--display);
		font-weight: 400;
		font-size: clamp(28px, 4.5vw, 38px);
		line-height: 1.15;
		margin: 0;
	}
</style>
