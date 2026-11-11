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
	}

	const { blanks, choices, onchange }: Props = $props();

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

<p class="sentence">
	<span class="clause">I want to see {@render fill("frequency")} reports</span>
	<span class="clause">prepared by {@render fill("preparer")},</span>
	<span class="clause">for {@render fill("recipient")},</span>
	<span class="clause">related to {@render fill("section")}.</span>
</p>

<style>
	.sentence {
		margin: 0;
		font-size: clamp(17px, 2.2vw, 20px);
		line-height: 2.6;
	}

	.clause {
		display: inline-block;
	}

	@media (max-width: 640px) {
		.sentence {
			font-size: 15px;
			line-height: 2.4;
		}
	}
</style>
