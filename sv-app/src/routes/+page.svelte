<script lang="ts">
	import { extractClassNamesFromHTML, filterCssRulesByClassNames, getAllCssRules, getLocalStorage, sanitize, setLocalStorage, type MyCssBlock } from "$lib";
	import { onMount } from "svelte";
	import CssBlock from "../components/CssBlock.svelte";
	import HtmlEditor from "../components/HtmlEditor.svelte";
	import 'prismjs/themes/prism-tomorrow.css';

	// User HTML input
	let htmlInput = $state('');
	let mounted = $state(false);

	// Sanitize whenever htmlInput changes
	let safeHtml = $derived.by(() => {
		const sanitized = sanitize(htmlInput);
		if (mounted) {
			setLocalStorage(htmlInput);
		}
		setTimeout(extractCss, 1000);
		return sanitized;
	});

	let cssBlocks: MyCssBlock[] = $state([])
	function extractCss () {
		const classNames = extractClassNamesFromHTML(htmlInput);
		const allCssRules: CSSRule[] = getAllCssRules();
		cssBlocks = filterCssRulesByClassNames(allCssRules, classNames);
	}

	onMount(() => {
		htmlInput = getLocalStorage();
		mounted = true;
	});
</script>

<svelte:head>
	<title>Livetail</title>
	<script src="https://cdn.tailwindcss.com"></script>
</svelte:head>

<div class="grid grid-cols-1 md:grid-cols-3 box-border bg-base-200 text-base-content h-screen">
	<!-- Rendered HTML -->
	<div class="flex flex-col max-h-screen">
		<h2 class="text-lg font-bold mb-2" hidden>Rendered</h2>
		<div class="flex-1 p-2 overflow-auto">{@html safeHtml}</div>
	</div>

	<!-- Editor -->
	<div class="flex flex-col max-h-screen bg-base-300">
		<h2 class="text-lg font-bold mb-2" hidden>Editor</h2>
		<HtmlEditor bind:htmlInput />
	</div>

	<!-- CSS Styles -->
	<div class="flex flex-col max-h-screen">
		<h2 class="text-lg font-bold mb-2" hidden>CSS Styles</h2>
		<CssBlock {cssBlocks} />
	</div>
</div>
