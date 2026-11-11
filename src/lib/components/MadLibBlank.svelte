<script lang="ts">
	import { matchingOptions } from "#lib/mad-lib.ts";
	import type {
		MadLibBlank,
		MadLibOption,
		SelectMadLibOption,
	} from "#lib/mad-lib.ts";

	interface Props {
		blank: MadLibBlank;
		selectedId: string | undefined;
		onselect: SelectMadLibOption;
	}

	const { blank, selectedId, onselect }: Props = $props();

	const ANY_OPTION_ID = "";
	const NO_ACTIVE_INDEX = -1;
	const NEXT = 1;
	const PREVIOUS = -1;

	let open = $state(false);
	let query = $state("");
	let activeIndex = $state(NO_ACTIVE_INDEX);
	let input: HTMLInputElement | undefined = $state();

	const anyOption: MadLibOption = $derived({
		id: ANY_OPTION_ID,
		label: blank.anyLabel,
		patch: {},
	});
	const selected = $derived(
		blank.options.find(({ id }) => id === selectedId) ?? null,
	);
	const shownOptions = $derived([
		...(query.trim() === "" ? [anyOption] : []),
		...matchingOptions(blank.options, query),
	]);
	const shownLabel = $derived(selected?.label ?? blank.anyLabel);
	const inputValue = $derived(open ? query : shownLabel);
	const sizerLabels = $derived([
		blank.anyLabel,
		...blank.options.map(({ label }) => label),
		inputValue,
	]);
	const activeOption = $derived(shownOptions[activeIndex] ?? null);
	const listboxId = $derived(`mad-lib-${blank.id}-options`);
	const optionId = (index: number): string => `${listboxId}-${index}`;

	const openList = (): void => {
		query = "";
		activeIndex = NO_ACTIVE_INDEX;
		open = true;
	};

	const choose = (option: MadLibOption): void => {
		onselect(option.id === ANY_OPTION_ID ? undefined : option.id);
		open = false;
		input?.blur();
	};

	const optionForEnter = (): MadLibOption | null =>
		activeOption ?? (query.trim() === "" ? null : (shownOptions[0] ?? null));

	const moveActive = (step: number): void => {
		if (!open) {
			openList();
		}
		const { length } = shownOptions;
		if (length > 0) {
			activeIndex = (activeIndex + step + length) % length;
		}
	};

	const onkeydown = (event: KeyboardEvent): void => {
		switch (event.key) {
			case "ArrowDown":
				event.preventDefault();
				moveActive(NEXT);
				break;
			case "ArrowUp":
				event.preventDefault();
				moveActive(PREVIOUS);
				break;
			case "Enter": {
				if (!open) {
					break;
				}
				event.preventDefault();
				const option = optionForEnter();
				if (option === null) {
					open = false;
				} else {
					choose(option);
				}
				break;
			}
			case "Escape":
				open = false;
				break;
		}
	};
</script>

<span class="blank">
	<span class="field">
		{#each sizerLabels as label, index (index)}
			<span class="sizer" aria-hidden="true">{label}</span>
		{/each}
		<input
			type="text"
			role="combobox"
			aria-label={blank.term}
			aria-expanded={open}
			aria-controls={listboxId}
			aria-autocomplete="list"
			aria-activedescendant={open && activeOption !== null
				? optionId(activeIndex)
				: undefined}
			autocomplete="off"
			size={1}
			placeholder={shownLabel}
			value={inputValue}
			oninput={(event) => {
				query = event.currentTarget.value;
				activeIndex = 0;
				open = true;
			}}
			bind:this={input}
			onfocus={openList}
			onclick={() => {
				if (!open) {
					openList();
				}
			}}
			onblur={() => {
				open = false;
			}}
			{onkeydown}
		/>
	</span>
	<span class="term">{blank.term}</span>
	{#if open}
		<ul id={listboxId} role="listbox" aria-label={blank.term}>
			{#each shownOptions as option, index (option.id)}
				<li
					id={optionId(index)}
					role="option"
					aria-selected={option.id === (selectedId ?? ANY_OPTION_ID)}
					class:active={index === activeIndex}
					onmousedown={(event) => {
						event.preventDefault();
						choose(option);
					}}
					onmouseenter={() => {
						activeIndex = index;
					}}
				>
					{option.label}
				</li>
			{:else}
				<li class="empty">No matches</li>
			{/each}
		</ul>
	{/if}
</span>

<style>
	.blank {
		position: relative;
		display: inline-grid;
		justify-items: center;
		vertical-align: baseline;
		line-height: 1.25;
		margin-inline: 2px;
	}

	.field {
		display: inline-grid;
	}

	.sizer,
	input {
		grid-area: 1 / 1;
		font: inherit;
		font-family: var(--handwritten);
		font-size: 1.2em;
		font-weight: 400;
		--bottom-padding: 3px;
		padding: 0 4px var(--bottom-padding);
		min-width: 3ch;
		line-height: inherit;
	}

	.sizer {
		visibility: hidden;
		white-space: pre;
	}

	input {
		--rule-thickness: 2px;
		--baseline-above-content: 0.32em;
		--descender-overlap: 0.08em;
		width: 100%;
		min-width: 0;
		border: 0;
		background: linear-gradient(var(--accent), var(--accent)) left 0 bottom
			calc(
				var(--bottom-padding) + var(--baseline-above-content) -
					var(--descender-overlap) - var(--rule-thickness)
			) /
			100% var(--rule-thickness) no-repeat;
		color: var(--mark);
		text-align: center;
	}

	input::placeholder {
		color: var(--mark);
		opacity: 0.6;
	}

	input:focus {
		outline: none;
		--rule-thickness: 3px;
	}

	.term {
		font-size: 10px;
		line-height: 1.3;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-2);
	}

	ul {
		position: absolute;
		top: 100%;
		left: 0;
		z-index: 10;
		min-width: max(100%, 220px);
		max-height: 280px;
		overflow-y: auto;
		margin: 4px 0 0;
		padding: 4px;
		list-style: none;
		border: 1px solid var(--rule);
		border-radius: 6px;
		background: var(--sheet);
		box-shadow: 0 6px 20px rgb(0 0 0 / 0.12);
		font-size: 15px;
		line-height: 1.4;
		text-align: left;
	}

	li {
		padding: 6px 10px;
		border-radius: 4px;
		cursor: pointer;
		white-space: nowrap;
	}

	li.active {
		background: var(--mark-soft);
	}

	li[aria-selected="true"] {
		color: var(--mark);
	}

	li.empty {
		color: var(--ink-2);
		cursor: default;
	}
</style>
