<script lang="ts">
	import { resolve } from "$app/paths";
</script>

<svelte:head>
	<title>Cheltenham School District Tools</title>
</svelte:head>

<header>
	<div class="eyebrow">Cheltenham Township School District</div>
	<h1>Tools and resources</h1>
</header>

<ul>
	<li>
		<a href={resolve("/reports")}>Reports the policy manual requires</a>
		<p>
			Every report, notice, certification and public posting that a Board policy
			or Administrative Regulation calls for.
		</p>
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

	li p {
		margin: 4px 0 0;
		color: var(--ink-2);
	}
</style>
