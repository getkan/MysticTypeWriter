import typewriter01 from '$lib/assets/typewriter-split/typewriter-01.mp3';
import typewriter02 from '$lib/assets/typewriter-split/typewriter-02.mp3';
import typewriter03 from '$lib/assets/typewriter-split/typewriter-03.mp3';
import typewriter04 from '$lib/assets/typewriter-split/typewriter-04.mp3';
import typewriter05 from '$lib/assets/typewriter-split/typewriter-05.mp3';
import typewriter06 from '$lib/assets/typewriter-split/typewriter-06.mp3';
import typewriter07 from '$lib/assets/typewriter-split/typewriter-07.mp3';
import typewriter08 from '$lib/assets/typewriter-split/typewriter-08.mp3';
import typewriter09 from '$lib/assets/typewriter-split/typewriter-09.mp3';
import typewriter10 from '$lib/assets/typewriter-split/typewriter-10.mp3';

const typewriterSounds = [
	typewriter01,
	typewriter02,
	typewriter03,
	typewriter04,
	typewriter05,
	typewriter06,
	typewriter07,
	typewriter08,
	typewriter09,
	typewriter10
];

export const playTypewriterSound = (() => {
	let lastTime = 0;
	return () => {
		const now = Date.now();
		if (now - lastTime >= 10) {
			lastTime = now;
			const randomIndex = Math.floor(Math.random() * typewriterSounds.length);
			const audioElement = new Audio(typewriterSounds[randomIndex]);
			audioElement.play();
		}
	};
})();