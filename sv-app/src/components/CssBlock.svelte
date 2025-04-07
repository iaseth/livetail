
<script lang="ts">
	import Prism from 'prismjs';

	interface Props {
		compiledCss: string
	}
	let { compiledCss }: Props = $props();
	const language = 'css';

	let preEl: HTMLElement;
	$effect(() => {
		if (preEl && Prism.languages[language]) {
			preEl.innerHTML = Prism.highlight(compiledCss, Prism.languages[language], language);
		}
	});
</script>

<pre bind:this={preEl} class="p-2 overflow-auto flex-1 text-sm whitespace-pre-wrap">{compiledCss}</pre>
