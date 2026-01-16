const Nconf = require('nconf');
const path = require('path');
const env = process.env.NODE_ENV || 'development';

module.exports.load = () => {
    const baseConfigPath = __dirname;
    const customConfigPath = process.cwd();
    const nconf = new Nconf.Provider();

    /**
     * command line arguments
     */
    nconf.argv();

    /**
     * env arguments
     */
    nconf.env({
        separator: '__'
    });

    nconf.file('custom-env', path.join(customConfigPath, 'config.' + env + '.json'));
    nconf.file('default-env', path.join(baseConfigPath, 'env', 'config.' + env + '.json'));

    /**
     * values we have to set manual
     */
    nconf.set('env', env);

    return nconf;
};
