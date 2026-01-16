const WriteQueue = require('./lib/writeQueue');
const PeriodTrigger = require('./lib/periodTrigger');
const ThresholdTrigger = require('./lib/thresholdTrigger');
const FileRotator = require('./lib/fileRotator');
const {BytesWritten, Rotate, NewFile} = require('./lib/customEvents');

const fileStreams = [];

class RotatingFileStream {
    constructor(config) {
        if (typeof config.path !== 'string') {
            throw new Error('Must provide a string for path');
        }
        if (fileStreams.indexOf(config.path) >= 0) {
            throw new Error('Rotating log already exists for path: ', config.path);
        }
        fileStreams.push(config.path);
        this._path = config.path;
        this._rotator = new FileRotator(config);
        this._queue = new WriteQueue();
        this._triggers = [];
        if (config.period) {
            const periodTrigger = new PeriodTrigger(config.period, config.rotateExisting);
            this._triggers.push(periodTrigger);
        }
        if (config.threshold) {
            const thresholdTrigger = new ThresholdTrigger(config.threshold);
            this._queue.on(BytesWritten, bytes => thresholdTrigger.updateWritten(bytes));
            this._triggers.push(thresholdTrigger);
        }
        this._rotatingLock = false;
        this._triggers.forEach((trigger) => {
            trigger.on(Rotate, () => {
                this._rotate();
            });
        });
        this._rotator.on(NewFile, (fileInfo) => {
            this._queue.setFileHandle(this._rotator.getCurrentHandle());
            this._triggers.forEach(trigger => trigger.newFile(fileInfo));
        });
        this._initialised = this._rotator.initialise();
    }

    async _rotate() {
        if (this._rotatingLock) {
            // Already rotating
            return;
        }
        this._rotatingLock = true;
        await this._queue.pause();
        const nextFileHandle = await this._rotator.rotate();
        this._queue.setFileHandle(nextFileHandle);
        this._rotatingLock = false;
    }

    async write(data) {
        this._queue.push(data);
    }

    async end() {
        await this._initialised;
        await this._queue.shutdown();
        await this._rotator.shutdown();
        this._triggers.forEach(trigger => trigger.shutdown());
        const fileStreamIndex = fileStreams.indexOf(this._path);
        if (fileStreamIndex >= 0) {
            fileStreams.splice(fileStreamIndex, 1);
        }
    }

    destroy() {
        this.end();
    }

    destroySoon() {
        this.end();
    }
}

module.exports = RotatingFileStream;
