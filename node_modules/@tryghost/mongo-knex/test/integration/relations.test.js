const _ = require('lodash');
const utils = require('../utils');
const knex = utils.db.client;

const convertor = require('../../lib/convertor');

/* eslint-disable no-console*/

// @TODO: the config object is not designed yet.
const makeQuery = (mongoJSON) => {
    const query = convertor(knex('posts'), mongoJSON, {
        relations: {
            tags: {
                tableName: 'tags',
                type: 'manyToMany',
                joinTable: 'posts_tags',
                joinFrom: 'post_id',
                joinTo: 'tag_id'
            },
            authors: {
                tableName: 'users',
                tableNameAs: 'authors',
                type: 'manyToMany',
                joinTable: 'posts_authors',
                joinFrom: 'post_id',
                joinTo: 'author_id'
            },
            posts_meta: {
                tableName: 'posts_meta',
                type: 'oneToOne',
                joinFrom: 'post_id'
            },
            comments: {
                tableName: 'comments',
                type: 'manyToMany',
                joinTable: 'posts_comments',
                joinFrom: 'post_id',
                joinTo: 'comment_id',
                joinToForeign: 'comment_provider_id'
            }
        }
    });

    query.orderBy('id', 'ASC');

    return query;
};

// Integration tests build a test database and
// check that we get the exact data we expect from each query
describe('Relations', function () {
    before(async function () {
        await utils.db.teardown()();
        await utils.db.setup()();
    });
    after(utils.db.teardown());

    describe('Many-to-Many', function () {
        before(utils.db.init('many-to-many'));

        describe('joinToForeign', function () {
            it('Allows you to join an a customer foreign key in the resulting row', function () {
                const mongoJSON = {
                    'comments.content': 'Hello, world'
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(1);
                        result.should.matchIds([1]);
                    });
            });
        });

        describe('EQUALS $eq', function () {
            it('tags.slug equals "animal"', function () {
                const mongoJSON = {
                    'tags.slug': 'animal'
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(3);
                        result.should.matchIds([2, 4, 6]);
                    });
            });

            it('tags.visibility equals "internal"', function () {
                const mongoJSON = {
                    'tags.visibility': 'internal'
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(1);
                        result.should.matchIds([8]);
                    });
            });
        });

        describe('NEGATION $ne', function () {
            // should return posts without tags
            // if a post has more than 1 tag, if one tag is animal, do not return
            it('tags.slug is NOT "animal"', function () {
                const mongoJSON = {
                    'tags.slug': {
                        $ne: 'animal'
                    }
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(5);
                        result.should.matchIds([1, 3, 5, 7, 8]);
                    });
            });

            it('tags.visibility is NOT "public"', function () {
                const mongoJSON = {
                    'tags.visibility': {
                        $ne: 'public'
                    }
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(2);
                        result.should.matchIds([7, 8]);
                    });
            });
        });

        describe('COMPARISONS $gt / $gte / $lt / $lte', function () {
            it('tags.created_at is > 2015-06-21', function () {
                const mongoJSON = {'tags.created_at': {
                    $gt: '2015-06-21'
                }};

                const query = makeQuery(mongoJSON);

                return query
                    .then((result) => {
                        result.length.should.eql(1);
                        result.should.matchIds([8]);
                    });
            });

            it('tags.created_at is >= 2015-06-21', function () {
                const mongoJSON = {'tags.created_at': {
                    $gte: '2015-06-21'
                }};

                const query = makeQuery(mongoJSON);

                return query
                    .then((result) => {
                        result.length.should.eql(2);
                        result.should.matchIds([3, 8]);
                    });
            });

            it('tags.created_at is < 2015-01-02', function () {
                const mongoJSON = {'tags.created_at': {
                    $lt: '2015-01-02'
                }};

                const query = makeQuery(mongoJSON);

                return query
                    .then((result) => {
                        result.length.should.eql(4);
                        result.should.matchIds([1, 4, 5, 6]);
                    });
            });

            it('tags.created_at is <= 2015-01-02', function () {
                const mongoJSON = {'tags.created_at': {
                    $lte: '2015-01-02'
                }};

                const query = makeQuery(mongoJSON);

                return query
                    .then((result) => {
                        result.length.should.eql(5);
                        result.should.matchIds([1, 2, 4, 5, 6]);
                    });
            });
        });

        describe('AND $and', function () {
            it('tags.slug is animal and classic', function () {
                const mongoJSON = {
                    $and: [
                        {
                            'tags.slug': 'animal'
                        },
                        {
                            'tags.slug': 'classic'
                        }
                    ]
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(2);
                        result.should.matchIds([4, 6]);
                    });
            });

            it('tags.slug is hash-internal and tags.visibility is private', function () {
                const mongoJSON = {
                    $and: [
                        {
                            'tags.slug': 'hash-internal'
                        },
                        {
                            'tags.visibility': 'internal'
                        }
                    ]
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(1);
                        result.should.matchIds([8]);
                    });
            });

            it('tags.slug is animal and tags.slug NOT in [classic]', function () {
                const mongoJSON = {
                    $and: [
                        {
                            'tags.slug': 'animal'
                        },
                        {
                            'tags.slug': {
                                $nin: ['classic']
                            }
                        }
                    ]
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(1);
                        result.should.matchIds([2]);
                    });
            });

            it('tags.slug is animal and sort_order is 0', function () {
                const mongoJSON = {
                    $and: [
                        {
                            'tags.slug': 'animal'
                        },
                        {
                            'posts_tags.sort_order': 0
                        }
                    ]
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(1);
                        result.should.matchIds([2]);
                    });
            });

            it('(tags.slug is animal and sort_order is 0) and tags.visibility=public', function () {
                const mongoJSON = {
                    $and: [
                        {
                            $and: [
                                {
                                    'tags.slug': 'animal'
                                },
                                {
                                    'posts_tags.sort_order': 0
                                }
                            ]
                        },
                        {
                            'tags.visibility': 'public'
                        }
                    ]
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(1);
                        result.should.matchIds([2]);
                    });
            });

            it('tags.slug is animal and sort_order is 0 and tags.visibility=public', function () {
                const mongoJSON = {
                    $and: [
                        {
                            'tags.slug': 'animal'
                        },
                        {
                            'posts_tags.sort_order': 0
                        },
                        {
                            'tags.visibility': 'public'
                        }
                    ]
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(1);
                        result.should.matchIds([2]);
                    });
            });

            it('tags.slug is NOT animal and tags.slug is NOT cgi', function () {
                // equivalent to $nin: ['animal', 'cgi']
                const mongoJSON = {
                    $and: [
                        {
                            'tags.slug': {
                                $ne: 'animal'
                            }
                        },
                        {
                            'tags.slug': {
                                $ne: 'cgi'
                            }
                        }
                    ]
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(4);
                        result.should.matchIds([1, 5, 7, 8]);
                    });
            });

            it('tags.slug NOT equal "classic" and tags.visibility is equal "public"', function () {
                const mongoJSON = {
                    'tags.visibility': 'public',
                    'tags.slug': {
                        $ne: 'classic'
                    }
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(2);
                        result.should.matchIds([2, 3]);
                    });
            });

            it('tags.slug NOT IN ["classic"] and tags.visibility is equal "public"', function () {
                const mongoJSON = {
                    'tags.visibility': 'public',
                    'tags.slug': {
                        $nin: ['classic']
                    }
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(2);
                        result.should.matchIds([2, 3]);
                    });
            });

            it('(tags.slug NOT  IN "classic" and tags.visibility is equal "public")', function () {
                // this case can be generated with:
                // 'tags.slug:-classic+tags.visibility:public'
                const mongoJSON = {
                    $and: [
                        {
                            'tags.visibility': 'public'
                        },
                        {
                            'tags.slug': {
                                $nin: ['classic']
                            }
                        }
                    ]
                };

                const query = makeQuery(mongoJSON);

                // NOTE: this query is generating a group, this should be avoided
                // as we can't group negated properties with other, unless those
                // are going through connecting table
                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(2);
                        result.should.matchIds([2, 3]);
                    });
            });

            it('any author is pat and any tag is classic (query on multiple relations)', function () {
                const mongoJSON = {
                    $and: [
                        {
                            'authors.slug': 'pat'
                        },
                        {
                            'tags.slug': 'classic'
                        }
                    ]
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(4);
                        result.should.matchIds([1, 4, 5, 6]);
                    });
            });

            it('first author is pat and first tag is classic (query on multiple relations)', function () {
                const mongoJSON = {
                    $and: [
                        {
                            $and: [
                                {
                                    'tags.slug': 'classic'
                                },
                                {
                                    'posts_tags.sort_order': 0
                                }
                            ]
                        },
                        {
                            $and: [
                                {
                                    'authors.slug': 'pat'
                                },
                                {
                                    'posts_authors.sort_order': 0
                                }
                            ]
                        }
                    ]
                };
                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(3);
                        result.should.matchIds([1, 5, 6]);
                    });
            });

            describe('Multiple conditions applied to the joining table and to the destination table', function () {
                it('tags.slug equals "cgi" and posts_tags.sort_order is 0 and featured is true', function () {
                    // where primary tag is "cgi"
                    const mongoJSON = {
                        $and: [
                            {
                                $and: [
                                    {
                                        'tags.slug': 'cgi'
                                    },
                                    {
                                        'posts_tags.sort_order': 0
                                    }
                                ]

                            },
                            {
                                featured: true
                            }
                        ]
                    };

                    const query = makeQuery(mongoJSON);

                    return query
                        .select()
                        .then((result) => {
                            result.should.be.an.Array().with.lengthOf(1);
                            result.should.matchIds([3]);
                        });
                });

                it('tags.slug equals "animal" and posts_tags.sort_order is 0 and featured is false', function () {
                    // where primary tag is "animal"
                    const mongoJSON = {
                        $and: [
                            {
                                $and: [
                                    {
                                        'tags.slug': 'animal'
                                    },
                                    {
                                        'posts_tags.sort_order': 0
                                    }
                                ]
                            },
                            {
                                featured: false
                            }
                        ]
                    };

                    const query = makeQuery(mongoJSON);

                    return query
                        .select()
                        .then((result) => {
                            result.should.be.an.Array().with.lengthOf(1);
                            result.should.matchIds([2]);
                        });
                });

                it('tags.slug NOT equal "classic" and posts_tags.sort_order is 0 and featured is true', function () {
                    const mongoJSON = {
                        $and: [
                            {
                                $and: [
                                    {
                                        'tags.slug': {
                                            $ne: 'classic'
                                        }
                                    },
                                    {
                                        'posts_tags.sort_order': 0
                                    }
                                ]
                            },
                            {
                                featured: true
                            }
                        ]
                    };

                    const query = makeQuery(mongoJSON);

                    return query
                        .select()
                        .then((result) => {
                            // @NOTE: This should return posts without tags, because a post without tags is not tagged
                            //        with the primary tag "classic".
                            result.should.be.an.Array().with.lengthOf(3);
                            result.should.matchIds([3, 7, 8]);
                        });
                });
            });
        });

        describe('OR $or', function () {
            it('any author is pat or leslie', function () {
                const mongoJSON = {
                    $or: [
                        {
                            'authors.slug': 'leslie'
                        },
                        {
                            'authors.slug': 'pat'
                        }
                    ]
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(7);
                        result.should.matchIds([1, 3, 4, 5, 6, 7, 8]);
                    });
            });

            it('any author is sam or any tag is cgi', function () {
                const mongoJSON = {
                    $or: [
                        {
                            'authors.slug': 'sam'
                        },
                        {
                            'tags.slug': 'cgi'
                        }
                    ]
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(4);
                        result.should.matchIds([2, 3, 4, 8]);
                    });
            });

            it('any author is not pat or any tag is in [animal]', function () {
                const mongoJSON = {
                    $or: [
                        {
                            'authors.slug': {
                                $ne: 'pat'
                            }
                        },
                        {
                            'tags.slug': {
                                $in: ['animal']
                            }
                        }
                    ]
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(4);
                        result.should.matchIds([2, 4, 6, 8]);
                    });
            });

            it('any author is pat or leslie or lots of other do not collide when grouping', function () {
                const mongoJSON = {
                    $or: [
                        {
                            'authors.slug': 'leslie'
                        },
                        {
                            'authors.slug': 'pat'
                        }
                    ]
                };

                _.times(100, (idx) => {
                    const author = {'authors.slug': `author-${idx}`};
                    mongoJSON.$or.push(author);
                });

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(7);
                        result.should.matchIds([1, 3, 4, 5, 6, 7, 8]);
                    });
            });

            describe('Multiple conditions applied to the joining table and to the destination table', function () {
                it('tags.slug equals "animal" and posts_tags.sort_order is 0 OR author_id is 1', function () {
                    const mongoJSON = {
                        $or: [
                            {
                                $and: [
                                    {
                                        'tags.slug': 'animal'
                                    },
                                    {
                                        'posts_tags.sort_order': 0
                                    },
                                    {
                                        featured: false
                                    }
                                ]
                            },
                            {
                                author_id: 1
                            }
                        ]
                    };

                    const query = makeQuery(mongoJSON);

                    return query
                        .select()
                        .then((result) => {
                            result.should.be.an.Array().with.lengthOf(6);
                            result.should.matchIds([1, 2, 3, 5, 6, 7]);
                        });
                });

                it('(tags.slug = animal and sort_order = 0) OR visibility:internal', function () {
                    const mongoJSON = {
                        $or: [
                            {
                                $and: [
                                    {
                                        'tags.slug': 'animal'
                                    },
                                    {
                                        'posts_tags.sort_order': 0
                                    }
                                ]
                            },
                            {
                                'tags.visibility': 'internal'
                            }
                        ]
                    };

                    const query = makeQuery(mongoJSON);

                    return query
                        .select()
                        .then((result) => {
                            result.should.be.an.Array().with.lengthOf(2);
                            result.should.matchIds([2, 8]);
                        });
                });

                it('tags.slug = animal OR sort_order = 0 OR visibility:internal', function () {
                    const mongoJSON = {
                        $or: [
                            {
                                'tags.slug': 'animal'
                            },
                            {
                                'posts_tags.sort_order': 0
                            },
                            {
                                'tags.visibility': 'internal'
                            }
                        ]
                    };

                    const query = makeQuery(mongoJSON);

                    return query
                        .select()
                        .then((result) => {
                            result.should.be.an.Array().with.lengthOf(7);
                            result.should.matchIds([1, 2, 3, 4, 5, 6, 8]);
                        });
                });
            });
        });

        describe('IN $in', function () {
            it('tags.slug IN (animal)', function () {
                const mongoJSON = {
                    'tags.slug': {
                        $in: ['animal']
                    }
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(3);
                        result.should.matchIds([2, 4, 6]);
                    });
            });

            it('tags.slug IN (animal, cgi)', function () {
                const mongoJSON = {
                    'tags.slug': {
                        $in: ['animal', 'cgi']
                    }
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(4);
                        result.should.matchIds([2, 3, 4, 6]);
                    });
            });

            it('tags.id IN (2,3)', function () {
                const mongoJSON = {
                    'tags.id': {
                        $in: [2, 3]
                    }
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(4);
                        result.should.matchIds([2, 3, 4, 6]);
                    });
            });

            it('tags.slug IN (animal) AND featured:true', function () {
                const mongoJSON = {
                    $and: [
                        {
                            'tags.slug': {
                                $in: ['animal']
                            }
                        },
                        {
                            featured: true
                        }
                    ]
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(2);
                        result.should.matchIds([4, 6]);
                    });
            });
        });

        describe('NOT IN $nin', function () {
            it('tags.slug NOT IN (animal)', function () {
                const mongoJSON = {
                    'tags.slug': {
                        $nin: ['animal']
                    }
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(5);
                        result.should.matchIds([1, 3, 5, 7, 8]);
                    });
            });

            it('tags.slug NOT IN (animal, cgi)', function () {
                const mongoJSON = {
                    'tags.slug': {
                        $nin: ['animal', 'cgi']
                    }
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(4);
                        result.should.matchIds([1, 5, 7, 8]);
                    });
            });

            it('tags.id NOT IN (2,3)', function () {
                const mongoJSON = {
                    'tags.id': {
                        $nin: [2, 3]
                    }
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(4);
                        result.should.matchIds([1, 5, 7, 8]);
                    });
            });

            it('tags.slug NOT IN (classic, animal) AND featured:true', function () {
                const mongoJSON = {
                    $and: [
                        {
                            'tags.slug': {
                                $nin: ['classic', 'animal']
                            }
                        },
                        {
                            featured: true
                        }
                    ]
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(3);
                        result.should.matchIds([3, 7, 8]);
                    });
            });
        });

        describe('COUNT', function () {
            it.skip('can compare by count $gt', function () {
                const mongoJSON = {
                    'authors.count': {$gt: 0}
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(3);
                    });
            });

            it.skip('can compare by count $lt', function () {
                const mongoJSON = {
                    'authors.count': {$lt: 2}
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(3);
                    });
            });
        });
    });

    describe('One-to-One', function () {
        describe('EQUALS $eq', function () {
            it('posts_meta.meta_title equals "Meta of A Whole New World"', function () {
                const mongoJSON = {
                    'posts_meta.meta_title': 'Meta of A Whole New World'
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(1);
                        result[0].title.should.equal('A Whole New World');
                    });
            });
        });

        describe('NEGATION $ne', function () {
            it('posts_meta.meta_title not equal "Meta of A Whole New World"', function () {
                const mongoJSON = {
                    'posts_meta.meta_title': {
                        $ne: 'Meta of A Whole New World'
                    }
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        // result should also contain records that do not have meta_title record - null
                        result.should.matchIds([2, 3, 4, 5, 6, 7, 8]);
                        result.forEach((post) => {
                            'A Whole New World'.should.not.equal(post.title);
                        });
                    });
            });

            it('posts_meta.meta_title not equal null', function () {
                const mongoJSON = {
                    'posts_meta.meta_title': {
                        $ne: null
                    }
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.matchIds([1, 4, 5]);
                    });
            });

            it('posts_meta.meta_title not equal null and featured is false', function () {
                const mongoJSON = {
                    'posts_meta.meta_title': {
                        $ne: null
                    },
                    featured: false
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.matchIds([1]);
                    });
            });
        });

        describe('COMPARISONS $gt / $gte / $lt / $lte', function () {
            it('posts_meta.like_count is > 10', function () {
                const mongoJSON = {'posts_meta.like_count': {
                    $gt: 10
                }};

                const query = makeQuery(mongoJSON);

                return query
                    .then((result) => {
                        result.length.should.eql(2);
                        result.should.matchIds([4, 5]);
                    });
            });

            it('posts_meta.like_count is >= 10', function () {
                const mongoJSON = {'posts_meta.like_count': {
                    $gte: '10'
                }};

                const query = makeQuery(mongoJSON);

                return query
                    .then((result) => {
                        result.length.should.eql(3);
                        result.should.matchIds([1, 4, 5]);
                    });
            });

            it('posts_meta.like_count is < 42', function () {
                const mongoJSON = {'posts_meta.like_count': {
                    $lt: '42'
                }};

                const query = makeQuery(mongoJSON);

                return query
                    .then((result) => {
                        result.length.should.eql(1);
                        result.should.matchIds([1]);
                    });
            });

            it('posts_meta.like_count is <= 42', function () {
                const mongoJSON = {'posts_meta.like_count': {
                    $lte: '42'
                }};

                const query = makeQuery(mongoJSON);

                return query
                    .then((result) => {
                        result.length.should.eql(3);
                        result.should.matchIds([1, 4, 5]);
                    });
            });
        });

        describe('AND $and', function () {
            it('basic', function () {
                const mongoJSON = {
                    $and: [
                        {
                            'posts_meta.like_count': 42
                        },
                        {
                            'posts_meta.meta_title': 'Meta of Circle of Life'
                        }
                    ]
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(1);
                        result.should.matchIds([4]);
                    });
            });

            it('gruoped and with negated NOT IN statement', function () {
                const mongoJSON = {
                    $and: [
                        {
                            'posts_meta.like_count': 10
                        },
                        {
                            'posts_meta.meta_title': {
                                $nin: ['Meta of Circle of Life']
                            }
                        }
                    ]
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(1);
                        result.should.matchIds([1]);
                    });
            });

            it('grouped and', function () {
                const mongoJSON = {
                    $and: [
                        {
                            'posts_meta.like_count': 42
                        },
                        {
                            'posts.title': 'Circle of Life'
                        }
                    ]
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(1);
                        result.should.matchIds([4]);
                    });
            });

            it('(nested and on joined table with condition on original table', function () {
                const mongoJSON = {
                    $and: [
                        {
                            $and: [
                                {
                                    'posts_meta.like_count': 42
                                },
                                {
                                    'posts_meta.meta_title': 'Meta of Circle of Life'
                                }
                            ]
                        },
                        {
                            'posts.title': 'Circle of Life'
                        }
                    ]
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(1);
                        result.should.matchIds([4]);
                    });
            });

            it('multiple types of fields form parent and join tables', function () {
                const mongoJSON = {
                    $and: [
                        {
                            'posts_meta.meta_title': 'Meta of Circle of Life'
                        },
                        {
                            'posts.image': null
                        },
                        {
                            'posts_meta.like_count': 42
                        }
                    ]
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(1);
                        result.should.matchIds([4]);
                    });
            });

            it('nested negations', function () {
                // equivalent to $nin: ['animal', 'cgi']
                const mongoJSON = {
                    $and: [
                        {
                            'posts_meta.like_count': {
                                $ne: 777
                            }
                        },
                        {
                            'posts_meta.like_count': {
                                $ne: 42
                            }
                        }
                    ]
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(6);
                        result.should.matchIds([1,2,3,6,7,8]);
                    });
            });

            it('grouped negation', function () {
                const mongoJSON = {
                    'posts_meta.like_count': 42,
                    'posts_meta.meta_title': {
                        $ne: 'Meta of Circle of Life'
                    }
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(1);
                        result.should.matchIds([5]);
                    });
            });

            it('grouped negation with IN', function () {
                const mongoJSON = {
                    'posts_meta.like_count': 42,
                    'posts_meta.meta_description': {
                        $nin: ['Till we find our place nn the path unwinding in the circle the circle of life.']
                    }
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(1);
                        result.should.matchIds([5]);
                    });
            });
        });

        describe('OR $or', function () {
            it('basic case', function () {
                const mongoJSON = {
                    $or: [
                        {
                            'posts_meta.meta_title': 'Meta of Circle of Life'
                        },
                        {
                            'posts_meta.meta_title': 'Meta of Be Our Guest'
                        }
                    ]
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(2);
                        result.should.matchIds([4, 5]);
                    });
            });

            it('different fields', function () {
                const mongoJSON = {
                    $or: [
                        {
                            'posts_meta.meta_title': 'Meta of Circle of Life'
                        },
                        {
                            'posts_meta.like_count': 10
                        }
                    ]
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(2);
                        result.should.matchIds([1, 4]);
                    });
            });

            it('not equal and in grouping', function () {
                const mongoJSON = {
                    $or: [
                        {
                            'posts_meta.like_count': {
                                $ne: 42
                            }
                        },
                        {
                            'posts_meta.meta_description': {
                                $in: [null]
                            }
                        }
                    ]
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(6);
                        result.should.matchIds([1, 2, 3, 6, 7, 8]);
                    });
            });

            it('any author is pat or leslie or lots of other do not collide when grouping', function () {
                const mongoJSON = {
                    $or: [
                        {
                            'posts_meta.meta_title': 'Meta of Circle of Life'
                        },
                        {
                            'posts_meta.meta_title': 'Meta of A Whole New World'
                        }
                    ]
                };

                _.times(100, (idx) => {
                    const condition = {'posts_meta.meta_title': `meta-title-${idx}`};
                    mongoJSON.$or.push(condition);
                });

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(2);
                        result.should.matchIds([1, 4]);
                    });
            });

            describe('Multiple conditions applied to the joining table and to the destination table', function () {
                it('tags.slug equals "animal" and posts_tags.sort_order is 0 OR author_id is 1', function () {
                    const mongoJSON = {
                        $or: [
                            {
                                $and: [
                                    {
                                        'posts_meta.meta_title': 'Meta of Be Our Guest'
                                    },
                                    {
                                        'posts_meta.like_count': 42
                                    }
                                ]
                            },
                            {
                                featured: false
                            }
                        ]
                    };

                    const query = makeQuery(mongoJSON);

                    return query
                        .select()
                        .then((result) => {
                            result.should.be.an.Array().with.lengthOf(3);
                            result.should.matchIds([1, 2, 5]);
                        });
                });
            });
        });

        describe('IN $in', function () {
            it('basic case', function () {
                const mongoJSON = {
                    'posts_meta.like_count': {
                        $in: [42]
                    }
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(2);
                        result.should.matchIds([4, 5]);
                    });
            });

            it('multipe parameters', function () {
                const mongoJSON = {
                    'posts_meta.like_count': {
                        $in: [42, 11]
                    }
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(2);
                        result.should.matchIds([4, 5]);
                    });
            });

            it('combination with other fields', function () {
                const mongoJSON = {
                    $and: [
                        {
                            'posts_meta.like_count': {
                                $in: [10]
                            }
                        },
                        {
                            title: 'A Whole New World'
                        }
                    ]
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(1);
                        result.should.matchIds([1]);
                    });
            });
        });

        describe('NOT IN $nin', function () {
            it('basic case', function () {
                const mongoJSON = {
                    'posts_meta.like_count': {
                        $nin: [42]
                    }
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(6);
                        result.should.matchIds([1, 2, 3, 6, 7, 8]);
                    });
            });

            it('multiple values', function () {
                const mongoJSON = {
                    'posts_meta.like_count': {
                        $nin: [42, 10]
                    }
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(5);
                        result.should.matchIds([2, 3, 6, 7, 8]);
                    });
            });

            it('multiple values with filter on parent table', function () {
                const mongoJSON = {
                    $and: [
                        {
                            'posts_meta.like_count': {
                                $nin: [42]
                            }
                        },
                        {
                            featured: false
                        }
                    ]
                };

                const query = makeQuery(mongoJSON);

                return query
                    .select()
                    .then((result) => {
                        result.should.be.an.Array().with.lengthOf(2);
                        result.should.matchIds([1, 2]);
                    });
            });
        });
    });

    describe('[NOT IMPLEMENTED] One-to-Many', function () {});
});
