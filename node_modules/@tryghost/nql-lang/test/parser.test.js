require('./utils');

const sinon = require('sinon');

const scope = require('../lib/scope');
const {parse} = require('../');

describe('Parser', function () {
    var parserError = /^Query Error: unexpected character in filter at char/;

    describe('Simple Expressions', function () {
        it('should parse simple id & value combos', function () {
            parse('id:3').should.eql({id: 3});

            parse('slug:getting-started').should.eql({slug: 'getting-started'});
        });
    });

    describe('Comparison Query Operators', function () {
        it('can parse standard equals', function () {
            parse('count:5').should.eql({count: 5});

            parse('tag:getting-started').should.eql({tag: 'getting-started'});

            parse('author:\'Joe Bloggs\'').should.eql({author: 'Joe Bloggs'});

            parse('author:123-test').should.eql({author: '123-test'});
        });

        it('can parse not equals', function () {
            parse('count:-5').should.eql({count: {$ne: 5}});

            parse('tag:-getting-started').should.eql({tag: {$ne: 'getting-started'}});

            parse('author:-\'Joe Bloggs\'').should.eql({author: {$ne: 'Joe Bloggs'}});
        });

        it('can parse greater than', function () {
            parse('count:>5').should.eql({count: {$gt: 5}});

            parse('tag:>getting-started').should.eql({tag: {$gt: 'getting-started'}});

            parse('author:>\'Joe Bloggs\'').should.eql({author: {$gt: 'Joe Bloggs'}});
        });

        it('can parse less than', function () {
            parse('count:<5').should.eql({count: {$lt: 5}});

            parse('tag:<getting-started').should.eql({tag: {$lt: 'getting-started'}});

            parse('author:<\'Joe Bloggs\'').should.eql({author: {$lt: 'Joe Bloggs'}});
        });

        it('can parse greater than or equals', function () {
            parse('count:>=5').should.eql({count: {$gte: 5}});

            parse('tag:>=getting-started').should.eql({tag: {$gte: 'getting-started'}});

            parse('author:>=\'Joe Bloggs\'').should.eql({author: {$gte: 'Joe Bloggs'}});
        });

        it('can parse less than or equals', function () {
            parse('count:<=5').should.eql({count: {$lte: 5}});

            parse('tag:<=getting-started').should.eql({tag: {$lte: 'getting-started'}});

            parse('author:<=\'Joe Bloggs\'').should.eql({author: {$lte: 'Joe Bloggs'}});
        });

        it('can parse IN with single value', function () {
            parse('count:[5]').should.eql({count: {$in: [5]}});

            parse('tag:[getting-started]').should.eql({tag: {$in: ['getting-started']}});

            parse('author:[\'Joe Bloggs\']').should.eql({author: {$in: ['Joe Bloggs']}});
        });

        it('can parse NOT IN with single value', function () {
            parse('count:-[5]').should.eql({count: {$nin: [5]}});

            parse('tag:-[getting-started]').should.eql({tag: {$nin: ['getting-started']}});

            parse('author:-[\'Joe Bloggs\']').should.eql({author: {$nin: ['Joe Bloggs']}});
        });

        it('can parse IN with multiple values', function () {
            parse('count:[5, 8, 12]').should.eql({count: {$in: [5, 8, 12]}});

            parse('tag:[getting-started, ghost, really-long-1]')
                .should.eql({tag: {$in: ['getting-started', 'ghost', 'really-long-1']}});

            parse('author:[\'Joe Bloggs\', \'John O\\\'Nolan\', \'Hello World\']')
                .should.eql({author: {$in: ['Joe Bloggs', 'John O\'Nolan', 'Hello World']}});
        });

        it('can parse NOT IN with multiple values', function () {
            parse('count:-[5, 8, 12]').should.eql({count: {$nin: [5, 8, 12]}});

            parse('tag:-[getting-started, ghost, really-long-1]')
                .should.eql({tag: {$nin: ['getting-started', 'ghost', 'really-long-1']}});

            parse('author:-[\'Joe Bloggs\', \'John O\\\'Nolan\', \'Hello World\']')
                .should.eql({author: {$nin: ['Joe Bloggs', 'John O\'Nolan', 'Hello World']}});
        });

        it('can parse CONTAINS, STARTSWITH and ENDSWITH with and without NOT', function () {
            parse(`email:~'gmail.com'`).should.eql({email: {$regex: /gmail\.com/i}});

            parse(`email:-~'gmail.com'`).should.eql({email: {$not: /gmail\.com/i}});

            parse(`email:~^'gmail.com'`).should.eql({email: {$regex: /^gmail\.com/i}});

            parse(`email:-~^'gmail.com'`).should.eql({email: {$not: /^gmail\.com/i}});

            parse(`email:~$'gmail.com'`).should.eql({email: {$regex: /gmail\.com$/i}});

            parse(`email:-~$'gmail.com'`).should.eql({email: {$not: /gmail\.com$/i}});
        });

        it('can parse CONTAINS, STARTSWITH and ENDSWITH and handle regexchars', function () {
            parse(`email:~'.*+?^$(){}|[]\\'`).should.eql({email: {$regex: /\.\*\+\?\^\$\(\)\{\}\|\[\]\\/i}});
        });

        it('can parse CONTAINS, STARTSWITH and ENDSWITH and handle quotes', function () {
            parse(`name:~'john o\\'nolan'`).should.eql({name: {$regex: /john o'nolan/i}});

            parse(`name:~'john o\\"nolan'`).should.eql({name: {$regex: /john o"nolan/i}});

            // TODO: Fix this BUG
            (function () {
                parse(`name:~'john o"nolan'`);
            }).should.throw();

            // This will probably never be possible
            (function () {
                parse(`name:~'john o'nolan'`);
            }).should.throw();
        });
    });

    describe('Values', function () {
        it('can parse null', function () {
            parse('image:null').should.eql({image: null});
        });

        it('can parse NOT null', function () {
            parse('image:-null').should.eql({image: {$ne: null}});
        });

        it('can parse true', function () {
            parse('featured:true').should.eql({featured: true});
        });

        it('can parse NOT true', function () {
            parse('featured:-true').should.eql({featured: {$ne: true}});
        });

        it('can parse false', function () {
            parse('featured:false').should.eql({featured: false});
        });

        it('can parse NOT false', function () {
            parse('featured:-false').should.eql({featured: {$ne: false}});
        });

        it('can parse a Number', function () {
            parse('count:5').should.eql({count: 5});
        });

        it('can parse NOT a Number', function () {
            parse('count:-5').should.eql({count: {$ne: 5}});
        });
    });

    describe('Logical Query Operators', function () {
        // @TODO support implicit and?
        it('$and', function () {
            parse('page:false+status:published')
                .should.eql({$and: [{page: false}, {status: 'published'}]});
        });

        // @TODO or with same property is in?
        it('$or', function () {
            parse('page:true,featured:true')
                .should.eql({$or: [{page: true}, {featured: true}]});

            parse('page:true,page:false')
                .should.eql({$or: [{page: true}, {page: false}]});
        });
    });

    describe('Grouping', function () {
        it('ungroups top level group', function () {
            parse('(status:published)').should.eql({status: 'published'});
        });

        it('ungroups top level group with logical query operator', function () {
            parse('(page:false+status:published)')
                .should.eql({$and: [{page: false}, {status: 'published'}]});
        });

        it('ungroups top level group with nested groups', function () {
            parse('(page:false,(status:published+featured:true))')
                .should.eql({
                    $or: [
                        {page: false},
                        {
                            $and: [
                                {status: 'published'},
                                {featured: true}
                            ]
                        }
                    ]
                });
        });
    });

    describe('complex examples', function () {
        it('Many expressions', function () {
            parse('tag:photo+featured:true,tag.count:>5').should.eql({
                $or: [
                    {$and: [{tag: 'photo'}, {featured: true}]},
                    {'tag.count': {$gt: 5}}
                ]
            });

            parse('tag:photo+image:-null,tag.count:>5').should.eql({
                $or: [
                    {$and: [{tag: 'photo'}, {image: {$ne: null}}]},
                    {'tag.count': {$gt: 5}}
                ]
            });
        });

        describe('Logical Groups', function () {
            describe('$or', function () {
                it('ungrouped version', function () {
                    parse('author:-joe,tag:photo,image:-null,featured:true').should.eql(
                        {$or: [
                            {author: {$ne: 'joe'}},
                            {tag: 'photo'},
                            {image: {$ne: null}},
                            {featured: true}
                        ]}
                    );
                });

                it('RIGHT grouped version', function () {
                    parse('author:-joe,(tag:photo,image:-null,featured:true)').should.eql(
                        {$or: [
                            {author: {$ne: 'joe'}},
                            {$or: [
                                {tag: 'photo'},
                                {image: {$ne: null}},
                                {featured: true}
                            ]}
                        ]}
                    );
                });

                it('LEFT grouped version', function () {
                    parse('(tag:photo,image:-null,featured:true),author:-joe').should.eql(
                        {$or: [
                            {$or: [
                                {tag: 'photo'},
                                {image: {$ne: null}},
                                {featured: true}
                            ]},
                            {author: {$ne: 'joe'}}
                        ]}
                    );
                });
            });

            describe('$and', function () {
                it('ungrouped version', function () {
                    parse('author:-joe+tag:photo+image:-null+featured:true').should.eql(
                        {$and: [
                            {author: {$ne: 'joe'}},
                            {tag: 'photo'},
                            {image: {$ne: null}},
                            {featured: true}
                        ]}
                    );
                });

                it('RIGHT grouped version', function () {
                    parse('author:-joe+(tag:photo+image:-null+featured:true)').should.eql(
                        {$and: [
                            {author: {$ne: 'joe'}},
                            {$and: [
                                {tag: 'photo'},
                                {image: {$ne: null}},
                                {featured: true}
                            ]}
                        ]}
                    );
                });

                it('LEFT grouped version', function () {
                    parse('(tag:photo+image:-null+featured:true)+author:-joe').should.eql(
                        {$and: [
                            {$and: [
                                {tag: 'photo'},
                                {image: {$ne: null}},
                                {featured: true}
                            ]},
                            {author: {$ne: 'joe'}}
                        ]}
                    );
                });
            });

            describe('$or with $and group', function () {
                it('ungrouped version', function () {
                    parse('author:-joe,tag:photo+image:-null+featured:true').should.eql(
                        {$or: [
                            {author: {$ne: 'joe'}},
                            {$and: [
                                {tag: 'photo'},
                                {image: {$ne: null}},
                                {featured: true}
                            ]}
                        ]}
                    );
                });

                it('RIGHT grouped version', function () {
                    parse('author:-joe,(tag:photo+image:-null+featured:true)').should.eql(
                        {$or: [
                            {author: {$ne: 'joe'}},
                            {$and: [
                                {tag: 'photo'},
                                {image: {$ne: null}},
                                {featured: true}
                            ]}
                        ]}
                    );
                });

                it('LEFT grouped version', function () {
                    parse('(tag:photo+image:-null+featured:true),author:-joe').should.eql(
                        {$or: [
                            {$and: [
                                {tag: 'photo'},
                                {image: {$ne: null}},
                                {featured: true}
                            ]},
                            {author: {$ne: 'joe'}}
                        ]}
                    );
                });
            });

            describe('$and with $or group', function () {
                it('ungrouped version', function () {
                    parse('author:-joe+tag:photo,image:-null,featured:true').should.eql(
                        {$or: [
                            {$and: [
                                {author: {$ne: 'joe'}},
                                {tag: 'photo'}
                            ]},
                            {image: {$ne: null}},
                            {featured: true}
                        ]}
                    );
                });

                it('RIGHT grouped version', function () {
                    parse('author:-joe+(tag:photo,image:-null,featured:true)').should.eql(
                        {$and: [
                            {author: {$ne: 'joe'}},
                            {$or: [
                                {tag: 'photo'},
                                {image: {$ne: null}},
                                {featured: true}
                            ]}
                        ]}
                    );
                });

                it('LEFT grouped version', function () {
                    parse('(tag:photo,image:-null,featured:true)+author:-joe').should.eql(
                        {$and: [
                            {$or: [
                                {tag: 'photo'},
                                {image: {$ne: null}},
                                {featured: true}
                            ]},
                            {author: {$ne: 'joe'}}
                        ]}
                    );
                });
            });

            describe('combo', function () {
                it('RIGHT grouped version', function () {
                    parse(
                        'name:sample,(name:-sample+created_at:<=\'2016-03-03\'),(name:-sample+(created_at:\'2016-03-03\',created_at:\'2016-03-04\'))'
                    ).should.eql(
                        {$or: [
                            {name: 'sample'},
                            {$and: [
                                {name: {$ne: 'sample'}},
                                {created_at: {$lte: '2016-03-03'}}
                            ]},
                            {$and: [
                                {name: {$ne: 'sample'}},
                                {$or: [
                                    {created_at: '2016-03-03'},
                                    {created_at: '2016-03-04'}
                                ]}
                            ]}
                        ]}
                    );
                });

                it('LEFT grouped version', function () {
                    parse(
                        '(name:-sample,(created_at:\'2016-03-03\',created_at:\'2016-03-04\')),(name:-sample+created_at:<=\'2016-03-03\'),name:sample'
                    ).should.eql(
                        {$or: [
                            {$or: [
                                {name: {$ne: 'sample'}},
                                {$or: [
                                    {created_at: '2016-03-03'},
                                    {created_at: '2016-03-04'}
                                ]}
                            ]},
                            {$and: [
                                {name: {$ne: 'sample'}},
                                {created_at: {$lte: '2016-03-03'}}
                            ]},
                            {name: 'sample'}
                        ]}
                    );
                });
            });
        });

        it('in expressions', function () {
            parse('author:-joe+tag:[photo,video]').should.eql(
                {$and: [
                    {author: {$ne: 'joe'}},
                    {tag: {$in: ['photo', 'video']}}
                ]}
            );

            parse('author:-joe+tag:-[photo,video,audio]').should.eql(
                {$and: [
                    {author: {$ne: 'joe'}},
                    {tag: {$nin: ['photo', 'video', 'audio']}}
                ]}
            );

            parse('author:-joe+tag:[photo,video,magic,\'audio\']+post.count:>5+post.count:<100').should.eql(
                {$and: [
                    {author: {$ne: 'joe'}},
                    {tag: {$in: ['photo', 'video', 'magic', 'audio']}},
                    {'post.count': {$gt: 5}},
                    {'post.count': {$lt: 100}}
                ]}
            );
        });
    });

    describe('whitespace rules', function () {
        it('will ignore whitespace in expressions', function () {
            parse('count: -5').should.eql(parse('count:-5'));
            parse('author: -joe + tag: [photo, video]').should.eql(parse('author:-joe+tag:[photo,video]'));
        });

        it('will not ignore whitespace in Strings', function () {
            parse('author:\'Hello World\'').should.not.eql(parse('author:\'HelloWorld\''));
        });
    });

    describe('invalid expressions', function () {
        it('CANNOT parse characters outside of a STRING value', function () {
            (function () {
                parse('tag:\'My Tag\'-');
            }).should.throw(parserError);
        });

        it('CANNOT parse property - operator - value in wrong order', function () {
            (function () {
                parse('\'My Tag\':tag');
            }).should.throw(parserError);
            (function () {
                parse('5>:tag');
            }).should.throw(parserError);
        });

        it('CANNOT parse combination without filter expression', function () {
            (function () {
                parse('count:3+');
            }).should.throw(parserError);
            (function () {
                parse(',count:3');
            }).should.throw(parserError);
        });

        it('CANNOT parse incomplete group', function () {
            (function () {
                parse('id:5,(count:3');
            }).should.throw(parserError);
            (function () {
                parse('count:3)');
            }).should.throw(parserError);
            (function () {
                parse('id:5(count:3)');
            }).should.throw(parserError);
        });

        it('CANNOT parse invalid IN expression', function () {
            (function () {
                parse('id:[test+ing]');
            }).should.throw(parserError);
            (function () {
                parse('id:[test');
            }).should.throw(parserError);
            (function () {
                parse('id:test,ing]');
            }).should.throw(parserError);
        });
    });

    describe('Aliases', function () {
        it('can handle empty aliases', function () {
            parse('tag:getting-started', {aliases: {}})
                .should.eql({tag: 'getting-started'});
        });

        it('can expand a field alias', function () {
            parse('tag:getting-started', {aliases: {tag: 'tags.slug'}})
                .should.eql({'tags.slug': 'getting-started'});
        });

        it('can expand multiple field aliases', function () {
            parse('tag:getting-started+author:joe', {aliases: {tag: 'tags.slug', author: 'authors.slug'}})
                .should.eql({$and: [{'tags.slug': 'getting-started'}, {'authors.slug': 'joe'}]});
        });
    });

    describe('Relative dates', function () {
        describe('relDateToAbsolute is called correctly', function () {
            let relDateToAbsoluteStub;

            beforeEach(function () {
                relDateToAbsoluteStub = sinon.stub(scope, 'relDateToAbsolute');
            });

            afterEach(function () {
                sinon.restore();
            });

            it('last_seen_at:>=now-2d', function () {
                parse('last_seen_at:>=now-2d');
                sinon.assert.calledWithExactly(relDateToAbsoluteStub, 'sub', '2', 'd');
            });

            it('last_seen_at:>=now+365d', function () {
                parse('last_seen_at:<=now+365d');

                sinon.assert.calledWithExactly(relDateToAbsoluteStub, 'add', '365', 'd');
            });

            it('last_seen_at:>=now-12w', function () {
                parse('last_seen_at:>=now-12w');
                sinon.assert.calledWithExactly(relDateToAbsoluteStub, 'sub', '12', 'w');
            });

            it('last_seen_at:>=now+2M', function () {
                parse('last_seen_at:<=now+2M');

                sinon.assert.calledWithExactly(relDateToAbsoluteStub, 'add', '2', 'M');
            });

            it('last_seen_at:>=now-2y', function () {
                parse('last_seen_at:>=now-2y');
                sinon.assert.calledWithExactly(relDateToAbsoluteStub, 'sub', '2', 'y');
            });

            it('last_seen_at:>=now+2h', function () {
                parse('last_seen_at:<=now+2h');

                sinon.assert.calledWithExactly(relDateToAbsoluteStub, 'add', '2', 'h');
            });

            it('last_seen_at:>=now+2m', function () {
                parse('last_seen_at:<=now+2m');

                sinon.assert.calledWithExactly(relDateToAbsoluteStub, 'add', '2', 'm');
            });

            it('last_seen_at:>=now+2s', function () {
                parse('last_seen_at:<=now+2s');

                sinon.assert.calledWithExactly(relDateToAbsoluteStub, 'add', '2', 's');
            });
        });

        describe('call to relDateToAbsolute results in the correct date format', function () {
            let relDateToAbsoluteSpy;

            beforeEach(function () {
                // spy lets requests through
                relDateToAbsoluteSpy = sinon.spy(scope, 'relDateToAbsolute');
            });

            afterEach(function () {
                sinon.restore();
            });

            it('can expand a relative date into an absolute date', function () {
                // This test proves that the date is in the right format, but not that it is the right date
                const subRes = parse('last_seen_at:>=now-2d');
                subRes.should.be.an.Object().with.property('last_seen_at');
                subRes.last_seen_at.should.be.an.Object().with.property('$gte');
                subRes.last_seen_at.$gte.should.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);

                const addRes = parse('last_seen_at:<=now+2d');
                addRes.should.be.an.Object().with.property('last_seen_at');
                addRes.last_seen_at.should.be.an.Object().with.property('$lte');
                addRes.last_seen_at.$lte.should.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);

                sinon.assert.calledTwice(relDateToAbsoluteSpy);
            });
        });

        describe('Single character literals', function () {
            it('can handle single character literals', function () {
                parse('name:a').should.eql({name: 'a'});
            });
        });
    });
});
