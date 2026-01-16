# beeper

> Make your terminal beep

![](https://cloud.githubusercontent.com/assets/170270/5261236/f8471100-7a49-11e4-81af-96cd09a522d9.gif)

Useful as an attention grabber. For example, when an error happens.

## Install

```
$ npm install beeper
```

## Usage

```js
const beeper = require('beeper');

(async => {
	await beeper();
	// beep one time

	await beeper(3);
	// beep three times

	await beeper('****-*-*');
	// beep, beep, beep, beep, pause, beep, pause, beep
})();
```

## API

It will not beep if stdout is not TTY or if the user supplies the `--no-beep` flag.

### beeper(count?)
### beeper(melody?)

Returns a `Promise<void>` that is resolved after the melody has ended.

#### count

Type: `number`\
Default: `1`

How many times you want it to beep.

#### melody

Type: `string`

Construct your own melody by supplying a string of `*` for beep `-` for pause.
