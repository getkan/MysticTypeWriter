
import type { TypewriterConfig } from "$lib/TypewriterConfig";

export const state = $state<{config: TypewriterConfig | null}>({config: null});