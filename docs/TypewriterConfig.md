# TypewriterConfig — UML Diagram

```mermaid
classDiagram
    class DisappearanceMode {
        <<enumeration>>
        line
        sentence
        page
        timeout
    }

    class TypewriterConfigInput {
        <<type>>
        +disappearanceMode: DisappearanceMode
        +strictEditing: boolean
        +animationsEnabled: boolean
        +soundEffectsEnabled: boolean
    }

    class TypewriterConfig {
        +disappearanceMode: DisappearanceMode
        +strictEditing: boolean
        +animationsEnabled: boolean
        +soundEffectsEnabled: boolean
        +constructor(input: Partial~TypewriterConfigInput~)
        +validate() void
        +with(changes: Partial~TypewriterConfigInput~) TypewriterConfig
        +toJSON() TypewriterConfigInput
    }

    TypewriterConfig --> DisappearanceMode : uses
    TypewriterConfig ..> TypewriterConfigInput : constructs from / serializes to
    TypewriterConfigInput --> DisappearanceMode : uses
```

## Defaults

| Field | Default |
|---|---|
| `disappearanceMode` | `"sentence"` |
| `strictEditing` | `true` |
| `animationsEnabled` | `true` |
| `soundEffectsEnabled` | `false` |

## Methods

| Method | Description |
|---|---|
| `constructor(input?)` | Creates a config from a partial input, filling missing fields with defaults. Calls `validate()`. |
| `validate()` | Throws if `disappearanceMode` is not a valid value (line, sentence, page, or timeout). |
| `with(changes)` | Returns a new `TypewriterConfig` with the given fields overridden. Immutable update pattern. |
| `toJSON()` | Serializes the config to a plain `TypewriterConfigInput` object. Used for localStorage persistence. |
