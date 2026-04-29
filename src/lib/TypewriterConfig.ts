export const STORAGE_KEY = "forwardtothevoid:typewriter-config";

export const DISAPPEARANCE_MODES = ["line", "sentence", "word"] as const;
export type DisappearanceMode = typeof DISAPPEARANCE_MODES[number];

type DisappearanceConfigEntry = {
  show: number;
  fade: number;
};

export const DISAPPEARANCE_CONFIG = {
  line: {
      show: 15,
      fade: 3
  },
  sentence: {
      show: 4,
      fade: 2
  },
  word: {
      show: 60,
      fade: 20
  }
} satisfies Record<DisappearanceMode, DisappearanceConfigEntry>;

export type TypewriterConfig = {
  disappearanceMode: DisappearanceMode;
  strictEditing: boolean;
  animationsEnabled: boolean;
  soundEffectsEnabled: boolean;
};

export class TypewriterConfigInput {
  disappearanceMode: DisappearanceMode;
  strictEditing: boolean;
  animationsEnabled: boolean;
  soundEffectsEnabled: boolean;

  constructor(input: Partial<TypewriterConfig> = {}) {
    this.disappearanceMode = input.disappearanceMode ?? "sentence";
    this.strictEditing = input.strictEditing ?? true;
    this.animationsEnabled = input.animationsEnabled ?? true;
    this.soundEffectsEnabled = input.soundEffectsEnabled ?? false;

    this.validate();
  }

  validate(): boolean {
    return DISAPPEARANCE_MODES.includes(this.disappearanceMode)
  }

  with(changes: Partial<TypewriterConfig>): TypewriterConfigInput {
    return new TypewriterConfigInput({
      disappearanceMode: changes.disappearanceMode ?? this.disappearanceMode,
      strictEditing: changes.strictEditing ?? this.strictEditing,
      animationsEnabled: changes.animationsEnabled ?? this.animationsEnabled,
      soundEffectsEnabled: changes.soundEffectsEnabled ?? this.soundEffectsEnabled
    });
  }

  toTypewriterConfig(): TypewriterConfig {
    return {
      disappearanceMode: this.disappearanceMode,
      strictEditing: this.strictEditing,
      animationsEnabled: this.animationsEnabled,
      soundEffectsEnabled: this.soundEffectsEnabled
    };
  }

  toJson(): string {
    return JSON.stringify(this.toTypewriterConfig());
  }
}