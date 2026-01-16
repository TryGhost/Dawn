module.exports = {
    // Emitted when a new rotation is needed
    Rotate: Symbol('rotate'),
    // Emitted when a new file handle is acquired with the file info
    NewFile: Symbol('newFile'),
    // Emitted whenever data is written to the file with the number of bytes
    BytesWritten: Symbol('bytesWritten')
};