import {
	TypewriterConfigInput,
	type TypewriterConfig,
	STORAGE_KEY,
} from "$lib/TypewriterConfig";

let configurator = $state<TypewriterConfigInput>(new TypewriterConfigInput());
export const config = () =>
	configurator.toTypewriterConfig() as TypewriterConfig;
export const updateConfig = (changes: Partial<TypewriterConfigInput>) => {
	configurator = configurator.with(changes);
	localStorage.setItem(
		STORAGE_KEY,
		JSON.stringify(configurator.toTypewriterConfig()),
	);
};
let typewriterInput = $state<string>("");

export const getTypewriterInput = () => typewriterInput;
export const setTypewriterInput = (input: string) => {
	typewriterInput = input;
};
