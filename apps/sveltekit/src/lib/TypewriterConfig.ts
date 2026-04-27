export type DisappearanceMode = "line" | "sentence" | "page" | "timeout";

export type TypewriterConfigInput = {
  disappearanceMode: DisappearanceMode;
  strictEditing: boolean;
  animationsEnabled: boolean;
  soundEffectsEnabled: boolean;
};

export class TypewriterConfig {
  disappearanceMode: DisappearanceMode;
  strictEditing: boolean;
  animationsEnabled: boolean;
  soundEffectsEnabled: boolean;

  constructor(input: Partial<TypewriterConfigInput> = {}) {
    this.disappearanceMode = input.disappearanceMode ?? "sentence";
    this.strictEditing = input.strictEditing ?? true;
    this.animationsEnabled = input.animationsEnabled ?? true;
    this.soundEffectsEnabled = input.soundEffectsEnabled ?? false;

    this.validate();
  }

  validate(): void {
    if (!["line", "sentence", "page", "timeout"].includes(this.disappearanceMode)) {
      throw new Error("disappearanceMode must be one of: line, sentence, page, timeout");
    }
  }

  with(changes: Partial<TypewriterConfigInput>): TypewriterConfig {
    return new TypewriterConfig({
      disappearanceMode: changes.disappearanceMode ?? this.disappearanceMode,
      strictEditing: changes.strictEditing ?? this.strictEditing,
      animationsEnabled: changes.animationsEnabled ?? this.animationsEnabled,
      soundEffectsEnabled: changes.soundEffectsEnabled ?? this.soundEffectsEnabled
    });
  }

  toJSON(): TypewriterConfigInput {
    return {
      disappearanceMode: this.disappearanceMode,
      strictEditing: this.strictEditing,
      animationsEnabled: this.animationsEnabled,
      soundEffectsEnabled: this.soundEffectsEnabled
    };
  }
}
