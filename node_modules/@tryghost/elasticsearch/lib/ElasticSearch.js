const {Client} = require('@elastic/elasticsearch');
const debug = require('@tryghost/debug')('logging:elasticsearch');

// Singleton client - multiple children made from it for a single connection pool
let client;

class ElasticSearch {
    constructor(clientConfig) {
        if (!client) {
            client = new Client(clientConfig);
        }
        
        this.client = client.child();
    }

    /**
     * Write an event to ElasticSearch
     * @param {Object} data Event data to index
     * @param {Object | string} index Index - either string representing the index or a property bag containing the index and other parameters
     */
    async index(data, index) {
        if (typeof data !== 'object') {
            debug('ElasticSearch transport requires log data to be an object');
            return;
        }

        if (typeof index === 'string') {
            index = {index};
        }

        try {
            await this.client.index({
                body: data,
                ...index
            });
        } catch (error) {
            debug('Failed to ship log', error.message);
        }
    }
}

module.exports = ElasticSearch;
