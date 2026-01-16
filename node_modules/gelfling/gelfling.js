var zlib = require('zlib')
var dgram = require('dgram')
var crypto = require('crypto')

// From https://github.com/Graylog2/graylog2-docs/wiki/GELF
// and https://github.com/Graylog2/gelf-php/blob/master/GELFMessage.php
var GELF_ID = [0x1e, 0x0f]
var GELF_KEYS = ['version', 'host', 'short_message', 'full_message', 'timestamp', 'level', 'facility', 'line', 'file']
var ILLEGAL_KEYS = ['_id']

function Gelfling(host, port, options) {
  this.host = host != null ? host : 'localhost'
  this.port = port != null ? port : 12201
  if (options == null) options = {}

  this.maxChunkSize = this.getMaxChunkSize(options.maxChunkSize)
  this.defaults = options.defaults || {}
  this.errHandler = options.errHandler || console.error
  this.keepAlive = options.keepAlive
  this.compress = options.compress == null ? true : options.compress
}

Gelfling.prototype.send = function(data, callback) {
  if (callback == null) callback = function() {}
  if (Buffer.isBuffer(data)) data = [data]
  var udpClient, remaining, i, self = this, cbDone = false

  if (!Array.isArray(data))
    return this.encode(this.convert(data), function(err, chunks) {
      if (err) return callback(err)
      self.send(chunks, callback)
    })

  if (!this.keepAlive || !this.udpClient) {
    udpClient = dgram.createSocket('udp4')
    udpClient.on('error', this.errHandler)
    if (this.keepAlive) this.udpClient = udpClient
  } else {
    udpClient = this.udpClient
  }
  remaining = data.length
  function checkDone(err) {
    if (err || --remaining === 0) {
      if (!self.keepAlive) udpClient.close()
      if (!cbDone) {
        cbDone = true;
        callback(err)
      }
    }
  }
  for (i = 0; i < data.length; i++)
    udpClient.send(data[i], 0, data[i].length, this.port, this.host, checkDone)
}

Gelfling.prototype.close = function() {
  if (this.udpClient) this.udpClient.close()
}

Gelfling.prototype.encode = function(msg, callback) {
  if (callback == null) callback = function() {}
  var self = this
  var buffer = new Buffer(JSON.stringify(msg))

  if (!this.compress) return callback(null, this.split(buffer))

  zlib.gzip(buffer, function(err, compressed) {
    if (err) return callback(err)
    callback(null, self.split(compressed))
  })
}

Gelfling.prototype.split = function(data, chunkSize) {
  if (chunkSize == null) chunkSize = this.maxChunkSize
  if (data.length <= chunkSize) return [data]

  var msgId = [].slice.call(crypto.randomBytes(8)),
    numChunks = Math.ceil(data.length / chunkSize),
    chunks = new Array(numChunks), chunkIx, dataSlice, dataStart

  for (chunkIx = 0; chunkIx < numChunks; chunkIx++) {
    dataStart = chunkIx * chunkSize
    dataSlice = [].slice.call(data, dataStart, dataStart + chunkSize)
    chunks[chunkIx] = new Buffer(GELF_ID.concat(msgId, chunkIx, numChunks, dataSlice))
  }

  return chunks
}

Gelfling.prototype.convert = function(msg) {
  if (typeof msg !== 'object') msg = {short_message: msg}

  var gelfMsg = {}, defaults = this.defaults, key, val

  for (key in defaults) {
    if (!defaults.hasOwnProperty(key)) continue
    val = defaults[key]
    gelfMsg[key] = typeof val === 'function' ? val(msg) : val
  }

  for (key in msg) {
    if (!msg.hasOwnProperty(key)) continue
    val = msg[key]
    if (GELF_KEYS.indexOf(key) < 0) key = '_' + key
    if (ILLEGAL_KEYS.indexOf(key) >= 0) key = '_' + key
    gelfMsg[key] = val
  }

  if (gelfMsg.version == null) gelfMsg.version = '1.0'
  if (gelfMsg.host == null) gelfMsg.host = require('os').hostname()
  if (gelfMsg.timestamp == null) gelfMsg.timestamp = +(new Date) / 1000
  if (gelfMsg.short_message == null) gelfMsg.short_message = JSON.stringify(msg)

  return gelfMsg
}

Gelfling.prototype.getMaxChunkSize = function(size) {
  if (size == null) size = 'wan'
  switch (size.toLowerCase()) {
    case 'wan': return 1420
    case 'lan': return 8154
    default: return parseInt(size, 10)
  }
}

var gelfling = module.exports = function(host, port, options) {
  return new Gelfling(host, port, options)
}
gelfling.Gelfling = Gelfling

gelfling.EMERGENCY = 0
gelfling.ALERT     = 1
gelfling.CRITICAL  = 2
gelfling.ERROR     = 3
gelfling.WARNING   = 4
gelfling.NOTICE    = 5
gelfling.INFO      = 6
gelfling.DEBUG     = 7
