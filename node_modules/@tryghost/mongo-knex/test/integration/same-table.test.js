const utils = require('../utils');
const knex = utils.db.client;
const convertor = require('../../lib/convertor');

const makeQuery = query => convertor(knex('posts'), query);

describe('Same Table', function () {
    before(utils.db.setup());
    after(utils.db.teardown());

    describe('EQUALS $eq', function () {
        it('featured is true', function () {
            const mongoJSON = {featured: true};

            const query = makeQuery(mongoJSON);

            return query
                .then((results) => {
                    results.length.should.eql(6);
                });
        });
    });

    describe('NEGATION $ne', function () {
        it('status is not published', function () {
            const mongoJSON = {
                status: {
                    $ne: 'published'
                }
            };

            const query = makeQuery(mongoJSON);

            return query
                .then((results) => {
                    results.length.should.eql(1);
                });
        });

        it('status is draft and image is not null', function () {
            const mongoJSON = {
                $and: [
                    {
                        status: 'draft'
                    },
                    {
                        image: {
                            $ne: null
                        }
                    }
                ]
            };

            const query = makeQuery(mongoJSON);

            query.toQuery().should.eql('select * from `posts` where (`posts`.`status` = \'draft\' and `posts`.`image` is not null)');

            return query
                .then((results) => {
                    results.length.should.eql(1);
                });
        });

        it('status is published and image is not null', function () {
            const mongoJSON = {
                $or: [
                    {
                        status: 'published'
                    },
                    {
                        image: {
                            $ne: null
                        }
                    }
                ]
            };

            const query = makeQuery(mongoJSON);

            query.toQuery().should.eql('select * from `posts` where (`posts`.`status` = \'published\' or `posts`.`image` is not null)');

            return query
                .then((results) => {
                    results.length.should.eql(8);
                });
        });
    });

    describe('COMPARISONS $gt / $gte / $lt / $lte', function () {
        it('published_at is > 2015-06-04', function () {
            const mongoJSON = {published_at: {
                $gt: '2015-06-04'
            }};

            const query = makeQuery(mongoJSON);

            return query
                .then((result) => {
                    result.length.should.eql(1);
                    result.should.matchIds([8]);
                });
        });

        it('published_at is >= 2015-06-04', function () {
            const mongoJSON = {published_at: {
                $gte: '2015-06-04'
            }};

            const query = makeQuery(mongoJSON);

            return query
                .then((result) => {
                    result.length.should.eql(2);
                    result.should.matchIds([7, 8]);
                });
        });

        it('published_at is < 2015-06-04', function () {
            const mongoJSON = {published_at: {
                $lt: '2015-06-04'
            }};

            const query = makeQuery(mongoJSON);

            return query
                .then((result) => {
                    result.length.should.eql(5);
                    result.should.matchIds([1, 3, 4, 5, 6]);
                });
        });

        it('published_at is <= 2015-06-04', function () {
            const mongoJSON = {published_at: {
                $lte: '2015-06-04'
            }};

            const query = makeQuery(mongoJSON);

            return query
                .then((result) => {
                    result.length.should.eql(6);
                    result.should.matchIds([1, 3, 4, 5, 6, 7]);
                });
        });
    });
});

