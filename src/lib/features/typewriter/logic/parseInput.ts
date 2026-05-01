import { DISAPPEARANCE_CONFIG } from "$lib/model/constants";
import type { DisappearanceMode } from "$lib/model/types";

export type ParsedChunk = {
	text: string;
	opacity: number;
};

export function parseInput(
	input: string,
	disappearanceMode: DisappearanceMode | undefined,
	lineRef: HTMLDivElement | null,
): ParsedChunk[] {
	if (!disappearanceMode) return [{ text: input, opacity: 100 }];

	const { show, fade } = DISAPPEARANCE_CONFIG[disappearanceMode];
	let matchArray: string[] = [];

	if (disappearanceMode === "line") {
		if (!lineRef) return [{ text: input, opacity: 100 }];

		lineRef.innerHTML = input.replace(
			/\S+\s*/g,
			(match) => `<span>${match}</span>`,
		);
		const spans = Array.from(lineRef.querySelectorAll("span"));
		if (spans.length === 0) return [{ text: input, opacity: 100 }];

		let top: number | null = null;
		for (const span of spans) {
			const roundedTop = Math.round(span.getBoundingClientRect().top);
			if (top === null || roundedTop > top) {
				matchArray.push("");
				top = roundedTop;
			}
			matchArray[matchArray.length - 1] += span.textContent;
		}
	} else {
		const regexes: Record<string, RegExp> = {
			sentence: /[^.!?]*[.!?]*/g,
			word: /\S+\s*/g,
		};
		const regex = regexes[disappearanceMode] ?? regexes["word"];
		matchArray = input.match(regex)?.filter(Boolean) ?? [];
	}

	const matchArrayLn = matchArray.length;
	const hideUntil = matchArrayLn - (show + fade);
	const fadeUntil = matchArrayLn - show;
	let fadeCount = 0;

	return matchArray.flatMap((item, index) => {
		if (hideUntil && index < hideUntil) return { text: item, opacity: 0 };
		if (fadeUntil && index < fadeUntil) {
			if (fade > 1) {
				fadeCount += 1;
				const opacity = Math.max(
					0,
					Math.min(100, Math.round((100 / (fade + 1)) * fadeCount)),
				);
				return { text: item, opacity };
			}
			return { text: item, opacity: 50 };
		}
		return { text: item, opacity: 100 };
	});
}
