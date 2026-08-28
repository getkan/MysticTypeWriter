import type { DisappearanceMode } from "$lib/model/types";
import {
	applyDisappearance,
	splitByMode,
	type ParsedChunk,
} from "./parseInput";

export type StyledSegment = {
	text: string;
	opacity: number;
	blur: number;
};

// Lines fade out over this many line heights as they approach the top edge.
const TOP_FADE_LINES = 3;

export type CanvasMetrics = {
	font: string;
	fontSize: number;
	lineHeight: number;
	charWidth: number;
	charsPerLine: number;
	color: string;
};

export function measureCanvas(
	ctx: CanvasRenderingContext2D,
	element: HTMLElement,
	width: number,
): CanvasMetrics {
	const style = getComputedStyle(element);
	const fontSize = parseFloat(style.fontSize) || 16;
	const lineHeight = parseFloat(style.lineHeight) || fontSize * 1.5;
	const font = `${style.fontStyle} ${style.fontWeight} ${fontSize}px ${style.fontFamily}`;

	ctx.font = font;
	const charWidth = ctx.measureText("M").width || fontSize * 0.6;

	return {
		font,
		fontSize,
		lineHeight,
		charWidth,
		charsPerLine: Math.max(1, Math.floor(width / charWidth)),
		color: style.color,
	};
}

// Wraps monospaced text so that the concatenation of all lines equals the input
// minus the paragraph newlines, which keeps character indices addressable.
export function wrapLines(input: string, charsPerLine: number): string[] {
	const lines: string[] = [];

	for (const paragraph of input.split("\n")) {
		const tokens = paragraph.match(/\S+\s*/g) ?? [];
		if (tokens.length === 0) {
			lines.push(paragraph);
			continue;
		}

		let current = "";
		for (const token of tokens) {
			const trimmed = token.trimEnd();
			if (
				current.length > 0 &&
				current.length + trimmed.length > charsPerLine
			) {
				lines.push(current);
				current = token;
			} else {
				current += token;
			}
			// Only break mid-token when the visible text itself overflows, so that
			// trailing spaces never push characters onto the next line.
			while (current.trimEnd().length > charsPerLine) {
				lines.push(current.slice(0, charsPerLine));
				current = current.slice(charsPerLine);
			}
		}
		lines.push(current);
	}

	return lines;
}

type CharStyle = { opacity: number; blur: number };

function charStyles(input: string, chunks: ParsedChunk[]): CharStyle[] {
	const styles: CharStyle[] = new Array(input.length);
	const plain: CharStyle = { opacity: 100, blur: 0 };
	styles.fill(plain);

	let cursor = 0;
	for (const chunk of chunks) {
		const start = input.indexOf(chunk.text, cursor);
		if (start === -1) continue;
		const style: CharStyle = {
			opacity: chunk.opacity,
			blur: chunk.blur ?? 0,
		};
		for (let i = start; i < start + chunk.text.length; i++) styles[i] = style;
		cursor = start + chunk.text.length;
	}

	return styles;
}

export function layoutLines(
	input: string,
	disappearanceMode: DisappearanceMode | undefined,
	charsPerLine: number,
): StyledSegment[][] {
	const lines = wrapLines(input, charsPerLine);

	if (!disappearanceMode) {
		return lines.map((text) => [{ text, opacity: 100, blur: 0 }]);
	}

	if (disappearanceMode === "line") {
		return applyDisappearance(lines, "line").map((chunk) => [
			{ text: chunk.text, opacity: chunk.opacity, blur: chunk.blur ?? 0 },
		]);
	}

	const chunks = applyDisappearance(
		splitByMode(input, disappearanceMode),
		disappearanceMode,
	);
	const styles = charStyles(input, chunks);

	let index = 0;
	return lines.map((line) => {
		const segments: StyledSegment[] = [];
		for (const char of line) {
			const style = styles[index] ?? { opacity: 100, blur: 0 };
			index += 1;
			const last = segments[segments.length - 1];
			if (last && last.opacity === style.opacity && last.blur === style.blur) {
				last.text += char;
			} else {
				segments.push({ text: char, opacity: style.opacity, blur: style.blur });
			}
		}
		if (input[index] === "\n") index += 1;
		return segments;
	});
}

export function drawTypewriter(
	ctx: CanvasRenderingContext2D,
	options: {
		width: number;
		height: number;
		lines: StyledSegment[][];
		metrics: CanvasMetrics;
		cursorVisible: boolean;
	},
) {
	const { width, height, lines, metrics, cursorVisible } = options;

	ctx.clearRect(0, 0, width, height);
	ctx.font = metrics.font;
	ctx.textBaseline = "alphabetic";
	ctx.fillStyle = metrics.color;

	const descent = metrics.fontSize * 0.25;
	const bottomBaseline = height - descent;
	const fadeDistance = metrics.lineHeight * TOP_FADE_LINES;

	for (let i = lines.length - 1; i >= 0; i--) {
		const y = bottomBaseline - (lines.length - 1 - i) * metrics.lineHeight;
		const edgeFade = Math.min(1, Math.max(0, y / fadeDistance));
		if (edgeFade === 0) break;

		let column = 0;
		for (const segment of lines[i]) {
			if (segment.opacity > 0) {
				ctx.globalAlpha = (segment.opacity / 100) * edgeFade;
				ctx.filter = segment.blur > 0 ? `blur(${segment.blur}px)` : "none";
				ctx.fillText(segment.text, column * metrics.charWidth, y);
			}
			column += segment.text.length;
		}
	}

	ctx.globalAlpha = 1;
	ctx.filter = "none";

	if (cursorVisible) {
		const lastLine = lines[lines.length - 1] ?? [];
		const columns = lastLine.reduce(
			(total, segment) => total + segment.text.length,
			0,
		);
		const cursorColumn = Math.min(columns, metrics.charsPerLine - 1);
		ctx.fillRect(
			cursorColumn * metrics.charWidth + metrics.charWidth * 0.1,
			bottomBaseline - metrics.fontSize * 0.85,
			Math.max(2, metrics.charWidth * 0.1),
			metrics.fontSize,
		);
	}
}
