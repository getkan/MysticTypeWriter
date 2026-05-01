import { DISAPPEARANCE_MODES } from "./types";
import type { DisappearanceMode, TypewriterConfig } from "./types";

export class TypewriterConfigInput {
	disappearanceMode: DisappearanceMode;
	strictEditing: boolean;
	timeoutEnabled: boolean;
	animationsEnabled: boolean;
	soundEffectsEnabled: boolean;

	constructor(input: Partial<TypewriterConfig> = {}) {
		this.disappearanceMode = input.disappearanceMode ?? "line";
		this.strictEditing = input.strictEditing ?? false;
		this.timeoutEnabled = input.timeoutEnabled ?? true;
		this.animationsEnabled = input.animationsEnabled ?? true;
		this.soundEffectsEnabled = input.soundEffectsEnabled ?? true;
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
}
