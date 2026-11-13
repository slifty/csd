<script lang="ts">
	import MadLibBlank from "./MadLibBlank.svelte";
	import type {
		ApplyMadLibChoices,
		MadLibBlank as Blank,
		MadLibBlankId,
		MadLibChoices,
	} from "#lib/mad-lib.ts";

	interface Props {
		blanks: readonly Blank[];
		choices: MadLibChoices;
		onchange: ApplyMadLibChoices;
		canErase: boolean;
		onerase: () => void;
	}

	const { blanks, choices, onchange, canErase, onerase }: Props = $props();

	const eraseIfAble = (): void => {
		if (canErase) {
			onerase();
		}
	};

	const blankFor = (id: MadLibBlankId): Blank => {
		const blank = blanks.find((candidate) => candidate.id === id);
		if (blank === undefined) {
			throw new Error(`No mad lib blank "${id}"`);
		}
		return blank;
	};
</script>

{#snippet fill(id: MadLibBlankId)}
	<MadLibBlank
		blank={blankFor(id)}
		selectedId={choices[id]}
		onselect={(optionId) => onchange({ ...choices, [id]: optionId })}
	/>
{/snippet}

<div class="mad-lib">
	<p class="sentence">
		<span class="clause">I want to see {@render fill("frequency")} reports</span
		>
		<span class="clause">prepared by {@render fill("preparer")},</span>
		<span class="clause">for {@render fill("recipient")},</span>
		<span class="clause">related to {@render fill("section")}.</span>
	</p>
	<button
		type="button"
		class="erase"
		aria-label="Erase the blanks"
		title="Erase the blanks"
		aria-disabled={!canErase}
		onclick={eraseIfAble}
	>
		<svg
			viewBox="0 0 16 16"
			width="16"
			height="16"
			aria-hidden="true"
			fill="none"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M5.5 3h8A1.5 1.5 0 0 1 15 4.5v7a1.5 1.5 0 0 1-1.5 1.5h-8L1 8z" />
			<path d="m8 6 4 4m0-4-4 4" />
		</svg>
	</button>
</div>

<style>
	.mad-lib {
		display: flex;
		border: 1px solid var(--rule);
		border-radius: 6px;
		background: var(--sheet);
	}

	.erase {
		flex: none;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		padding: 0;
		border: 0;
		border-left: 1px solid var(--rule);
		border-radius: 0 5px 5px 0;
		background: var(--paper);
		color: var(--ink-2);
		cursor: pointer;
	}

	.erase:hover:not([aria-disabled="true"]) {
		background: var(--accent-soft);
		color: var(--accent);
	}

	.erase[aria-disabled="true"] {
		cursor: default;
	}

	.erase[aria-disabled="true"] svg {
		opacity: 0.4;
	}

	.sentence {
		flex: 1;
		margin: 0;
		padding: 8px 20px 12px;
		font-size: clamp(17px, 2.2vw, 20px);
		line-height: 2.6;
	}

	.clause {
		display: inline-block;
	}

	@media (max-width: 640px) {
		.sentence {
			font-size: 15px;
			line-height: 2.6;
		}
	}
</style>
