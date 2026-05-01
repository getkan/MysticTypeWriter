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
	const sel = window.getSelection();
	if (!sel || sel.rangeCount === 0) return;

	const range = sel.getRangeAt(0);
	range.deleteContents();

	const newline = document.createTextNode("\n");
	range.insertNode(newline);
	range.setStartAfter(newline);
	range.collapse(true);
	sel.removeAllRanges();
	sel.addRange(range);
};
