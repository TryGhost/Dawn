gelf-stream
-----------

[![Build Status](https://secure.travis-ci.org/mhart/gelf-stream.png?branch=master)](http://travis-ci.org/mhart/gelf-stream)

A node.js stream to send JS objects to a
[Graylog2](http://graylog2.org/) server (in
[GELF](http://graylog2.org/resources/gelf) format).

Also provides a stream that can be used directly in
[Bunyan](https://github.com/trentm/node-bunyan) and provides
a number of sane mappings.

Example
-------

```javascript
var split = require('split'),
    bunyan = require('bunyan'),
    gelfStream = require('gelf-stream')

// gelf-stream comes with Bunyan support

var stream = gelfStream.forBunyan('localhost')

var log = bunyan.createLogger({name: 'foo', streams: [{type: 'raw', stream: stream}]})

log.info('Testing Bunyan') // will be sent to the Graylog2 server on localhost

log.error(new Error('Oh noes!')) // will extract file/line numbers too

stream.end() // Bunyan doesn't currently end the stream when the program has finished

// Or you can use it to stream any sort of object/string

process.stdin
  .pipe(split()) // split into lines
  .pipe(gelfStream.create('localhost', {defaults: {level: 6}}))

process.stdin.resume()
```

API
---

### gelfStream.create([host], [port], [options])

### gelfStream.forBunyan([host], [port], [options])


Installation
------------

With [npm](http://npmjs.org/) do:

```
npm install gelf-stream
```

