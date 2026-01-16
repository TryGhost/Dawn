var path = require('path');

module.exports = function (id, prefix) {
    return path.join(path.dirname(id), prefix + path.basename(id));
};
