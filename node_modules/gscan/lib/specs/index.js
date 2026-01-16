const debug = require('@tryghost/debug')('ghost-spec');

module.exports = {
    get: function get(key) {
        let [version] = key;

        debug('Checking against version:', version);

        return require(`./${[version]}`);
    }
};
