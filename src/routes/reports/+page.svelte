<script lang="ts">
	import { SvelteSet } from "svelte/reactivity";
	import ReportFilters from "#lib/components/ReportFilters.svelte";
	import ReportTable from "#lib/components/ReportTable.svelte";
	import ReportTallies from "#lib/components/ReportTallies.svelte";
	import { countByRecipientGroup, matchesFilter } from "#lib/report-listing.ts";
	import type {
		RecipientGroupId,
		ReportFilter,
		ReportView,
	} from "#lib/report-listing.ts";
	import type { Frequency } from "#lib/report.ts";
	import type { PageProps } from "./$types";

	const { data }: PageProps = $props();

	let view: ReportView = $state("recurring");
	let search = $state("");
	let frequency: Frequency | null = $state(null);
	let sectionNumber: string | null = $state(null);
	const recipientGroupIds = new SvelteSet<RecipientGroupId>();

	const filter: ReportFilter = $derived({
		view,
		search,
		frequency,
		sectionNumber,
		recipientGroupIds,
	});
	const shownListings = $derived(
		data.listings.filter((listing) => matchesFilter(filter, listing)),
	);
	const recipientCounts = $derived(
		countByRecipientGroup(filter, data.listings),
	);
</script>

<svelte:head>
	<title>Cheltenham Required Reports</title>
	<meta
		name="description"
		content="Every report, notice, certification and public posting required by the Cheltenham Township School District's Board policies and Administrative Regulations."
	/>
</svelte:head>

<header>
	<div class="eyebrow">
		Cheltenham Township School District · Board Policy Manual
	</div>
	<h1>Reports the policy manual requires</h1>
	<p class="lede">
		Every report, notice, certification and public posting that a Board policy
		or Administrative Regulation calls for, drawn from all of the district's
		active policies. Open a report to see the exact sentence that requires it.
	</p>
</header>

<ReportTallies listings={data.listings} />

<ReportFilters
	listings={data.listings}
	{recipientCounts}
	shownCount={shownListings.length}
	bind:view
	bind:search
	bind:frequency
	bind:sectionNumber
	{recipientGroupIds}
/>

<ReportTable listings={shownListings} />

<section class="notes">
	<h2>How this was compiled</h2>
	<p>
		The full text of every active policy and Administrative Regulation was taken
		from the district's BoardDocs site, and each one was read in full. Every
		duty to produce information for someone was recorded: reports,
		notifications, certifications, plans, recommendations and public postings.
		Each quoted sentence is checked automatically against the policy text.
	</p>
	<p>
		The same report can show up in both a policy and its Administrative
		Regulation. Rows are kept per document and sorted by policy number, so these
		pairs sit next to each other.
	</p>
	<p>
		This register was compiled with the help of Claude, an AI model. Report
		names, descriptions, frequency and recipient categories involve judgment, so
		check the linked policy before relying on any single row.
	</p>
</section>

<style>
	header {
		display: grid;
		gap: 10px;
		max-width: 72ch;
	}

	h1 {
		font-size: clamp(30px, 5vw, 44px);
		line-height: 1.08;
		margin: 0;
	}

	.lede {
		margin: 0;
		color: var(--ink-2);
		font-size: 16px;
	}

	.notes {
		display: grid;
		gap: 10px;
		max-width: 75ch;
		font-size: 14px;
		color: var(--ink-2);
	}

	.notes h2 {
		font-size: 22px;
		color: var(--ink);
		margin: 0;
	}

	.notes p {
		margin: 0;
	}
</style>
