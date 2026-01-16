'use strict';
const delay = require('yoctodelay');

const BEEP_DELAY = 500;

function beep() {
	process.stdout.write('\u0007');
}

async function melodicalBeep(melody) {
	if (melody.length === 0) {
		return;
	}

	await delay(BEEP_DELAY);

	if (melody.shift() === '*') {
		beep();
	}

	return melodicalBeep(melody);
}

module.exports = async countOrMelody => {
	if (
		!process.stdout.isTTY ||
		process.argv.includes('--no-beep') ||
		process.argv.includes('--beep=false')
	) {
		return;
	}

	if (countOrMelody === Number.parseInt(countOrMelody, 10)) {
		if (countOrMelody < 0) {
			throw new TypeError('Negative numbers are not accepted');
		}

		if (countOrMelody === 0) {
			return;
		}

		for (let i = 0; i < countOrMelody; i++) {
			await delay(BEEP_DELAY); // eslint-disable-line no-await-in-loop

			beep();
		}
	} else if (!countOrMelody) {
		beep();
	} else if (typeof countOrMelody === 'string') {
		await melodicalBeep(countOrMelody.split(''));
	} else {
		throw new TypeError('Not an accepted type');
	}
};
