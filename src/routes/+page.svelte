<script lang="ts">
	import { resolve } from "$app/paths";
	import PageHeader from "#lib/components/PageHeader.svelte";
</script>

<svelte:head>
	<title>Cheltenham School District Tools</title>
</svelte:head>

<PageHeader title="Tools and resources" />

<ul>
	<li>
		<a href={resolve("/reports")}>The Unofficial Official Report Report</a>
	</li>
</ul>

<style>
	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 16px;
		max-width: 65ch;
	}

	li a {
		font-size: 18px;
		font-weight: 600;
	}
</style>
