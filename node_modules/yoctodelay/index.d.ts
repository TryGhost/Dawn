/**
Delay the promise and then resolve.

@param milliseconds - The duration to delay the promise.

@example
```
import delay = require('yoctodelay');

(async () => {
	foo();

	await delay(100);

	// Executed 100 milliseconds later
	bar();
})();
```
*/
declare function delay(milliseconds: number): Promise<void>;

export = delay;
