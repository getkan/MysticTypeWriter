export const DISAPPEARANCE_MODES = ["line", "sentence", "word"] as const;

export type DisappearanceMode = (typeof DISAPPEARANCE_MODES)[number];

export type TypewriterConfig = {
	disappearanceMode: DisappearanceMode;
	strictEditing: boolean;
	timeoutEnabled: boolean;
	animationsEnabled: boolean;
	soundEffectsEnabled: boolean;
};
