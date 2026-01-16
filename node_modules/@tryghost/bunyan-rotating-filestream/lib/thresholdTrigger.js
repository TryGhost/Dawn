const {EventEmitter} = require('events');
const {Rotate} = require('./customEvents');
const {processSize} = require('../util/configProcessors');

class ThresholdTrigger extends EventEmitter {
    constructor(threshold) {
        super();
        this._threshold = processSize(threshold);
        this._totalWritten = 0;
    }

    newFile(fileInfo) {
        this._totalWritten = fileInfo.size;
        if (this._totalWritten > this.threshold) {
            // Case where initial file is larger than threshold - usually on config change between boots
            this.emit(Rotate);
        }
    }

    updateWritten(bytes) {
        this._totalWritten += bytes;
        if (this._totalWritten > this._threshold) {
            this.emit(Rotate);
        }
    }

    shutdown() {
        // no-op
    }
}

module.exports = ThresholdTrigger;