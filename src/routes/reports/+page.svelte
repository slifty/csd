<script lang="ts">
	import { onMount, untrack } from "svelte";
	import { SvelteSet } from "svelte/reactivity";
	import { replaceState } from "$app/navigation";
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import BackToQuickReports from "#lib/components/BackToQuickReports.svelte";
	import MadLib from "#lib/components/MadLib.svelte";
	import QuickReports from "#lib/components/QuickReports.svelte";
	import ReportFilters from "#lib/components/ReportFilters.svelte";
	import ReportTable from "#lib/components/ReportTable.svelte";
	import { madLibBlanks, madLibChoicesOf, madLibFilter } from "#lib/mad-lib.ts";
	import {
		findQuickReport,
		fitsQuickReports,
		initialMode,
	} from "#lib/quick-reports.ts";
	import {
		readReportFilter,
		readReportMode,
		writeReportFilter,
		writeReportMode,
	} from "#lib/report-filter-url.ts";
	import {
		UNFILTERED,
		countByPreparerType,
		countByRecipientGroup,
		isUnfiltered,
		matchesFilter,
	} from "#lib/report-listing.ts";
	import type {
		RecipientGroupId,
		ReportFilter,
		ReportView,
	} from "#lib/report-listing.ts";
	import type { ReportMode } from "#lib/report-filter-url.ts";
	import type { FrequencyChoice } from "#lib/frequency.ts";
	import type { PreparerType, ReportType } from "#lib/report.ts";
	import type { PageProps } from "./$types";

	const { data }: PageProps = $props();

	let view: ReportView = $state("all");
	let search = $state("");
	let frequency: FrequencyChoice | null = $state(null);
	let reportType: ReportType | null = $state(null);
	let sectionNumber: string | null = $state(null);
	const recipientGroupIds = new SvelteSet<RecipientGroupId>();
	const preparerTypes = new SvelteSet<PreparerType>();
	let mode = $state<ReportMode>("quick");
	let filtersHeight = $state(0);

	const filter: ReportFilter = $derived({
		view,
		search,
		frequency,
		reportType,
		sectionNumber,
		recipientGroupIds,
		preparerTypes,
	});
	const advanced = $derived(mode === "advanced");
	const blanks = $derived(madLibBlanks(data.listings));
	const madLibChoices = $derived(
		mode === "mad-lib" ? (madLibChoicesOf(blanks, filter) ?? {}) : {},
	);
	const selectedQuickReport = $derived(findQuickReport(filter));
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

	const applyFilter = (applied: ReportFilter): void => {
		view = applied.view;
		search = applied.search;
		frequency = applied.frequency;
		reportType = applied.reportType;
		sectionNumber = applied.sectionNumber;
		replaceAll(recipientGroupIds, applied.recipientGroupIds);
		replaceAll(preparerTypes, applied.preparerTypes);
	};

	const showQuickReports = (): void => {
		if (!fitsQuickReports(filter)) {
			applyFilter(UNFILTERED);
		}
		mode = "quick";
	};

	const showMadLib = (): void => {
		if (madLibChoicesOf(blanks, filter) === null) {
			applyFilter(UNFILTERED);
		}
		mode = "mad-lib";
	};

	const showAdvancedFilters = (): void => {
		mode = "advanced";
	};

	let hasReadUrl = $state(false);

	onMount(() => {
		const sectionNumbers = new Set(
			data.listings.map(({ policy }) => policy.section.number),
		);
		const initial = readReportFilter(page.url.searchParams, sectionNumbers);
		applyFilter(initial);
		mode = initialMode(initial, readReportMode(page.url.searchParams), blanks);
		hasReadUrl = true;
	});

	$effect(() => {
		if (!hasReadUrl) {
			return;
		}
		const params = writeReportFilter(filter);
		writeReportMode(params, mode);
		const query = params.toString();
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

{#if advanced}
	<div class="back">
		<BackToQuickReports onclick={showQuickReports} />
	</div>
	<ReportFilters
		listings={data.listings}
		{recipientCounts}
		{preparerCounts}
		bind:view
		bind:search
		bind:frequency
		bind:reportType
		bind:sectionNumber
		{recipientGroupIds}
		{preparerTypes}
		bind:height={filtersHeight}
		canReset={!isUnfiltered(filter)}
		onreset={() => applyFilter(UNFILTERED)}
	/>
{:else if mode === "mad-lib"}
	<div class="mad-lib-mode">
		<BackToQuickReports onclick={showQuickReports} />
		<section class="mad-lib" aria-label="Find reports">
			<MadLib
				{blanks}
				choices={madLibChoices}
				onchange={(choices) => applyFilter(madLibFilter(blanks, choices))}
			/>
		</section>
	</div>
{:else}
	<QuickReports
		listings={data.listings}
		selected={selectedQuickReport}
		onselect={applyFilter}
		onmadlib={showMadLib}
		onrefine={showAdvancedFilters}
	/>
{/if}

<ReportTable
	listings={shownListings}
	totalCount={data.listings.length}
	stickyTop={advanced ? filtersHeight : 0}
/>

<style>
	h1 {
		font-size: clamp(30px, 5vw, 44px);
		line-height: 1.08;
		margin: 0;
	}

	.mad-lib-mode {
		display: grid;
		justify-items: start;
		gap: 8px;
		padding-top: 12px;
	}

	.mad-lib {
		justify-self: stretch;
		padding: 8px 20px 12px;
		border: 1px solid var(--rule);
		border-radius: 6px;
		background: var(--sheet);
	}

	.back {
		justify-self: start;
		padding-top: 12px;
	}
</style>
