// Switch these lines once there are useful utils
// const testUtils = require('./utils');
require('./utils');
const mongoUtils = require('../');
const assert = require('assert');

describe('Find statement', function () {
    it('should match with object statement by key', function () {
        const statements = {status: 'published'};

        mongoUtils.findStatement(statements, 'page').should.eql(false);
        mongoUtils.findStatement(statements, 'status').should.eql(true);
        mongoUtils.findStatement(statements, 'tags').should.eql(false);
        mongoUtils.findStatement(statements, 'published').should.eql(false);
    });

    it('should match in object statement array by key', function () {
        const statements = [
            {page: false},
            {status: 'published'}
        ];

        mongoUtils.findStatement(statements, 'page').should.eql(true);
        mongoUtils.findStatement(statements, 'status').should.eql(true);
        mongoUtils.findStatement(statements, 'tags').should.eql(false);
        mongoUtils.findStatement(statements, 'published').should.eql(false);
    });

    describe('nested $and/$or groups', function () {
        it('should match inside nested $and group', function () {
            const statements = {$and: [
                {page: false},
                {status: 'published'}
            ]};

            mongoUtils.findStatement(statements, 'page').should.eql(true);
            mongoUtils.findStatement(statements, 'status').should.eql(true);
            mongoUtils.findStatement(statements, 'tags').should.eql(false);
            mongoUtils.findStatement(statements, 'published').should.eql(false);
        });

        it('should match inside nested $or group', function () {
            const statements = {$or: [
                {page: false},
                {status: 'published'}
            ]};

            mongoUtils.findStatement(statements, 'page').should.eql(true);
            mongoUtils.findStatement(statements, 'status').should.eql(true);
            mongoUtils.findStatement(statements, 'tags').should.eql(false);
            mongoUtils.findStatement(statements, 'published').should.eql(false);
        });
    });
});

describe('Reject statements', function () {
    let rejectStatements;
    let testFunction;

    beforeEach(function () {
        rejectStatements = mongoUtils.rejectStatements;

        testFunction = (statements) => {
            return (match) => {
                return mongoUtils.findStatement(statements, match);
            };
        };
    });

    it('should reject from a simple object', function () {
        const statements = {featured: true};
        const filter = {featured: false};

        rejectStatements(statements, testFunction(filter))
            .should.eql({});
    });

    it('should NOT reject from a simple object when not matching', function () {
        const statements = {featured: true};
        const filter = {status: 'published'};

        rejectStatements(statements, testFunction(filter))
            .should.eql({featured: true});
    });

    it('returns filter intact if it is empty', function () {
        const statements = null;
        const filter = {featured: true};

        const output = rejectStatements(statements, testFunction(filter));

        should.equal(output, null);
    });

    it('rejects statements that match in filter in $or group', function () {
        const statements = {$or: [{
            featured: false
        }, {
            status: 'published'
        }]};

        const filter = {
            featured: true
        };

        const output = {$or: [{
            status: 'published'
        }]};

        rejectStatements(statements, testFunction(filter)).should.eql(output);
    });

    it('should remove group if all statements are removed', function () {
        const statements = {$or: [{
            featured: false
        }]};

        const filter = {
            featured: true
        };

        const output = {};

        rejectStatements(statements, testFunction(filter)).should.eql(output);
    });

    it('reduces statements if key matches with any keys in $and group', function () {
        const statements = {$or: [
            {page: false},
            {author: 'cameron'}
        ]};

        const filter = {$and: [
            {tag: 'photo'},
            {page: true}
        ]};

        const output = {$or: [
            {author: 'cameron'}
        ]};

        rejectStatements(statements, testFunction(filter)).should.eql(output);
    });

    it('should reject statements that are nested multiple levels', function () {
        const statements = {$and: [
            {$or: [
                {tag: {
                    $in: ['photo','video']
                }},
                {author: 'cameron'},
                {status: 'draft'}
            ]},
            {$and: [
                {status: 'draft'},
                {page: true}
            ]}
        ]};

        const filter = {status: 'published'};

        const output = {$and: [
            {$or: [
                {tag: {
                    $in: ['photo','video']
                }},
                {author: 'cameron'}
            ]},
            {$and: [
                {page: true}
            ]}
        ]};

        rejectStatements(statements, testFunction(filter)).should.eql(output);
    });
});

