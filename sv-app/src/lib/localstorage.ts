import { browser } from "$app/environment";



const LOCAL_STORAGE_KEY = 'livetail';

export const DEFAULT_HTML = `<div class="p-6 bg-red-500 text-white rounded-md">\n\tHello from LiveTail!\n</div>`;

export function getLocalStorage (): string {
	if (browser) {
		return localStorage.getItem(LOCAL_STORAGE_KEY) || DEFAULT_HTML;
	}
	return DEFAULT_HTML;
}

export function setLocalStorage (html: string) {
	if (browser) localStorage.setItem(LOCAL_STORAGE_KEY, html);
}
