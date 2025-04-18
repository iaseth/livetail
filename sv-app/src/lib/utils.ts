import { browser } from "$app/environment";
import { filterXSS } from "xss";



export interface MyCssBlock {
	selectorText: string,
	statements: MyCssStatement[]
}

export interface MyCssStatement {
	prop: string,
	value: string
}

const options = {
	// let xss use default whitelist
	whiteList: undefined,

	// allow 'class' attribute on all tags
	onTagAttr: (tag: string, name: string, value: string) => {
		if (name === 'class') {
			// safely encode the value
			const safeValue = value.replace(/"/g, '&quot;');
			return ` class="${safeValue}"`;
		}
		// let xss handle all other attributes
	}
};
export const sanitize = (htmlInput: string) => filterXSS(htmlInput, options);

// Extract class names using DOMParser
export function extractClassNamesFromHTML(html: string): Set<string> {
	const classNames = new Set<string>();
	if (!browser) return classNames;

	const parser = new DOMParser();
	const doc = parser.parseFromString(html, 'text/html');

	function walk(node: Element): void {
		if (node.classList) {
			for (const cls of node.classList) {
				classNames.add(cls);
			}
		}
		for (const child of Array.from(node.children)) {
			walk(child);
		}
	}

	if (doc.body) walk(doc.body);
	return classNames;
}

export function getAllCssRules(): CSSRule[] {
	if (!browser) return [];

	const allCssRules: CSSRule[] = Array.from(document.styleSheets)
		.flatMap(sheet => {
			try {
				return Array.from(sheet.cssRules || []);
			} catch (e) {
				// Likely CORS issue
				return [];
			}
		});
	return allCssRules;
}

// Filter CSS rules for used class names
export function filterCssRulesByClassNames(rules: CSSRule[], classNames: Set<string>): MyCssBlock[] {
	if (rules.length === 0 || classNames.size === 0) return [];
	let cssBlocks: MyCssBlock[] = [];

	for (const rule of rules) {
		const styleRule = rule as CSSStyleRule;
		if (!styleRule.selectorText || styleRule.selectorText[0] !== '.') continue;

		for (const className of classNames) {
			if (styleRule.selectorText.includes(`.${className}`)) {
				const selectorText = styleRule.selectorText.trim();
				if (cssBlocks.findIndex(b => b.selectorText === selectorText) !== -1) {
					continue;
				}

				const statements: MyCssStatement[] = Array.from(styleRule.style)
					.map((prop) => ({
						prop,
						value: styleRule.style.getPropertyValue(prop).trim()
					}));
				const block: MyCssBlock = { selectorText, statements };
				cssBlocks.push(block);
				break;
			}
		}
	}

	cssBlocks.sort((a, b) => a.selectorText.localeCompare(b.selectorText));
	return cssBlocks;
}

export function cssBlocksToCss (cssBlocks: MyCssBlock[]): string {
	let result = '';
	for (const cssBlock of cssBlocks) {
		result += `${cssBlock.selectorText} {\n`
		for (const statement of cssBlock.statements) {
			result += `\t${statement.prop}: ${statement.value};\n`
		}
		result += "}\n\n"
	}
	return result;
}