describe('Combine Filters', function () {
    let combineFilters;

    beforeEach(function () {
        combineFilters = mongoUtils.combineFilters;
    });

    it('should return nothing when no filters are passed in', function () {
        should.equal(combineFilters(undefined, undefined), undefined);
    });

    it('should return unmodified primary filter when secondary is not passed in', function () {
        combineFilters({status: 'published'}).should.eql({status: 'published'});
    });

    it('should return unmodified secondary filter when primary is not defined in', function () {
        combineFilters(undefined, {status: 'published'}).should.eql({status: 'published'});
    });

    it('should combine two filters in $and statement', function () {
        combineFilters({page: true}, {status: 'published'}).should.eql({
            $and: [
                {page: true},
                {status: 'published'}
            ]
        });
    });
});

describe('Merge filters', function () {
    it('should return empty statement object when there are no filters', function () {
        mongoUtils.mergeFilters().should.eql({});
    });

    describe('single filters', function () {
        it('should return only overrides filter when it is passed', function () {
            const input = {
                overrides: {status: 'published'}
            };

            const output = {
                status: 'published'
            };

            mongoUtils.mergeFilters(input.overrides).should.eql(output);
        });

        it('should return only default filter when it is passed', function () {
            const input = {
                defaults: {status: 'published'}
            };

            const output = {
                status: 'published'
            };

            mongoUtils.mergeFilters(input.defaults).should.eql(output);
        });

        it('should return only custom filter when it is passed', function () {
            const input = {
                custom: {status: 'published'}
            };

            const output = {
                status: 'published'
            };

            mongoUtils.mergeFilters(input.custom).should.eql(output);
        });
    });

    describe('combination of filters', function () {
        it('should merge overrides and default filters if both are provided', function () {
            const input = {
                overrides: {status: 'published'},
                defaults: {page: false}
            };
            const output = {$and: [
                {status: 'published'},
                {page: false}
            ]};

            mongoUtils.mergeFilters(input.overrides, input.defaults).should.eql(output);
        });

        it('should combine custom and overrides filters', function () {
            const input = {
                overrides: {status: 'published'},
                custom: {tag: 'photo'}
            };
            const output = {$and: [
                {status: 'published'},
                {tag: 'photo'}
            ]};

            mongoUtils.mergeFilters(input.overrides, input.custom).should.eql(output);
        });

        it('should remove custom filters if matches overrides', function () {
            const input = {
                overrides: {status: 'published'},
                custom: {status: 'draft'}
            };
            const output = {status: 'published'};

            mongoUtils.mergeFilters(input.overrides, input.custom).should.eql(output);
        });

        it('should reduce custom filters if any matches overrides', function () {
            const input = {
                overrides: {status: 'published'},
                custom: {$or: [
                    {tag: 'photo'},
                    {status: 'draft'}
                ]}
            };
            const output = {$and: [
                {status: 'published'},
                {$or: [
                    {tag: 'photo'}
                ]}
            ]};

            mongoUtils.mergeFilters(input.overrides, input.custom).should.eql(output);
        });

        it('should combine default filters if default and custom are provided', function () {
            const input = {
                defaults: {page: false},
                custom: {tag: 'photo'}
            };
            const output = {$and: [
                {tag: 'photo'},
                {page: false}
            ]};

            mongoUtils.mergeFilters(input.custom, input.defaults).should.eql(output);
        });

        it('should reduce default filters if default and custom are same', function () {
            const input = {
                defaults: {page: false},
                custom: {page: true}
            };
            const output = {page: true};

            mongoUtils.mergeFilters(input.custom, input.defaults).should.eql(output);
        });

        it('should match nested $and with a key inside primary filter', function () {
            const input = {
                defaults: {
                    $and: [
                        {page: false},
                        {status: 'published'}
                    ]
                },
                custom: {
                    page: {
                        $in: [false,true]
                    }
                }
            };
            const output = {$and: [
                {page: {
                    $in: [false,true]
                }},
                {$and: [
                    {status: 'published'}
                ]}
            ]};

            mongoUtils.mergeFilters(input.custom, input.defaults).should.eql(output);
        });

        it('should reduce default filters if default and custom overlap', function () {
            const input = {
                defaults: {$or: [
                    {page: false},
                    {author: 'cameron'}
                ]},
                custom: {$and: [
                    {tag: 'photo'},
                    {page: true}
                ]}
            };
            const output = {$and: [
                {$and: [
                    {tag: 'photo'},
                    {page: true}
                ]},
                {$or: [
                    {author: 'cameron'}
                ]}
            ]};

            mongoUtils.mergeFilters(input.custom, input.defaults).should.eql(output);
        });

        it('should return a merger of overrides and defaults plus custom filters if provided', function () {
            const input = {
                overrides: {status: 'published'},
                defaults: {page: false},
                custom: {tag: 'photo'}
            };
            const output = {$and: [
                {$and: [
                    {status: 'published'},
                    {tag: 'photo'}
                ]},
                {page: false}
            ]};

            mongoUtils.mergeFilters(input.overrides, input.custom, input.defaults).should.eql(output);
        });

        it('should handle getting overrides, default and multiple custom filters', function () {
            const input = {
                overrides: {status: 'published'},
                defaults: {page: true},
                custom: {$or: [
                    {tag: {
                        $in: ['photo','video']
                    }},
                    {author: 'cameron'}
                ]}
            };

            const output = {$and: [
                {
                    $and: [
                        {
                            status: 'published'
                        },
                        {
                            $or: [
                                {
                                    tag: {$in: ['photo','video']}
                                },
                                {
                                    author: 'cameron'
                                }
                            ]
                        }
                    ]
                },
                {
                    page: true
                }
            ]};

            mongoUtils.mergeFilters(input.overrides, input.custom, input.defaults).should.eql(output);
        });

        it('combination of all filters', function () {
            const input = {
                overrides: {featured: true},
                defaults: {page: false},
                custom: {status: {$in: ['draft','published']}}
            };
            const output = {$and: [
                {$and: [
                    {featured: true},
                    {
                        status: {
                            $in: ['draft', 'published']
                        }
                    }
                ]},
                {page: false}
            ]};

            mongoUtils.mergeFilters(input.overrides, input.custom, input.defaults).should.eql(output);
        });

        it('does not match incorrect custom filters', function () {
            const input = {
                overrides: {status: 'published'},
                defaults: {page: false},
                custom: {$or: [
                    {page: true},
                    {statusstatus: ':5Bdraft%2Cpublished%5D'}
                ]}
            };
            const output = {$and: [
                {status: 'published'},
                {$or: [
                    {page: true},
                    {statusstatus: ':5Bdraft%2Cpublished%5D'}
                ]}
            ]};

            mongoUtils.mergeFilters(input.overrides, input.custom, input.defaults).should.eql(output);
        });
    });
});

