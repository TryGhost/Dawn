/**
Make your terminal beep.

@param count - How many times you want it to beep. Default: `1`.
@param melody - Construct your own melody by supplying a string of `*` for beep `-` for pause.
@returns A `Promise` that is resolved after the melody has ended.

@example
```
import beeper = require('beeper');

(async => {
	await beeper();
	// beep one time

	await beeper(3);
	// beep three times

	await beeper('****-*-*');
	// beep, beep, beep, beep, pause, beep, pause, beep
})();
```
*/
declare function beeper(count?: number): Promise<void>;
declare function beeper(melody: string): Promise<void>;

export = beeper;
