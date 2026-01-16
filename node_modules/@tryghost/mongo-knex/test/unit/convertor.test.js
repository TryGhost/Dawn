require('../utils');
const knex = require('knex')({client: 'mysql'});
const convertor = require('../../lib/convertor');

const runQuery = query => convertor(knex('posts'), query, {
    relations: {
        tags: {
            tableName: 'tags',
            type: 'manyToMany',
            joinTable: 'posts_tags',
            joinFrom: 'post_id',
            joinTo: 'tag_id'
        },
        optional_tags: {
            tableName: 'optional_tags',
            type: 'manyToMany',
            joinTable: 'posts_tags',
            joinFrom: 'post_id',
            joinTo: 'tag_id',
            joinType: 'leftJoin'
        },
        posts_meta: {
            tableName: 'posts_meta',
            type: 'oneToOne',
            joinFrom: 'post_id'
        }
    }
}).toQuery();

describe('Simple Expressions', function () {
    it('should match based on simple id', function () {
        runQuery({id: 3})
            .should.eql('select * from `posts` where `posts`.`id` = 3');
    });

    it('should match based on string', function () {
        runQuery({title: 'Second post'})
            .should.eql('select * from `posts` where `posts`.`title` = \'Second post\'');
    });

    it('should accept any table input and interprets it as destination where clause', function () {
        runQuery({'posts.title': 'Second post'})
            .should.eql('select * from `posts` where `posts`.`title` = \'Second post\'');
    });

    it('should accept any table input and interprets it as destination where clause (number)', function () {
        runQuery({'count.posts': '3'})
            .should.eql('select * from `posts` where `count`.`posts` = \'3\'');
    });
});