describe('Expand filters', function () {
    let expandFilters;

    beforeEach(function () {
        expandFilters = mongoUtils.expandFilters;
    });

    it('should return unchanged filter when no expansions match', function () {
        expandFilters({status: 'published'}, []).should.eql({status: 'published'});
    });

    it('should substitute single alias without expansion', function () {
        const filter = {primary_tag: 'en'};
        const expansions = [{
            key: 'primary_tag',
            replacement: 'tags.slug'
        }];

        const processed = {'tags.slug': 'en'};

        expandFilters(filter, expansions).should.eql(processed);
    });

    it('should substitute single alias', function () {
        const filter = {primary_tag: 'en'};
        const expansions = [{
            key: 'primary_tag',
            replacement: 'tags.slug',
            expansion: {order: 0}
        }];

        const processed = {$and: [
            {'tags.slug': 'en'},
            {order: 0}
        ]};

        expandFilters(filter, expansions).should.eql(processed);
    });

    it('should substitute single alias with multiple expansions', function () {
        const filter = {primary_tag: 'en'};
        const expansions = [{
            key: 'primary_tag',
            replacement: 'tags.slug',
            expansion: {$and: [{order: 0}, {visibility: 'public'}]}
        }];

        const processed = {$and: [
            {'tags.slug': 'en'},
            {order: 0},
            {visibility: 'public'}
        ]};

        expandFilters(filter, expansions).should.eql(processed);
    });

    it('should substitute filter with negation and - sign', function () {
        const filter = {
            primary_tag: {
                $ne: 'great-movies'
            }
        };
        const expansions = [{
            key: 'primary_tag',
            replacement: 'tags.slug',
            expansion: {order: 0}
        }];

        const processed = {$and: [
            {'tags.slug': {
                $ne: 'great-movies'
            }},
            {order: 0}
        ]};

        expandFilters(filter, expansions).should.eql(processed);
    });

    it('should NOT match similarly named filter keys', function () {
        const filter = {tags: 'hello'};
        const expansions = [{
            key: 'tag',
            replacement: 'tags.slug',
            expansion: {order: 0}
        }];

        const processed = {tags: 'hello'};

        expandFilters(filter, expansions).should.eql(processed);
    });

    it('should substitute IN notation single alias', function () {
        const filter = {primary_tag: {
            $in: ['en', 'es']
        }};
        const expansions = [{
            key: 'primary_tag',
            replacement: 'tags.slug',
            expansion: {order: 0}
        }];

        const processed = {$and: [
            {'tags.slug': {$in: ['en', 'es']}},
            {order: 0}
        ]};

        expandFilters(filter, expansions).should.eql(processed);
    });

    it('should substitute single alias nested in $and statement', function () {
        const filter = {$and: [
            {status: 'published'},
            {featured: true},
            {primary_tag: {$in: ['en', 'es']}}
        ]};
        const expansions = [{
            key: 'primary_tag',
            replacement: 'tags.slug',
            expansion: {order: 0}
        }];

        const processed = {$and: [
            {status: 'published'},
            {featured: true},
            {$and: [
                {'tags.slug': {$in: ['en', 'es']}},
                {order: 0}]}
        ]};

        expandFilters(filter, expansions).should.eql(processed);
    });

    it('should substitute multiple occurrences of the filter with expansions', function () {
        const filter = {$and: [
            {status: 'published'},
            {primary_tag: 'de'},
            {featured: true},
            {primary_tag: 'en'}
        ]};
        const expansions = [{
            key: 'primary_tag',
            replacement: 'tags.slug',
            expansion: {order: 0}
        }];

        const processed = {$and: [
            {status: 'published'},
            {$and: [
                {'tags.slug': 'de'},
                {order: 0}
            ]},
            {featured: true},
            {$and: [
                {'tags.slug': 'en'},
                {order: 0}
            ]}
        ]};

        expandFilters(filter, expansions).should.eql(processed);
    });

    it('should substitute multiple nested on different levels occurrences', function () {
        const filter = {$and: [
            {status: 'published'},
            {primary_tag: 'de'},
            {featured: true},
            {$or: [
                {primary_tag: 'us'},
                {primary_tag: 'es'}
            ]}
        ], $or: [
            {primary_tag: 'pl'}
        ]};
        const expansions = [{
            key: 'primary_tag',
            replacement: 'tags.slug',
            expansion: {order: 0}
        }];

        const processed = {$and: [
            {status: 'published'},
            {$and: [
                {'tags.slug': 'de'},
                {order: 0}
            ]},
            {featured: true},
            {$or: [
                {$and: [
                    {'tags.slug': 'us'},
                    {order: 0}
                ]},
                {$and: [
                    {'tags.slug': 'es'},
                    {order: 0}
                ]}
            ]}
        ], $or: [
            {$and: [
                {'tags.slug': 'pl'},
                {order: 0}
            ]}
        ]};

        expandFilters(filter, expansions).should.eql(processed);
    });

    it('combine multiple expansions', function () {
        const filter = {$and: [{primary_tag: 'yalla'},{primary_author: 'hulk'}]};

        const expansions = [{
            key: 'primary_tag',
            replacement: 'tags.slug',
            expansion: {order: 0}
        }, {
            key: 'primary_author',
            replacement: 'authors.slug',
            expansion: {order: 0}
        }];

        const processed = {
            $and: [
                {
                    $and: [
                        {
                            'tags.slug': 'yalla'
                        },
                        {
                            order: 0
                        }
                    ]
                },
                {
                    $and: [
                        {
                            'authors.slug': 'hulk'
                        },
                        {
                            order: 0
                        }
                    ]
                }
            ]
        };

        expandFilters(filter, expansions).should.eql(processed);
    });
});

