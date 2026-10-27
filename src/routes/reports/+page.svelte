<script lang="ts">
	import { onMount, untrack } from "svelte";
	import { SvelteSet } from "svelte/reactivity";
	import { replaceState } from "$app/navigation";
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import ReportFilters from "#lib/components/ReportFilters.svelte";
	import ReportTable from "#lib/components/ReportTable.svelte";
	import {
		readReportFilter,
		writeReportFilter,
	} from "#lib/report-filter-url.ts";
	import {
		countByPreparerType,
		countByRecipientGroup,
		matchesFilter,
	} from "#lib/report-listing.ts";
	import type {
		RecipientGroupId,
		ReportFilter,
		ReportView,
	} from "#lib/report-listing.ts";
	import type { Frequency, PreparerType } from "#lib/report.ts";
	import type { PageProps } from "./$types";

	const { data }: PageProps = $props();

	let view: ReportView = $state("recurring");
	let search = $state("");
	let frequency: Frequency | null = $state(null);
	let sectionNumber: string | null = $state(null);
	const recipientGroupIds = new SvelteSet<RecipientGroupId>();
	const preparerTypes = new SvelteSet<PreparerType>();
	let filtersHeight = $state(0);

	const filter: ReportFilter = $derived({
		view,
		search,
		frequency,
		sectionNumber,
		recipientGroupIds,
		preparerTypes,
	});
	const shownListings = $derived(
		data.listings.filter((listing) => matchesFilter(filter, listing)),
	);
	const recipientCounts = $derived(
		countByRecipientGroup(filter, data.listings),
	);
	const preparerCounts = $derived(countByPreparerType(filter, data.listings));

	const replaceAll = <T,>(
		selected: SvelteSet<T>,
		values: Iterable<T>,
	): void => {
		selected.clear();
		for (const value of values) {
			selected.add(value);
		}
	};

	let hasReadUrl = $state(false);

	onMount(() => {
		const sectionNumbers = new Set(
			data.listings.map(({ policy }) => policy.section.number),
		);
		const initial = readReportFilter(page.url.searchParams, sectionNumbers);
		view = initial.view;
		search = initial.search;
		frequency = initial.frequency;
		sectionNumber = initial.sectionNumber;
		replaceAll(recipientGroupIds, initial.recipientGroupIds);
		replaceAll(preparerTypes, initial.preparerTypes);
		hasReadUrl = true;
	});

	$effect(() => {
		if (!hasReadUrl) {
			return;
		}
		const query = writeReportFilter(filter).toString();
		const currentQuery = new URLSearchParams(window.location.search).toString();
		if (query !== currentQuery) {
			const reportsPath = resolve("/reports");
			void replaceState(
				query === "" ? reportsPath : `${reportsPath}?${query}`,
				untrack(() => page.state),
			);
		}
	});
</script>

<svelte:head>
	<title>The Unofficial Official Report Report</title>
	<meta
		name="description"
		content="Reports required by the Cheltenham Township School District's Board policies and Administrative Regulations."
	/>
</svelte:head>

<h1>The Unofficial Official Report Report</h1>

<ReportFilters
	listings={data.listings}
	{recipientCounts}
	{preparerCounts}
	shownCount={shownListings.length}
	bind:view
	bind:search
	bind:frequency
	bind:sectionNumber
	{recipientGroupIds}
	{preparerTypes}
	bind:height={filtersHeight}
/>

<ReportTable listings={shownListings} stickyTop={filtersHeight} />

<style>
	h1 {
		font-size: clamp(30px, 5vw, 44px);
		line-height: 1.08;
		margin: 0;
	}
</style>
