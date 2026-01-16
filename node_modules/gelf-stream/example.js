var split = require('split'),
    bunyan = require('bunyan'),
    gelfStream = require('./') // require('gelf-stream')

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

