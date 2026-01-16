const {EventEmitter} = require('events');
const {BytesWritten} = require('./customEvents');

class WriteQueue extends EventEmitter {
    constructor() {
        super();
        this._events = [];
        this._fileHandle = null;
        this._paused = true;
        this._isWriting = false;
        this._writing = Promise.resolve(true);
    }

    setFileHandle(fileHandle) {
        this._fileHandle = fileHandle;
        this._paused = false;
    }

    async _write(amount) {
        const data = this._events.splice(0, amount).join('');
        const result = await this._fileHandle.write(data);
        this.emit(BytesWritten, result.bytesWritten);
        this._isWriting = false;
    }

    push(event) {
        this._events.push(event);
        if (!this._paused && !this._isWriting) {
            this.flushToDisk();
        }
    }

    flushToDisk() {
        const currentEventCount = this._events.length;
        this._isWriting = true;
        this._writing = this._write(currentEventCount);
    }

    async pause() {
        this._paused = true;
        await this._writing;
    }

    async shutdown() {
        if (!this._paused) {
            this.flushToDisk();
        }
        await this.pause();
    }
}

module.exports = WriteQueue;