describe('mapQuery', function () {
    it('uses the return value instead of existing value', function () {
        const filter = {
            $and: [{
                hello: 'world'
            }, {
                never: {
                    $ne: 'have i ever'
                }
            }, {
                list: {
                    $in: ['a', 'b']
                }
            }]
        };

        mongoUtils.mapQuery(filter, function (value, key) {
            return {
                [key.toUpperCase()]: value
            };
        }).should.eql({
            $and: [{
                HELLO: 'world'
            }, {
                NEVER: {
                    $ne: 'have i ever'
                }
            }, {
                LIST: {
                    $in: ['a', 'b']
                }
            }]
        });
    });

    it('can modify both key and value', function () {
        const filter = {
            $and: [{
                oh: 'no'
            }, {
                oh: 'yes'
            }, {
                untouched: {
                    $in: ['a', 'b']
                }
            }]
        };

        mongoUtils.mapQuery(filter, function (value, key) {
            if (key === 'oh') {
                if (value === 'no') {
                    return {
                        ['hey']: 'nay'
                    };
                } else if (value === 'yes') {
                    return {
                        ['hey']: 'ay'
                    };
                }
            }

            return {
                [key]: value
            };
        }).should.eql({
            $and: [{
                hey: 'nay'
            }, {
                hey: 'ay'
            }, {
                untouched: {
                    $in: ['a', 'b']
                }
            }]
        });
    });

    it('allows removal of queries by returning undefined', function () {
        const filter = {
            $and: [{
                hello: 'world'
            }, {
                never: {
                    $ne: 'have i ever'
                }
            }, {
                DELETEME: {
                    $in: ['a', 'b']
                }
            }]
        };

        mongoUtils.mapQuery(filter, function (value, key) {
            if (key === 'DELETEME') {
                return;
            }
            return {
                [key]: value
            };
        }).should.eql({
            $and: [{
                hello: 'world'
            }, {
                never: {
                    $ne: 'have i ever'
                }
            }]
        });
    });

    it('allows removal of parents by emptying the children', function () {
        const filter = {
            $and: [{
                hello: 'world'
            }, {
                never: {
                    $ne: 'have i ever'
                }
            }, {
                DELETEME: {
                    $in: ['a', 'b']
                }
            }]
        };

        mongoUtils.mapQuery(filter, function (/*value, key*/) {
            return;
        }).should.eql({
            // EMPTY
        });
    });
});

