const {EventEmitter} = require('events');
const {Rotate} = require('./customEvents');
const {processPeriod} = require('../util/configProcessors');
const {setTimeout, clearTimeout} = require('long-timeout');

const getNextRotation = (period, lastRotation) => {
    var date = new Date();

    let nextRotation;
    switch (period.unit) {
    case 'ms':
        // Hidden millisecond period for debugging.
        if (lastRotation) {
            nextRotation = lastRotation + period.num;
        } else {
            nextRotation = Date.now() + period.num;
        }
        break;
    case 'h':
        if (lastRotation) {
            nextRotation = lastRotation + period.num * 60 * 60 * 1000;
        } else {
            // First time: top of the next hour.
            nextRotation = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
                date.getUTCDate(), date.getUTCHours() + 1);
        }
        break;
    case 'd':
        if (lastRotation) {
            nextRotation = lastRotation + period.num * 24 * 60 * 60 * 1000;
        } else {
            // First time: start of tomorrow (i.e. at the coming midnight) UTC.
            nextRotation = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
                date.getUTCDate() + 1);
        }
        break;
    case 'w':
        // Currently, always on Sunday morning at 00:00:00 (UTC).
        if (lastRotation) {
            nextRotation = lastRotation + period.num * 7 * 24 * 60 * 60 * 1000;
        } else {
            // First time: this coming Sunday.
            nextRotation = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
                date.getUTCDate() + (7 - date.getUTCDay()));
        }
        break;
    case 'm':
        if (lastRotation) {
            nextRotation = Date.UTC(date.getUTCFullYear(),
                date.getUTCMonth() + period.num, 1);
        } else {
            // First time: the start of the next month.
            nextRotation = Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1);
        }
        break;
    case 'y':
        if (lastRotation) {
            nextRotation = Date.UTC(date.getUTCFullYear() + period.num, 0, 1);
        } else {
            // First time: the start of the next year.
            nextRotation = Date.UTC(date.getUTCFullYear() + 1, 0, 1);
        }
        break;
    default:
        throw new Error(`Invalid period scope: "${period.unit}"`);
    }

    return nextRotation;
};

class PeriodTrigger extends EventEmitter {
    constructor(period, rotateExisting) {
        super();
        this._period = processPeriod(period);
        this._rotateExisting = rotateExisting;
        this._task = null;
        this._rotateAt = null;
    }

    newFile(fileInfo) {
        if (this._rotateExisting) {
            this._rotateAt = fileInfo.birthtimeMs;
            // Only rotate based on the first file once
            this._rotateExisting = false;
        }
        this.setNextTask();
    }

    shutdown() {
        if (this._task) {
            clearTimeout(this._task);
        }
    }

    setNextTask() {
        if (this._task) {
            clearTimeout(this._task);
        }
        this._rotateAt = getNextRotation(this._period, this._rotateAt);
        this._task = setTimeout(() => {
            this._emitRotate();
            this.setNextTask();
        }, Math.max(this._rotateAt - Date.now(), 0));
        // Prevent timeout from keeping Node.js alive
        this._task.unref();
    }

    _emitRotate() {
        this.emit(Rotate);
    }
}

module.exports = PeriodTrigger;