import { goto } from "$app/navigation";
import { resolve } from "$app/paths";

let timer = $state(-1);
let timeoutStart = $state(Date.now());
let timeRemaining = $state(30000);

export const getTimeRemaining = () => timeRemaining;

export const initiateTimeout = () => {
	if (timer !== -1) clearInterval(timer);
	timeoutStart = Date.now();
	timeRemaining = 30000;
	timer = setInterval(() => {
		timeRemaining = Math.max(0, 30000 - (Date.now() - timeoutStart));
		if (timeRemaining <= 0) goto(resolve("/share"));
	}, 500);
};

export const destroyTimeout = () => {
	if (timer !== -1) {
		clearInterval(timer);
		timer = -1;
	}
};
