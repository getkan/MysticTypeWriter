import { TypewriterConfigInput } from "$lib/model/config";
import { STORAGE_KEY } from "$lib/model/constants";
import type { TypewriterConfig } from "$lib/model/types";

let configurator = $state<TypewriterConfigInput>(new TypewriterConfigInput());

export const getConfig = () =>
	configurator.toTypewriterConfig() as TypewriterConfig;

export const updateConfig = (changes: Partial<TypewriterConfig>) => {
	configurator = configurator.with(changes);
	localStorage.setItem(
		STORAGE_KEY,
		JSON.stringify(configurator.toTypewriterConfig()),
	);
};
