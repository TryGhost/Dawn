var path = require('path');

module.exports = function (file, prefix) {
    return path.basename(file).indexOf(prefix) === 0;
};
