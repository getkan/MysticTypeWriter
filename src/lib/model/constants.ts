import type { DisappearanceMode } from "./types";

export const STORAGE_KEY = "mystictypewriter:typewriter-config";

type DisappearanceConfigEntry = {
	show: number;
	fade: number;
};

export const DISAPPEARANCE_CONFIG = {
	line: {
		show: 3,
		fade: 2,
	},
	sentence: {
		show: 4,
		fade: 2,
	},
	word: {
		show: 20,
		fade: 10,
	},
} satisfies Record<DisappearanceMode, DisappearanceConfigEntry>;
