const ElasticSearch = require('./ElasticSearch');
const {PassThrough} = require('stream');
const split = require('split2');

// Create a writable stream which pipes data written into it, into the bulk helper

class ElasticSearchBunyan {
    constructor(clientConfig, index, pipeline) {
        this.client = new ElasticSearch(clientConfig);
        this.index = index;
        this.pipeline = pipeline;
    }

    getStream() {
        const index = this.index;
        const pipeline = this.pipeline;
        const stream = new PassThrough();
        this.client.client.helpers.bulk({
            datasource: stream.pipe(split()),
            onDocument() {
                return {
                    create: {_index: index}
                };
            },
            pipeline
        });

        return stream;
    }
}

module.exports = ElasticSearchBunyan;
