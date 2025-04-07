
<script lang="ts">
	import { cssBlocksToCss, type MyCssBlock } from '$lib';
	import Prism from 'prismjs';

	interface Props {
		cssBlocks: MyCssBlock[]
	}
	let { cssBlocks }: Props = $props();
	const compiledCss: string = $derived.by(() => cssBlocksToCss(cssBlocks));
	const language = 'css';

	let preEl: HTMLElement;
	$effect(() => {
		if (preEl && Prism.languages[language]) {
			preEl.innerHTML = Prism.highlight(compiledCss, Prism.languages[language], language);
		}
	});
</script>

<pre bind:this={preEl} class="p-2 overflow-auto flex-1 text-sm whitespace-pre-wrap">{compiledCss}</pre>
