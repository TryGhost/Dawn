require('../utils');

const nql = require('../../');
const knex = require('knex')({client: 'mysql'});

describe('NQL -> SQL', function () {
    describe('Can handle regexes safely', function () {
        it('can handle regex STRING with escaped quotes', function () {
            let query;

            query = nql(`name:~'John O\\'Nolan'`);

            query.lex().should.eql([
                {token: 'PROP', matched: 'name:'},
                {token: 'CONTAINS', matched: '~'},
                {token: 'STRING', matched: '\'John O\\\'Nolan\''}
            ]);

            query.toJSON().should.eql({name: {$regex: /John O'Nolan/i}});
            query.querySQL(knex('users')).toQuery().should.eql('select * from `users` where lower(`users`.`name`) like \'%john o\\\'nolan%\' ESCAPE \'*\'');

            query = nql(`name:~'John O\\"Nolan'`);
            query.toJSON().should.eql({name: {$regex: /John O"Nolan/i}});

            query.lex().should.eql([
                {token: 'PROP', matched: 'name:'},
                {token: 'CONTAINS', matched: '~'},
                {token: 'STRING', matched: '\'John O\\"Nolan\''}
            ]);

            query.querySQL(knex('users')).toQuery().should.eql('select * from `users` where lower(`users`.`name`) like \'%john o\\"nolan%\' ESCAPE \'*\'');

            query = nql(`name:~'A\\'B\\"C\\"D\\''`);
            query.toJSON().should.eql({name: {$regex: /A'B"C"D'/i}});

            query.lex().should.eql([
                {token: 'PROP', matched: 'name:'},
                {token: 'CONTAINS', matched: '~'},
                {token: 'STRING', matched: '\'A\\\'B\\"C\\"D\\\'\''}
            ]);

            query.querySQL(knex('users')).toQuery().should.eql('select * from `users` where lower(`users`.`name`) like \'%a\\\'b\\"c\\"d\\\'%\' ESCAPE \'*\'');
        });

        it('errors for unescaped quotes / injection patterns', function () {
            (function () {
                nql(`name:~'bad';'`).lex();
            }).should.throw();

            (function () {
                nql(`name:~'';'`).lex();
            }).should.throw();

            let query;
            // we can't force bad quotes, it errors as above
            // query = nql("name:~'';select * from `settings` where `value` like ''");

            // Can we trick SQL?
            query = nql("name:~'\\';select * from `settings` where `value` like \\''"); // eslint-disable-line quotes

            // The regex only has the regex chars escaped, not quotes
            query.toJSON().should.eql({name: {$regex: /';select \* from `settings` where `value` like '/i}});

            //SQL still ends up correctly escaped. This is all handled by knex... but having a test feels right
            query.querySQL(knex('users')).toQuery().should.eql('select * from `users` where lower(`users`.`name`) like \'%\\\';select ** from `settings` where `value` like \\\'%\' ESCAPE \'*\'');
        });
    });

    describe('Can combine not-equals filters into NIN correctly', function () {
        it('can collapse two NE filters into a single NOT IN', function () {
            let query;

            query = nql('tag:-tag1+tag:-tag2');
            query.toJSON().should.eql({tag: {$nin: ['tag1', 'tag2']}});
            query.querySQL(knex('posts')).toQuery().should.eql('select * from `posts` where `posts`.`tag` not in (\'tag1\', \'tag2\')');
        });

        it('can collapse NE filters that are in nested $and statements', function () {
            let query;

            query = nql('(tag:-tag1+tag:-tag2)+type:post');
            query.toJSON().should.eql({$and: [{tag: {$nin: ['tag1', 'tag2']}}, {type: 'post'}]});
            query.querySQL(knex('posts')).toQuery().should.eql('select * from `posts` where (`posts`.`tag` not in (\'tag1\', \'tag2\') and `posts`.`type` = \'post\')');
        });

        it('can collapse multiple NE filters into a single NOT IN', function () {
            let query;

            query = nql('tag:-tag1+tag:-tag2+tag:-tag3+tag:-tag4+tag:-tag5');
            query.toJSON().should.eql({tag: {$nin: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5']}});
            query.querySQL(knex('posts')).toQuery().should.eql('select * from `posts` where `posts`.`tag` not in (\'tag1\', \'tag2\', \'tag3\', \'tag4\', \'tag5\')');
        });

        it('will not collapse not equals and nequals on the same property', function () {
            let query;

            query = nql('tag:-tag1+tag:tag2');
            query.toJSON().should.eql({$and: [{tag: {$ne: 'tag1'}}, {tag: 'tag2'}]});
            query.querySQL(knex('posts')).toQuery().should.eql('select * from `posts` where (`posts`.`tag` != \'tag1\' and `posts`.`tag` = \'tag2\')');
        });

        it('keeps not-equal filters when combined with other filters', function () {
            let query;

            query = nql('(status:-free,email_disabled:1)+(status:-active,email_disabled:1)');
            query.toJSON().should.eql({
                $and: [
                    {
                        $or: [
                            {
                                status: {
                                    $ne: 'free'
                                }
                            },
                            {
                                email_disabled: 1
                            }
                        ]
                    },
                    {
                        $or: [
                            {
                                status: {
                                    $ne: 'active'
                                }
                            },
                            {
                                email_disabled: 1
                            }
                        ]
                    }
                ]
            });

            query.querySQL(knex('members')).toQuery().should.eql('select * from `members` where ((`members`.`status` != \'free\' or `members`.`email_disabled` = 1) and (`members`.`status` != \'active\' or `members`.`email_disabled` = 1))');
        });
    });
});
