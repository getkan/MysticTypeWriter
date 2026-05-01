let typewriterInput = $state<string>("");

export const getTypewriterInput = (): string => typewriterInput;
export const setTypewriterInput = (input: string) => {
	typewriterInput = input;
};
