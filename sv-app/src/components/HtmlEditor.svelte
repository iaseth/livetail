<script lang="ts">
	import Prism from 'prismjs';
	import 'prismjs/components/prism-markup';
	import 'prismjs/themes/prism-tomorrow.css';

	interface Props {
		htmlInput: string
	};
	let { htmlInput = $bindable() }: Props = $props();
	const language = 'markup';
  
	let textareaEl: HTMLTextAreaElement;
	let preEl: HTMLElement;
  
	// Highlight input whenever it changes
	$effect(() => {
		if (preEl && Prism.languages[language]) {
			preEl.innerHTML = Prism.highlight(htmlInput, Prism.languages[language], language);
		}
	});
  
	async function handleKeydown(e: KeyboardEvent) {
	  if (e.key === 'Tab') {
		e.preventDefault();
		const start = textareaEl.selectionStart;
		const end = textareaEl.selectionEnd;
		htmlInput = htmlInput.slice(0, start) + '\t' + htmlInput.slice(end);
		await Promise.resolve(); // wait a tick
		textareaEl.selectionStart = textareaEl.selectionEnd = start + 1;
	  }
	}

	const commonClasses = "h-full w-full p-2 leading-relaxed text-sm";
  </script>
  
  <section class="font-mono w-full h-full overflow-y-auto">
	<section class="relative w-full h-full">
		<!-- Syntax-highlighted layer -->
			<pre bind:this={preEl}
			class="absolute {commonClasses} inset-0 z-0 whitespace-pre-wrap break-words text-white pointer-events-none"
		></pre>

		<!-- Input layer -->
		<textarea
			bind:this={textareaEl}
			bind:value={htmlInput}
			onkeydown={handleKeydown}
			spellcheck={false}
			class="relative z-10 {commonClasses} bg-transparent text-transparent caret-white resize-none focus:outline-none"
		></textarea>
	</section>
  </section>