describe('mapKeyValues', function () {
    it('Is able to replace both keys and values', function () {
        const query = {
            good: true
        };

        const transformer = mongoUtils.mapKeyValues({
            key: {
                from: 'good',
                to: 'bad'
            },
            values: [{
                from: true,
                to: false
            }, {
                from: false,
                to: true
            }]
        });

        transformer(query).should.eql({
            bad: false
        });
    });

    it('Is able to replace nested keys and values', function () {
        const query = {
            $and: [{
                good: {
                    $ne: false
                }
            }, {
                $or: [{
                    something: 'else'
                }, {
                    good: {
                        $ne: true
                    }
                }]
            }]
        };

        const transformer = mongoUtils.mapKeyValues({
            key: {
                from: 'good',
                to: 'bad'
            },
            values: [{
                from: true,
                to: false
            }, {
                from: false,
                to: true
            }]
        });

        transformer(query).should.eql({
            $and: [{
                bad: {
                    $ne: true
                }
            }, {
                $or: [{
                    something: 'else'
                }, {
                    bad: {
                        $ne: false
                    }
                }]
            }]
        });
    });
});

describe('getUsedKeys', function () {
    it('Returns all keys', function () {
        const query = {
            $and: [{
                good: {
                    $ne: false
                }
            }, {
                $or: [{
                    something: 'else',
                    multiple: 'keys'
                }, {
                    other: {
                        $ne: true
                    }
                }]
            }]
        };

        mongoUtils.getUsedKeys(query).should.eql(['good', 'something', 'multiple', 'other']);
    });

    it('Does not return duplicate keys', function () {
        const query = {
            $and: [
                {good: {$ne: false}},
                {good: 'other'}
            ]
        };

        mongoUtils.getUsedKeys(query).should.eql(['good']);
    });

    it('Returns empty array for undefined filters', function () {
        mongoUtils.getUsedKeys().should.eql([]);
    });
});

