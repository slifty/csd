<script lang="ts">
	import { SOURCE_CODE_URL } from "../source-code.ts";

	const { title }: { title: string } = $props();
</script>

<header>
	<h1>{title}</h1>
	<a
		class="source-code"
		href={SOURCE_CODE_URL}
		rel="external"
		aria-label="Source code on GitHub"
	>
		<svg viewBox="0 0 16 16" width="20" height="20" aria-hidden="true">
			<path
				fill="currentColor"
				d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"
			/>
		</svg>
	</a>
</header>

<style>
	header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 24px;
		margin-bottom: calc(-1 * var(--section-gap) / 2);
	}

	h1 {
		font-family: var(--display);
		font-weight: 400;
		font-size: clamp(28px, 4.5vw, 38px);
		line-height: 1.15;
		margin: 0;
	}

	.source-code {
		flex: none;
		display: flex;
		margin-top: 10px;
		color: var(--ink-2);
		opacity: 0.5;
		transition: opacity 0.15s;
	}

	.source-code:hover,
	.source-code:focus-visible {
		opacity: 1;
	}

	@media (max-width: 960px) {
		.source-code {
			display: none;
		}
	}
</style>
