const zlib = require('zlib');
const {pipeline} = require('stream');
const {promisify} = require('util');
const {createReadStream, createWriteStream} = require('fs');
const fs = require('fs').promises;
const pipe = promisify(pipeline);
const path = require('path');
const {processSize} = require('../util/configProcessors');

const {EventEmitter} = require('events');
const {NewFile} = require('./customEvents');

class FileRotator extends EventEmitter {
    constructor(config) {
        super();
        this._startNewFile = config.startNewFile;
        this._totalFiles = config.totalFiles;
        this._totalSize = processSize(config.totalSize);
        this._gzip = config.gzip;
        this._path = config.path;
        this._initialised = false;
        this._currentHandle = null;
    }

    async initialise() {
        if (this._initialised) {
            return;
        }
        this._initialised = true;

        await this._deleteFiles();
        if (this._startNewFile) {
            await this.rotate();
        } else {
            // Will open existing rather than immediately rotate
            await this._initialiseNewFile();
        }
    }

    getCurrentHandle() {
        return this._currentHandle;
    }

    async rotate() {
        if (this._currentHandle) {
            await this._closeFileHandle();
            this._currentHandle = null;
        }
        if (this._gzip) {
            await this._gzipCurrentFile();
        }
        await this._deleteFiles();
        await this._moveIntermediateFiles();
        await this._initialiseNewFile();
        // Set by _initialiseNewFile
        return this._currentHandle;
    }

    async shutdown() {
        if (this._currentHandle) {
            await this._closeFileHandle();
            this._currentHandle = null;
        }
    }

    async _initialiseNewFile() {
        this._currentHandle = await fs.open(this._getFileName(0, false), 'a');
        const fileInfo = await this._currentHandle.stat();
        this.emit(NewFile, fileInfo);
        return this._currentHandle;
    }

    async _gzipCurrentFile() {
        const inputName = this._getFileName(0, false);
        const outputName = this._getFileName(0, true);

        try {
            fs.stat(inputName);
        } catch (err) {
            if (err.code === 'ENOENT') {
                return;
            } else {
                throw err;
            }
        }

        const gzip = zlib.createGzip();
        const source = createReadStream(inputName);
        const destination = createWriteStream(outputName);
        await pipe(source, gzip, destination);
        source.close();
        destination.close();
        await fs.unlink(inputName);
    }

    _getFileName(number, gzip) {
        const parsedPath = path.parse(this._path);
        let base = `${parsedPath.name}.${String(number - 1)}${parsedPath.ext}`;
        if (number === 0) {
            base = parsedPath.name
                .replace('.%N', '')
                .replace('_%N', '')
                .replace('-%N', '')
                .replace('%N', '') + parsedPath.ext;
        } else if (parsedPath.name.indexOf('%N') >= 0) {
            base = parsedPath.name.replace('%N', String(number - 1)) + parsedPath.ext;
        }

        const isGzip = this._gzip && gzip;
        if (isGzip) {
            base += '.gz';
        }

        return path.join(parsedPath.dir, base);
    }

    async _deleteFiles() {
        const filesToDelete = [];
        // Only count backups - start at file 1 to ignore current file
        let fileNumber = 1;
        let bytesTotal = 0;
        for (; ; fileNumber++) {
            const name = this._getFileName(fileNumber, true);
            try {
                const result = await fs.stat(name);
                bytesTotal += result.size;
                if ((this._totalSize && bytesTotal > this._totalSize) || (this._totalFiles && fileNumber >= this._totalFiles)) {
                    filesToDelete.push(name);
                }
            } catch (err) {
                if (err.code === 'ENOENT') {
                    break;
                } else {
                    throw err;
                }
            }
        }
        for (const file of filesToDelete) {
            await fs.unlink(file);
        }
    }

    async _moveIntermediateFiles() {
        const filesToMove = [];
        let fileNumber = 0;
        for (; ; fileNumber++) {
            const name = this._getFileName(fileNumber, true);
            try {
                const result = await fs.stat(name);
                filesToMove.push(result);
            } catch (err) {
                if (err.code === 'ENOENT') {
                    break;
                } else {
                    throw err;
                }
            }
        }
        // Set to last file in sequence
        fileNumber -= 1;
        while (fileNumber >= 0) {
            await fs.rename(this._getFileName(fileNumber, true), this._getFileName(fileNumber + 1, true));
            fileNumber -= 1;
        }
    }

    async _closeFileHandle() {
        if (this._currentHandle) {
            const closePromise = this._currentHandle.close();
            this._currentHandle = null;
            await closePromise;
        }
    }
}

module.exports = FileRotator;