describe('Comparison Query Operators', function () {
    it('can match equals', function () {
        runQuery({id: 2})
            .should.eql('select * from `posts` where `posts`.`id` = 2');
    });

    it('can match not equals', function () {
        runQuery({id: {$ne: 2}})
            .should.eql('select * from `posts` where `posts`.`id` != 2');
    });

    it('can match gt', function () {
        runQuery({id: {$gt: 2}})
            .should.eql('select * from `posts` where `posts`.`id` > 2');
    });

    it('can match lt', function () {
        runQuery({id: {$lt: 2}})
            .should.eql('select * from `posts` where `posts`.`id` < 2');
    });

    it('can match gte', function () {
        runQuery({id: {$gte: 2}})
            .should.eql('select * from `posts` where `posts`.`id` >= 2');
    });

    it('can match lte', function () {
        runQuery({id: {$lte: 2}})
            .should.eql('select * from `posts` where `posts`.`id` <= 2');
    });

    it('can match simple in (single value)', function () {
        runQuery({id: {$in: [2]}})
            .should.eql('select * from `posts` where `posts`.`id` in (2)');
    });

    it('can match simple in (multiple values)', function () {
        runQuery({id: {$in: [1, 3]}})
            .should.eql('select * from `posts` where `posts`.`id` in (1, 3)');
    });

    it('can match simple NOT in (single value)', function () {
        runQuery({id: {$nin: [2]}})
            .should.eql('select * from `posts` where `posts`.`id` not in (2)');
    });

    it('can match simple NOT in (multiple values)', function () {
        runQuery({id: {$nin: [1, 3]}})
            .should.eql('select * from `posts` where `posts`.`id` not in (1, 3)');
    });

    it('can match array in (single value)', function () {
        runQuery({tags: {$in: ['video']}})
            .should.eql('select * from `posts` where `posts`.`tags` in (\'video\')');
    });

    it('can match array in (multiple values)', function () {
        runQuery({tags: {$in: ['video', 'audio']}})
            .should.eql('select * from `posts` where `posts`.`tags` in (\'video\', \'audio\')');
    });

    it('can match array NOT in (single value)', function () {
        runQuery({tags: {$nin: ['video']}})
            .should.eql('select * from `posts` where `posts`.`tags` not in (\'video\')');
    });

    it('can match array NOT in (multiple values)', function () {
        runQuery({tags: {$nin: ['video', 'audio']}})
            .should.eql('select * from `posts` where `posts`.`tags` not in (\'video\', \'audio\')');
    });

    it('can match like', function () {
        runQuery({email: {$regex: /Gmail\.com/i}})
            .should.eql('select * from `posts` where lower(`posts`.`email`) like \'%gmail.com%\' ESCAPE \'*\'');
    });

    it('can match like with startswith', function () {
        runQuery({email: {$regex: /^Gmail\.com/i}})
            .should.eql('select * from `posts` where lower(`posts`.`email`) like \'gmail.com%\' ESCAPE \'*\'');
    });

    it('can match like with startswith containing a slash', function () {
        runQuery({email: {$regex: /^https:\/\/www.google.com\//i}})
            .should.eql('select * from `posts` where lower(`posts`.`email`) like \'https://www.google.com/%\' ESCAPE \'*\'');
    });

    it('can match like with endswith', function () {
        runQuery({email: {$regex: /Gmail\.com$/i}})
            .should.eql('select * from `posts` where lower(`posts`.`email`) like \'%gmail.com\' ESCAPE \'*\'');
    });

    // % and _ don't have a meaning in regexes, but they do in LIKE, so they should be escaped in the resulting query
    it('correctly escapes _ LIKE special character', function () {
        // Get all posts that contain __GHOST_URL__
        // Since _ is a special character in LIKE, we need to escape it with * (our chosen escape character)
        runQuery({url: {$regex: /__GHOST_URL__/}})
            .should.eql('select * from `posts` where `posts`.`url` like \'%*_*_GHOST*_URL*_*_%\' ESCAPE \'*\'');
    });

    it('correctly escapes % LIKE special character', function () {
        // Get all posts with titles that contain '100%'
        // Since % is a special character in LIKE, we need to escape it with * (our chosen escape character)
        runQuery({title: {$regex: /100%/}})
            .should.eql('select * from `posts` where `posts`.`title` like \'%100*%%\' ESCAPE \'*\'');
    });

    it('correctly escapes * LIKE escape character', function () {
        // Get all posts with titles that contain '*'
        // Since * is the escape character, we need to escape it with itself
        runQuery({title: {$regex: /\*/}})
            .should.eql('select * from `posts` where `posts`.`title` like \'%**%\' ESCAPE \'*\'');
    });
});

describe('Logical Query Operators', function () {
    it('$and (different properties)', function () {
        runQuery({$and: [{featured: false}, {status: 'published'}]})
            .should.eql('select * from `posts` where (`posts`.`featured` = false and `posts`.`status` = \'published\')');
    });

    it('$and (same properties)', function () {
        runQuery({$and: [{featured: false}, {featured: true}]})
            .should.eql('select * from `posts` where (`posts`.`featured` = false and `posts`.`featured` = true)');
    });

    it('$or (different properties)', function () {
        runQuery({$or: [{featured: false}, {status: 'published'}]})
            .should.eql('select * from `posts` where (`posts`.`featured` = false or `posts`.`status` = \'published\')');
    });

    it('$or (same properties)', function () {
        runQuery({$or: [{featured: true}, {featured: false}]})
            .should.eql('select * from `posts` where (`posts`.`featured` = true or `posts`.`featured` = false)');
    });
});

describe('Logical Groups', function () {
    describe('$or', function () {
        it('ungrouped version', function () {
            runQuery({
                $or:
                    [{author: {$ne: 'joe'}},
                        {tags: {$in: ['photo']}},
                        {image: {$ne: null}},
                        {featured: true}]
            })
                .should.eql('select * from `posts` where (`posts`.`author` != \'joe\' or `posts`.`tags` in (\'photo\') or `posts`.`image` is not null or `posts`.`featured` = true)');
        });

        it('RIGHT grouped version', function () {
            runQuery({
                $or:
                    [{author: {$ne: 'joe'}},
                        {
                            $or:
                                [{tags: {$in: ['photo']}},
                                    {image: {$ne: null}},
                                    {featured: true}]
                        }]
            })
                .should.eql('select * from `posts` where (`posts`.`author` != \'joe\' or (`posts`.`tags` in (\'photo\') or `posts`.`image` is not null or `posts`.`featured` = true))');
        });

        it('LEFT grouped version', function () {
            runQuery({
                $or:
                    [{
                        $or:
                            [
                                {tags: {$in: ['photo']}},
                                {image: {$ne: null}},
                                {featured: true}]
                    },
                    {author: {$ne: 'joe'}}]
            })
                .should.eql('select * from `posts` where ((`posts`.`tags` in (\'photo\') or `posts`.`image` is not null or `posts`.`featured` = true) or `posts`.`author` != \'joe\')');
        });
    });

    describe('$and', function () {
        it('ungrouped version', function () {
            runQuery({
                $and:
                    [{author: {$ne: 'joe'}},
                        {tags: {$in: ['photo']}},
                        {image: {$ne: null}},
                        {featured: true}]
            })
                .should.eql('select * from `posts` where (`posts`.`author` != \'joe\' and `posts`.`tags` in (\'photo\') and `posts`.`image` is not null and `posts`.`featured` = true)');
        });

        it('RIGHT grouped version', function () {
            runQuery({
                $and:
                    [{author: {$ne: 'joe'}},
                        {
                            $and:
                                [{tags: {$in: ['photo']}},
                                    {image: {$ne: null}},
                                    {featured: true}]
                        }]
            })
                .should.eql('select * from `posts` where (`posts`.`author` != \'joe\' and (`posts`.`tags` in (\'photo\') and `posts`.`image` is not null and `posts`.`featured` = true))');
        });

        it('LEFT grouped version', function () {
            runQuery({
                $and:
                    [{
                        $and:
                            [{tags: {$in: ['photo']}},
                                {image: {$ne: null}},
                                {featured: true}]
                    },
                    {author: {$ne: 'joe'}}]
            })
                .should.eql('select * from `posts` where ((`posts`.`tags` in (\'photo\') and `posts`.`image` is not null and `posts`.`featured` = true) and `posts`.`author` != \'joe\')');
        });
    });

    describe('$or with $and group', function () {
        it('ungrouped version', function () {
            runQuery({
                $or:
                    [{author: {$ne: 'joe'}},
                        {
                            $and:
                                [{tags: {$in: ['photo']}},
                                    {image: {$ne: null}},
                                    {featured: true}]
                        }]
            })
                .should.eql('select * from `posts` where (`posts`.`author` != \'joe\' or (`posts`.`tags` in (\'photo\') and `posts`.`image` is not null and `posts`.`featured` = true))');
        });

        it('RIGHT grouped version', function () {
            runQuery({
                $or:
                    [{author: {$ne: 'joe'}},
                        {
                            $and:
                                [{tags: {$in: ['photo']}},
                                    {image: {$ne: null}},
                                    {featured: true}]
                        }]
            })
                .should.eql('select * from `posts` where (`posts`.`author` != \'joe\' or (`posts`.`tags` in (\'photo\') and `posts`.`image` is not null and `posts`.`featured` = true))');
        });

        it('LEFT grouped version', function () {
            runQuery({
                $or:
                    [{
                        $and:
                            [{tags: {$in: ['photo']}},
                                {image: {$ne: null}},
                                {featured: true}]
                    },
                    {author: {$ne: 'joe'}}]
            })
                .should.eql('select * from `posts` where ((`posts`.`tags` in (\'photo\') and `posts`.`image` is not null and `posts`.`featured` = true) or `posts`.`author` != \'joe\')');
        });
    });

    describe('$and with $or group', function () {
        it('ungrouped version', function () {
            runQuery({
                $or:
                    [{
                        $and:
                            [{author: {$ne: 'joe'}},
                                {tags: {$in: ['photo']}}]
                    },
                    {image: {$ne: null}},
                    {featured: true}]
            })
                .should.eql('select * from `posts` where ((`posts`.`author` != \'joe\' and `posts`.`tags` in (\'photo\')) or `posts`.`image` is not null or `posts`.`featured` = true)');
        });

        it('RIGHT grouped version', function () {
            runQuery({
                $and:
                    [{author: {$ne: 'joe'}},
                        {
                            $or:
                                [{tags: {$in: ['photo']}},
                                    {image: {$ne: null}},
                                    {featured: true}]
                        }]
            })
                .should.eql('select * from `posts` where (`posts`.`author` != \'joe\' and (`posts`.`tags` in (\'photo\') or `posts`.`image` is not null or `posts`.`featured` = true))');
        });

        it('LEFT grouped version', function () {
            runQuery({
                $and:
                    [{
                        $or:
                            [{tags: {$in: ['photo']}},
                                {image: {$ne: null}},
                                {featured: true}]
                    },
                    {author: {$ne: 'joe'}}]
            })
                .should.eql('select * from `posts` where ((`posts`.`tags` in (\'photo\') or `posts`.`image` is not null or `posts`.`featured` = true) and `posts`.`author` != \'joe\')');
        });
    });
});

describe('Relations', function () {
    it('should be able to perform query on a many-to-many relation', function () {
        runQuery({'tags.slug': 'fred'})
            .should.eql('select * from `posts` where `posts`.`id` in (select `posts_tags`.`post_id` from `posts_tags` inner join `tags` on `tags`.`id` = `posts_tags`.`tag_id` where `tags`.`slug` = \'fred\')');
    });

    it('should be able to perform NULL query on a many-to-many relation', function () {
        runQuery({'tags.slug': null})
            .should.eql('select * from `posts` where `posts`.`id` in (select `posts_tags`.`post_id` from `posts_tags` inner join `tags` on `tags`.`id` = `posts_tags`.`tag_id` where `tags`.`slug` is null)');
    });

    it('should be able to perform NULL query on a many-to-many relation with left join', function () {
        runQuery({'optional_tags.slug': null})
            .should.eql('select * from `posts` where `posts`.`id` in (select `posts_tags`.`post_id` from `posts_tags` left join `optional_tags` on `optional_tags`.`id` = `posts_tags`.`tag_id` where `optional_tags`.`slug` is null)');
    });

    it('should be able to perform a negated query on a many-to-many relation (works but is weird)', function () {
        runQuery({'tags.slug': {$ne: 'fred'}})
            .should.eql('select * from `posts` where `posts`.`id` not in (select `posts_tags`.`post_id` from `posts_tags` inner join `tags` on `tags`.`id` = `posts_tags`.`tag_id` where `tags`.`slug` in (\'fred\'))');
    });

    // This case doesn't work
    it.skip('should be able to perform a query on a many-to-many join table alone', function () {
        runQuery({'posts_tags.sort_order': 0});
    });

    it('should be able to perform a query on a many-to-many join table and its relation', function () {
        runQuery({
            $and: [
                {
                    'tags.slug': 'cgi'
                },
                {
                    'posts_tags.sort_order': 0
                }
            ]
        })
            .should.eql('select * from `posts` where (`posts`.`id` in (select `posts_tags`.`post_id` from `posts_tags` inner join `tags` on `tags`.`id` = `posts_tags`.`tag_id` and `posts_tags`.`sort_order` = 0 where `tags`.`slug` = \'cgi\'))');
    });

    it('should be able to perform a query on a one-to-one relation', function () {
        runQuery({'posts_meta.meta_title': 'Meta of A Whole New World'})
            .should.eql('select * from `posts` where `posts`.`id` in (select `posts`.`id` from `posts` left join `posts_meta` on `posts_meta`.`post_id` = `posts`.`id` where `posts_meta`.`meta_title` = \'Meta of A Whole New World\')');
    });

    it('should be able to perform a negated query on a one-to-one relation (works but is weird)', function () {
        runQuery({'posts_meta.meta_title': {$ne: 'Meta of A Whole New World'}})
            .should.eql('select * from `posts` where `posts`.`id` not in (select `posts`.`id` from `posts` left join `posts_meta` on `posts_meta`.`post_id` = `posts`.`id` where `posts_meta`.`meta_title` in (\'Meta of A Whole New World\'))');
    });
});

describe('RegExp/Like queries', function () {
    it('are well behaved', function () {
        runQuery({title: {$regex: /'/i}})
            .should.eql('select * from `posts` where lower(`posts`.`title`) like \'%\\\'%\' ESCAPE \'*\'');

        runQuery({title: {$regex: /;/i}})
            .should.eql('select * from `posts` where lower(`posts`.`title`) like \'%;%\' ESCAPE \'*\'');

        runQuery({title: {$regex: /';select * from `settings` where `value` like '/i}})
            .should.eql('select * from `posts` where lower(`posts`.`title`) like \'%\\\';select ** from `settings` where `value` like \\\'%\' ESCAPE \'*\'');
    });
});
