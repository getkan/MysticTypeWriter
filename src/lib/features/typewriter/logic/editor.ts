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
