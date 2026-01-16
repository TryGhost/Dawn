const utils = require('../../lib/utils');

describe('Utils', function () {
    describe('Expand filters', function () {
        it('should not fail when no expansions provided', function () {
            utils.expandFilters({status: 'draft'}).should.eql({status: 'draft'});
        });

        it('should substitute single alias without expansion', function () {
            const mongoJSON = {primary_tag: 'en'};
            const expansions = [{
                key: 'primary_tag',
                replacement: 'tags.slug'
            }];

            const output = {'tags.slug': 'en'};

            utils.expandFilters(mongoJSON, expansions).should.eql(output);
        });

        it('should substitute single alias', function () {
            const filter = {primary_tag: 'en'};
            const expansions = [{
                key: 'primary_tag',
                replacement: 'tags.slug',
                expansion: `posts_tags.order:0`
            }];

            const processed = {$and: [
                {'tags.slug': 'en'},
                {'posts_tags.order': 0}
            ]};

            utils.expandFilters(filter, expansions).should.eql(processed);
        });

        it('should substitute single alias with multiple expansions', function () {
            const filter = {primary_tag: 'en'};
            const expansions = [{
                key: 'primary_tag',
                replacement: 'tags.slug',
                expansion: 'posts_tags.order:0+tags.visibility:public'
            }];

            const processed = {$and: [
                {'tags.slug': 'en'},
                {'posts_tags.order': 0},
                {'tags.visibility': 'public'}
            ]};

            utils.expandFilters(filter, expansions).should.eql(processed);
        });
    });

    describe('Parse expansions', function () {
        it('should transform single expansion', function () {
            const input = [
                {
                    key: 'primary_authors',
                    replacement: 'users',
                    expansion: 'order:0'
                }
            ];
            const output = [
                {
                    key: 'primary_authors',
                    replacement: 'users',
                    expansion: {order: 0}
                }
            ];

            utils.parseExpansions(input).should.eql(output);
            input.should.eql(input); // input should not be mutated
        });

        it('should transform multiple expansions', function () {
            const input = [
                {
                    key: 'primary_authors',
                    replacement: 'users',
                    expansion: 'order:0'
                },
                {
                    key: 'primary_tags',
                    replacement: 'tags',
                    expansion: 'order:0'
                }
            ];
            const output = [
                {
                    key: 'primary_authors',
                    replacement: 'users',
                    expansion: {order: 0}
                },
                {
                    key: 'primary_tags',
                    replacement: 'tags',
                    expansion: {order: 0}
                }
            ];

            utils.parseExpansions(input).should.eql(output);
            input.should.eql(input); // input should not be mutated
        });

        it('should combine $ne filters', function () {
            const input = {
                $and: [
                    {tag: {$ne: 'hash-secondary_feature_1'}},
                    {tag: {$ne: 'hash-secondary_feature_2'}}
                ]
            };
            const output = {
                tag: {$nin: ['hash-secondary_feature_1', 'hash-secondary_feature_2']}
            };

            utils.combineNeFilters(input).should.eql(output);
        });

        it('should not combine $ne filters when there is only one', function () {
            const input = {
                $and: [
                    {tag: {$ne: 'hash-secondary_feature_1'}}
                ]
            };

            utils.combineNeFilters(input).should.eql(input);
        });

        it('should not combine $ne filters when there are multiple keys with only one filter', function () {
            const input = {
                $and: [
                    {id: {$ne: '8d2ofjoijsd9s09dc'}},
                    {tag: {$ne: 'hash-secondary_feature_2'}}
                ]
            };

            utils.combineNeFilters(input).should.eql(input);
        });

        it('should not combine $ne filters with $eq filters', function () {
            const input = {
                $and: [
                    {tag: {$ne: '8d2ofjoijsd9s09dc'}},
                    {tag: 'hash-secondary_feature_2'}
                ]
            };

            utils.combineNeFilters(input).should.eql(input);
        });

        it('does not yet combine groups', function () {
            const input = {
                $and: [
                    {tag: {$ne: 'tag1'}},
                    {
                        $and: [
                            {tag: {$ne: 'tag2'}},
                            {tag: {$ne: 'tag3'}}
                        ]
                    }
                ]
            };

            utils.combineNeFilters(input).should.eql(input);
        });

        it('should combine $ne filters in nested $and', function () {
            const input = {
                $and: [
                    {tag: {$ne: 'tag1'}},
                    {tag: {$ne: 'tag2'}}
                ]
            };
            const output = {
                tag: {$nin: ['tag1', 'tag2']}
            };

            utils.combineNeFilters(input).should.eql(output);
        });
    });
});
