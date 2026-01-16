var test = require('tape');
var proxyquire = require('proxyquire');
var testConfig = {
    token: 'foo',
    subdomain: 'bar',
};

function getBaseMocks() {
    return {
        'node-loggly-bulk': {
            createClient: function() {
                return {
                    log: function() {},
                };
            },
        },
    };
}

test('Bunyan2Loggly Exists', function(t) {
    t.plan(1);

    var Bunyan2Loggly = proxyquire('../', getBaseMocks());

    t.equal(typeof Bunyan2Loggly, 'function', 'Bunyan2Loggly is a function');
});

test('Bunyan2Loggly throws on bad config', function(t) {
    t.plan(4);

    var Bunyan2Loggly = proxyquire('../', getBaseMocks());
    var exceptionMessage = /bunyan-loggly requires a config object with token and subdomain/;

    t.throws(
        function() {
            new Bunyan2Loggly();
        },
        exceptionMessage,
        'throws on bad config'
    );
    t.throws(
        function() {
            new Bunyan2Loggly({});
        },
        exceptionMessage,
        'throws on bad config'
    );
    t.throws(
        function() {
            new Bunyan2Loggly({ token: 'foo' });
        },
        exceptionMessage,
        'throws on bad config'
    );
    t.throws(
        function() {
            new Bunyan2Loggly({ subdomain: 'foo' });
        },
        exceptionMessage,
        'throws on bad config'
    );
});

test('Bunyan2Loggly creates loggly client', function(t) {
    t.plan(3);

    var mocks = getBaseMocks();

    mocks['node-loggly-bulk'].createClient = function(config) {
        t.equal(config.token, testConfig.token, 'correct token');
        t.equal(config.subdomain, testConfig.subdomain, 'correct subdomain');
        t.equal(config.json, true, 'correct json');
    };

    var Bunyan2Loggly = proxyquire('../', mocks);

    new Bunyan2Loggly(testConfig);
});

test('Bunyan2Loggly sets default bufferLength', function(t) {
    t.plan(1);

    var Bunyan2Loggly = proxyquire('../', getBaseMocks());
    var bunyan2Loggly = new Bunyan2Loggly(testConfig);

    t.equal(bunyan2Loggly.bufferLength, 1, 'bufferLength defaulted correctly');
});

test('Bunyan2Loggly sets bufferLength if provided', function(t) {
    t.plan(1);

    var Bunyan2Loggly = proxyquire('../', getBaseMocks());
    var bunyan2Loggly = new Bunyan2Loggly(testConfig, 123);

    t.equal(bunyan2Loggly.bufferLength, 123, 'bufferLength set correctly');
});

test('Bunyan2Loggly sets default bufferTimeout', function(t) {
    t.plan(1);

    var Bunyan2Loggly = proxyquire('../', getBaseMocks());
    var bunyan2Loggly = new Bunyan2Loggly(testConfig);

    t.equal(bunyan2Loggly.bufferTimeout, 30000, 'bufferTimeout defaulted correctly');
});

test('Bunyan2Loggly sets bufferTimeout if provided', function(t) {
    t.plan(1);

    var Bunyan2Loggly = proxyquire('../', getBaseMocks());
    var bunyan2Loggly = new Bunyan2Loggly(testConfig, null, 123);

    t.equal(bunyan2Loggly.bufferTimeout, 123, 'bufferTimeout set correctly');
});

test('Bunyan2Loggly sets isBulk if provided', function(t) {
    t.plan(1);

    var mocks = getBaseMocks();

    mocks['node-loggly-bulk'].createClient = function(config) {
        t.equal(config.isBulk, false, 'isBulk set correctly');
    };

    var Bunyan2Loggly = proxyquire('../', mocks);
    new Bunyan2Loggly({ token: testConfig.token, subdomain: testConfig.subdomain, isBulk: false });
});

test('Bunyan2Logly defaults isBulk if not provided', function(t) {
    t.plan(1);

    var mocks = getBaseMocks();

    mocks['node-loggly-bulk'].createClient = function(config) {
        t.equal(config.isBulk, true, 'isBulk defaults to true');
    };

    var Bunyan2Loggly = proxyquire('../', mocks);
    new Bunyan2Loggly(testConfig);
});

test('Bunyan2Loggly throws if write called with non raw stream', function(t) {
    t.plan(2);

    var Bunyan2Loggly = proxyquire('../', getBaseMocks());
    var bunyan2Loggly = new Bunyan2Loggly(testConfig);
    var exceptionMessage = /bunyan-loggly requires a raw stream. Please define the type as raw when setting up the bunyan stream./;

    t.throws(
        function() {
            bunyan2Loggly.write();
        },
        exceptionMessage,
        'throws on bad stream'
    );
    t.throws(
        function() {
            bunyan2Loggly.write('foo');
        },
        exceptionMessage,
        'throws on bad stream'
    );
});

test('Bunyan2Loggly changes time to timestamp', function(t) {
    t.plan(1);

    var mocks = getBaseMocks();
    var Bunyan2Loggly = proxyquire('../', mocks);
    var testData = { foo: 'bar', time: 'nao' };
    var responseData = { foo: 'bar', timestamp: 'nao' };

    mocks['node-loggly-bulk'].createClient = function() {
        return {
            log: function(data) {
                t.deepEqual(data, responseData, 'data sent to loggly');
            },
        };
    };

    var bunyan2Loggly = new Bunyan2Loggly(testConfig);

    bunyan2Loggly.write(testData);
});

test('Bunyan2Loggly sends data to loggly', function(t) {
    t.plan(1);

    var mocks = getBaseMocks();
    var Bunyan2Loggly = proxyquire('../', mocks);
    var testData = { foo: 'bar' };

    mocks['node-loggly-bulk'].createClient = function() {
        return {
            log: function(data) {
                t.deepEqual(data, testData, 'data sent to loggly');
            },
        };
    };

    var bunyan2Loggly = new Bunyan2Loggly(testConfig);

    bunyan2Loggly.write(testData);
});

test('Bunyan2Loggly uses logglyCallback if provided', function(t) {
    t.plan(3);

    var mocks = getBaseMocks();
    var Bunyan2Loggly = proxyquire('../', mocks);
    var testData = { foo: 'bar' };
    var testError = 'testError';
    var testResult = 'testResult';

    function logglyCallback(error, result, content) {
        t.equal(error, testError, 'correct error');
        t.equal(result, testResult, 'correct result');
        t.deepEqual(content, testData, 'correct content');
    }

    mocks['node-loggly-bulk'].createClient = function() {
        return {
            log: function(data, callback) {
                callback(testError, testResult);
            },
        };
    };

    var bunyan2Loggly = new Bunyan2Loggly(testConfig, null, null, logglyCallback);

    bunyan2Loggly.write(testData);
});

test('Bunyan2Loggly handles circular references', function(t) {
    t.plan(2);

    var mocks = getBaseMocks();
    var Bunyan2Loggly = proxyquire('../', mocks);
    var testData = { time: 'nao' };

    testData.x = testData;

    mocks['node-loggly-bulk'].createClient = function() {
        return {
            log: function(data) {
                t.notEqual(data, testData, 'original data was not mutated');
                t.deepEqual(data, { timestamp: 'nao' }, 'changed to timestamp');
            },
        };
    };

    var bunyan2Loggly = new Bunyan2Loggly(testConfig);

    bunyan2Loggly.write(testData);
});
