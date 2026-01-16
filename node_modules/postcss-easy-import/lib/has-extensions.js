var path = require('path');

module.exports = function (file, extensions) {
    return extensions.indexOf(path.extname(file)) !== -1;
};
