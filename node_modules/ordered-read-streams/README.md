<p align="center">
  <a href="https://gulpjs.com">
    <img height="257" width="114" src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png">
  </a>
</p>

# ordered-read-streams

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][ci-image]][ci-url] [![Coveralls Status][coveralls-image]][coveralls-url]

Combines array of streams into one Readable stream in strict order.

## Usage

```js
var { Readable } = require('streamx');
var ordered = require('ordered-read-streams');

var s1 = new Readable({
  read: function (cb) {
    var self = this;
    if (self.called) {
      self.push(null);
      return cb(null);
    }
    setTimeout(function () {
      self.called = true;
      self.push('stream 1');
      cb(null);
    }, 200);
  },
});
var s2 = new Readable({
  read: function (cb) {
    var self = this;
    if (self.called) {
      self.push(null);
      return cb(null);
    }
    setTimeout(function () {
      self.called = true;
      self.push('stream 2');
      cb(null);
    }, 30);
  },
});
var s3 = new Readable({
  read: function (cb) {
    var self = this;
    if (self.called) {
      self.push(null);
      return cb(null);
    }
    setTimeout(function () {
      self.called = true;
      self.push('stream 3');
      cb(null);
    }, 100);
  },
});

var readable = ordered([s1, s2, s3]);
readable.on('data', function (data) {
  console.log(data);
  // Logs:
  // stream 1
  // stream 2
  // stream 3
});
```

## API

### `ordered(streams, [options])`

Takes an array of `Readable` streams and produces a single `OrderedReadable` stream that will consume the provided streams in strict order. The produced `Readable` stream respects backpressure on itself and any provided streams.

#### `orderedReadable.addSource(stream)`

The returned `Readable` stream has an `addSource` instance function that takes appends a `Readable` stream to the list of source streams that the `OrderedReadable` is reading from.

## License

MIT

<!-- prettier-ignore-start -->
[downloads-image]: https://img.shields.io/npm/dm/ordered-read-streams.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/ordered-read-streams
[npm-image]: https://img.shields.io/npm/v/ordered-read-streams.svg?style=flat-square

[ci-url]: https://github.com/gulpjs/ordered-read-streams/actions?query=workflow:dev
[ci-image]: https://img.shields.io/github/workflow/status/gulpjs/ordered-read-streams/dev?style=flat-square

[coveralls-url]: https://coveralls.io/r/gulpjs/ordered-read-streams
[coveralls-image]: https://img.shields.io/coveralls/gulpjs/ordered-read-streams/master.svg?style=flat-square
<!-- prettier-ignore-end -->
