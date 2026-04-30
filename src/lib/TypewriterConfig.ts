export const STORAGE_KEY = "forwardtothevoid:typewriter-config";

export const DISAPPEARANCE_MODES = ["line", "sentence", "word"] as const;
export type DisappearanceMode = (typeof DISAPPEARANCE_MODES)[number];

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

export type TypewriterConfig = {
	disappearanceMode: DisappearanceMode;
	strictEditing: boolean;
	timeoutEnabled: boolean;
	animationsEnabled: boolean;
	soundEffectsEnabled: boolean;
};

export class TypewriterConfigInput {
	disappearanceMode: DisappearanceMode;
	strictEditing: boolean;
	timeoutEnabled: boolean;
	animationsEnabled: boolean;
	soundEffectsEnabled: boolean;

	constructor(input: Partial<TypewriterConfig> = {}) {
		this.disappearanceMode = input.disappearanceMode ?? "sentence";
		this.strictEditing = input.strictEditing ?? true;
		this.timeoutEnabled = input.timeoutEnabled ?? true;
		this.animationsEnabled = input.animationsEnabled ?? true;
		this.soundEffectsEnabled = input.soundEffectsEnabled ?? false;

		this.validate();
	}

	validate(): boolean {
		if (!DISAPPEARANCE_MODES.includes(this.disappearanceMode)) {
			throw new Error(`Invalid disappearance mode: ${this.disappearanceMode}`);
		}

		return true;
	}

	with(changes: Partial<TypewriterConfig>): TypewriterConfigInput {
		return new TypewriterConfigInput({
			...this.toTypewriterConfig(),
			...changes,
		});
	}

	toTypewriterConfig(): TypewriterConfig {
		return {
			disappearanceMode: this.disappearanceMode,
			strictEditing: this.strictEditing,
			timeoutEnabled: this.timeoutEnabled,
			animationsEnabled: this.animationsEnabled,
			soundEffectsEnabled: this.soundEffectsEnabled,
		};
	}

	toJson(): string {
		return JSON.stringify(this.toTypewriterConfig());
	}
}
