<script lang="ts">
	import { extractClassNamesFromHTML, filterCssRulesByClassNames, sanitize } from "$lib";

	// User HTML input
	let htmlInput = $state(`<div class="p-6 bg-primary text-primary-content rounded-box">
	Hello from DaisyUI!
</div>`);

	// Sanitize whenever htmlInput changes
	let safeHtml = $derived.by(() => {
		// const sanitized = sanitize(htmlInput);
		// setTimeout(extractCss, 1000);
		return htmlInput;
	});

	let compiledCss = $state('')
	function extractCss () {
		const classNames = extractClassNamesFromHTML(htmlInput);
		const allCssRules: CSSRule[] = Array.from(document.styleSheets)
			.flatMap(sheet => {
				try {
					return Array.from(sheet.cssRules || []);
				} catch (e) {
					// Likely CORS issue
					return [];
				}
			});

		compiledCss = filterCssRulesByClassNames(allCssRules, classNames);
	}
</script>

<svelte:head>
	<title>Livetail</title>
	<script src="https://cdn.tailwindcss.com"></script>
</svelte:head>

<div class="grid grid-cols-1 md:grid-cols-3 gap-x-2 gap-y-4 h-screen p-4 box-border bg-base-200 text-base-content min-h-screen">
	<!-- Rendered HTML -->
	<div class="flex flex-col">
		<h2 class="text-lg font-bold mb-2">Rendered</h2>
		<div class="flex-1 border rounded-box p-4 overflow-auto">{@html safeHtml}</div>
	</div>

	<!-- Editor -->
	<div class="flex flex-col">
		<h2 class="text-lg font-bold mb-2">Editor</h2>
		<textarea
			class="textarea textarea-bordered flex-1 w-full resize-none font-mono"
			bind:value={htmlInput}
		></textarea>
	</div>

	<!-- CSS Styles -->
	<div class="flex flex-col overflow-y-scroll">
		<h2 class="text-lg font-bold mb-2">CSS Styles</h2>
		<pre class="bg-base-100 border rounded-box p-2 overflow-auto flex-1 text-xs whitespace-pre-wrap">{compiledCss}</pre>
	</div>
</div>