describe('mapKeys', function () {
    it('Maps multiple keys', function () {
        const query = {
            $and: [{
                good: {
                    $ne: false
                }
            }, {
                $or: [{
                    something: 'else'
                }, {
                    other: {
                        $ne: true
                    }
                }]
            }]
        };

        const chained = mongoUtils.chainTransformers(...mongoUtils.mapKeys({
            good: 'bad',
            something: 'elsewhere',
            other: 'another'
        }));

        assert.deepEqual(chained(query), {
            $and: [{
                bad: {
                    $ne: false
                }
            }, {
                $or: [{
                    elsewhere: 'else'
                }, {
                    another: {
                        $ne: true
                    }
                }]
            }]
        });
    });
});

describe('replaceFilters', function () {
    it('Can replace a filter by key', function () {
        const query = {
            $and: [{
                good: {
                    $ne: false
                }
            }, {
                $or: [{
                    something: 'else'
                }, {
                    other: {
                        $ne: true
                    }
                }]
            }]
        };

        const updatedQuery = mongoUtils.replaceFilters(query, {
            something: {
                else: true
            }
        });

        assert.deepEqual(updatedQuery, {
            $and: [{
                good: {
                    $ne: false
                }
            }, {
                $or: [{
                    else: true
                }, {
                    other: {
                        $ne: true
                    }
                }]
            }]
        });
    });
});

describe('Chain transformers', function () {
    it('Passes filter from transformer to transformer', function () {
        const transformer1 = (f) => {
            return {
                transformer1: f
            };
        };
        const transformer2 = (f) => {
            return {
                transformer2: f
            };
        };

        const chained = mongoUtils.chainTransformers(transformer1, transformer2);
        assert.deepEqual(chained('test'), {
            transformer2: {
                transformer1: 'test'
            }
        });
    });
});

