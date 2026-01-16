var Readable = require('streamx').Readable;

function isReadable(stream) {
  if (typeof stream.pipe !== 'function') {
    return false;
  }

  if (!stream.readable) {
    return false;
  }

  if (typeof stream.read !== 'function') {
    return false;
  }

  return true;
}

function assertReadableStream(stream) {
  if (!isReadable(stream)) {
    throw new Error('All input streams must be readable');
  }
}

function OrderedStreams(streams, options) {
  streams = streams || [];

  if (!Array.isArray(streams)) {
    streams = [streams];
  }

  streams = Array.prototype.concat.apply([], streams);

  streams.forEach(assertReadableStream);

  options = Object.assign({}, options, {
    read: read,
    predestroy: predestroy,
  });

  var readable = new Readable(options);

  var streamIdx = 0;
  var activeStream = streams[streamIdx];

  var destroyedIdx = -1;
  var destroyedByError = false;
  var readableClosed = false;

  streams.forEach(setup);

  function setup(stream, idx) {
    stream.on('data', onData);
    stream.once('error', onError);
    stream.once('end', onEnd);
    stream.once('close', onClose);

    stream.pause();

    function cleanup() {
      stream.off('data', onData);
      stream.off('error', onError);
      stream.off('end', onEnd);
      stream.off('close', onClose);
    }

    function onError(err) {
      destroyedByError = true;
      cleanup();
      readable.destroy(err);
    }

    function onEnd() {
      streamIdx++;
      activeStream = streams[streamIdx];
      cleanup();
      if (activeStream) {
        activeStream.resume();
      } else {
        readable.push(null);
      }
    }

    function onClose() {
      destroyedIdx = idx;
      readableClosed = true;
      cleanup();
      readable.destroy();
    }
  }

  function predestroy() {
    streams.forEach(destroyStream);
  }

  function destroyStream(stream, idx) {
    if (destroyedIdx === idx) {
      return;
    }

    if (destroyedByError) {
      return stream.destroy();
    }
    if (readableClosed) {
      return stream.destroy();
    }

    stream.destroy(new Error('Wrapper destroyed'));
  }

  function onData(chunk) {
    var drained = readable.push(chunk);
    // If the stream is not drained, we pause the activeStream
    // The activeStream will be resumed on the next call to `read`
    if (!drained) {
      activeStream.pause();
    }
  }

  function read(cb) {
    if (activeStream) {
      activeStream.resume();
    } else {
      readable.push(null);
    }
    cb();
  }

  function addSource(stream) {
    assertReadableStream(stream);
    var idx = streams.push(stream);
    setup(stream, idx);
    activeStream = streams[streamIdx];
  }

  readable.addSource = addSource;

  return readable;
}

module.exports = OrderedStreams;
