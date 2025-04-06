import DOMPurify from 'dompurify';



export const sanitize = (html: string) => DOMPurify.sanitize(html);

// Extract class names using DOMParser
export function extractClassNamesFromHTML(html: string): Set<string> {
	const classNames = new Set<string>();
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

// Filter CSS rules for used class names
export function filterCssRulesByClassNames(rules: CSSRule[], classNames: Set<string>): string {
	let result = '';

	for (const rule of rules) {
		if (rule.type === CSSRule.STYLE_RULE) {
			const styleRule = rule as CSSStyleRule;
			for (const cls of classNames) {
				if (styleRule.selectorText.includes(`.${cls}`)) {
					result += `${styleRule.cssText}\n`;
					break;
				}
			}
		}
	}

	return result || '/* No matching CSS */';
}
