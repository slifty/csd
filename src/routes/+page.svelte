<script lang="ts">
	import { resolve } from "$app/paths";
</script>

<svelte:head>
	<title>Cheltenham School District Tools</title>
</svelte:head>

<header>
	<h1>Tools and resources</h1>
</header>

<ul>
	<li>
		<a href={resolve("/reports")}>The Unofficial Official Report Report</a>
	</li>
</ul>

<style>
	h1 {
		font-size: clamp(30px, 5vw, 44px);
		line-height: 1.08;
		margin: 0;
	}

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
