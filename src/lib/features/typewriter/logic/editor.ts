export const focusEditor = (inputRef: HTMLElement | null) => {
	inputRef?.focus();
	const sel = window.getSelection();
	if (inputRef && sel) {
		const range = document.createRange();
		range.selectNodeContents(inputRef);
		range.collapse(false);
		sel.removeAllRanges();
		sel.addRange(range);
	}
};

export const insertNewline = (inputRef: HTMLElement | null) => {
	if (!inputRef) return;
	const sel = window.getSelection();
	if (!sel || sel.rangeCount === 0) return;

	// Manual Range/text-node insertion leaves the caret unable to land after a
	// trailing newline, causing subsequent typed characters to merge before it.
	// execCommand replicates native Enter handling and keeps the caret in sync.
	document.execCommand("insertLineBreak");
};

// innerText drops trailing line breaks entirely, so a fresh newline only shows
// up after the next keystroke. Reading the nodes keeps it, minus the trailing
// <br> browsers add to keep the empty last line selectable.
export const readEditorText = (inputRef: HTMLElement | null): string => {
	if (!inputRef) return "";

	let text = "";
	const walk = (node: Node) => {
		for (const child of node.childNodes) {
			if (child.nodeType === Node.TEXT_NODE) {
				text += child.textContent ?? "";
			} else if (child instanceof HTMLBRElement) {
				text += "\n";
			} else if (child instanceof HTMLElement) {
				if (text.length > 0 && !text.endsWith("\n")) text += "\n";
				walk(child);
			}
		}
	};
	walk(inputRef);

	return text.endsWith("\n") ? text.slice(0, -1) : text;
};