describe('splitFilter', function () {
    it('Can split AND', function () {
        const query = {
            $and: [{
                good: {
                    $ne: false
                }
            }, {
                $or: [{
                    something: 'else'
                }, {
                    other: {
                        $ne: true
                    }
                }]
            }]
        };

        const [first, second] = mongoUtils.splitFilter(query, ['good']);
        first.should.eql({
            good: {
                $ne: false
            }
        });
        second.should.eql({
            $or: [{
                something: 'else'
            }, {
                other: {
                    $ne: true
                }
            }]
        });
    });

    it('Does a simple pass through to yg contents', function () {
        const query = {
            $and: [{
                good: {
                    $ne: false
                }
            }, {
                $or: [{
                    something: 'else'
                }, {
                    other: {
                        $ne: true
                    }
                }]
            }]
        };

        const [first, second] = mongoUtils.splitFilter(query, ['good']);
        assert.deepEqual(first, {
            good: {
                $ne: false
            }
        });
        assert.deepEqual(second, {
            $or: [{
                something: 'else'
            }, {
                other: {
                    $ne: true
                }
            }]
        });
    });

    it('Can split long AND', function () {
        const query = {
            $and: [{
                good: {
                    $ne: false
                }
            }, {
                good: {
                    $ne: false
                }
            }, {
                $or: [{
                    something: 'else'
                }, {
                    other: {
                        $ne: true
                    }
                }]
            }, {
                $or: [{
                    something: 'else'
                }, {
                    other: {
                        $ne: true
                    }
                }]
            }]
        };

        const [first, second] = mongoUtils.splitFilter(query, ['good']);
        first.should.eql({
            $and: [{
                good: {
                    $ne: false
                }
            }, {
                good: {
                    $ne: false
                }
            }]
        });
        second.should.eql({
            $and: [{
                $or: [{
                    something: 'else'
                }, {
                    other: {
                        $ne: true
                    }
                }]
            }, {
                $or: [{
                    something: 'else'
                }, {
                    other: {
                        $ne: true
                    }
                }]
            }]
        });
    });

    it('Can\'t split subfilter in AND using both', function () {
        const query = {
            $and: [{
                good: {
                    $ne: false
                }
            }, {
                $or: [{
                    good: 'else'
                }, {
                    other: {
                        $ne: true
                    }
                }]
            }]
        };

        assert.throws(() => mongoUtils.splitFilter(query, ['good']), /This filter is not supported because you cannot combine good filters with other filters except at the root level in an AND/);
    });

    it('Cannot split OR', function () {
        const query = {
            $or: [{
                good: {
                    $ne: false
                }
            }, {
                $or: [{
                    something: 'else'
                }, {
                    other: {
                        $ne: true
                    }
                }]
            }]
        };

        assert.throws(() => mongoUtils.splitFilter(query, ['good']), /This filter is not supported because you cannot combine good filters with other filters in an OR/);
    });

    it('Can use OR if everything belongs in second group', function () {
        const query = {
            $or: [{
                other2: {
                    $ne: false
                }
            }, {
                $or: [{
                    something: 'else'
                }, {
                    other: {
                        $ne: true
                    }
                }]
            }]
        };

        const [first, second] = mongoUtils.splitFilter(query, ['good']);
        assert.equal(first, undefined);
        assert.equal(second, query);
    });

    it('Can use OR if everything belongs in first group', function () {
        const query = {
            $or: [{
                other2: {
                    $ne: false
                }
            }, {
                $or: [{
                    something: 'else'
                }, {
                    other: {
                        $ne: true
                    }
                }]
            }]
        };

        const [first, second] = mongoUtils.splitFilter(query, ['other2', 'something', 'other']);
        assert.equal(first, query);
        assert.equal(second, undefined);
    });

    it('Returns both undefined for undefined filter', function () {
        const [first, second] = mongoUtils.splitFilter(undefined, ['other2', 'something', 'other']);
        assert.equal(first, undefined);
        assert.equal(second, undefined);
    });

    it('Can split object', function () {
        const query = {
            good: true,
            good2: true,
            bad: false,
            bad2: false
        };

        const [first, second] = mongoUtils.splitFilter(query, ['good', 'good2']);
        assert.deepEqual(first, {
            good: true,
            good2: true
        });
        assert.deepEqual(second, {
            bad: false,
            bad2: false
        });
    });
});
