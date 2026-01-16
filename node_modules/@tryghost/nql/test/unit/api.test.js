require('../utils');

const mingo = require('mingo');
const nqlLang = require('@tryghost/nql-lang');
const nql = require('../../');
const knex = require('knex')({client: 'mysql'});
const sandbox = sinon.createSandbox();

const expansions = [
    {key: 'tags', replacement: 'tags.slug'},
    {key: 'authors', replacement: 'authors.slug'},
    {key: 'primary_tag', replacement: 'tags.slug', expansion: 'order:0'}
];

/**
 nql('id:3').lex()
 nql('id:3').parse()
 nql('id:3').queryJSON({});
 nql('id:3').querySQL(knex('posts'));
 nql('id:3').toJSON();

 // In future?
 nql('id:3').merge('title:6');
 */
describe('Public API', function () {
    afterEach(function () {
        sandbox.restore();
    });

    it('Basic API works as expected', function () {
        const query = nql('id:3');

        query.lex().should.eql([
            {token: 'PROP', matched: 'id:'},
            {token: 'NUMBER', matched: '3'}
        ]);
        query.toJSON().should.eql({id: 3});
        query.toString().should.eql('id:3');

        query.queryJSON({id: 5}).should.be.false();
        query.queryJSON({id: 3, name: 'kate'}).should.be.true();

        query.querySQL(knex('posts')).toQuery().should.eql('select * from `posts` where `posts`.`id` = 3');
    });

    it('ensure multiple nql instances', function () {
        const query1 = nql('id:3');
        const query2 = nql('featured:true');

        query1.parse().should.eql({id: 3});
        query2.parse().should.eql({featured: true});

        query1.lex().should.eql([
            {token: 'PROP', matched: 'id:'},
            {token: 'NUMBER', matched: '3'}
        ]);

        query2.lex().should.eql([
            {token: 'PROP', matched: 'featured:'},
            {token: 'TRUE', matched: 'true'}
        ]);

        query1.queryJSON({id: 3}).should.be.true();
        query1.queryJSON({id: 2}).should.be.false();

        query2.queryJSON({featured: true}).should.be.true();
        query2.queryJSON({featured: false}).should.be.false();
    });

    it('ensure caching works as expected', function () {
        sandbox.spy(mingo, 'Query');
        sandbox.spy(nqlLang, 'parse');

        const query = nql('id:3');

        query.queryJSON({id: 3}).should.be.true();
        mingo.Query.calledOnce.should.be.true();
        query.queryJSON({id: 3}).should.be.true();
        mingo.Query.calledOnce.should.be.true();

        query.parse().should.eql({id: 3});
        nqlLang.parse.calledOnce.should.be.true();
        query.parse().should.eql({id: 3});
        nqlLang.parse.calledOnce.should.be.true();
    });

    it('Supports options (expansions)', function () {
        const query = nql('tags:[photo]', {expansions: expansions});

        query.toJSON().should.eql({'tags.slug': {$in: ['photo']}});
        query.toString().should.eql('tags:[photo]');

        query.queryJSON({tags: [{slug: 'video'}, {slug: 'audio'}]}).should.be.false();
        query.queryJSON({id: 3, tags: [{slug: 'video'}, {slug: 'photo'}, {slug: 'audio'}]}).should.be.true();
    });

    it('Supports options (expansions extended)', function () {
        const query = nql('primary_tag:[photo]', {expansions: expansions});

        query.toJSON().should.eql({$and: [
            {'tags.slug': {$in: ['photo']}},
            {order: 0}
        ]});
        query.toString().should.eql('primary_tag:[photo]');

        query.queryJSON({tags: [{slug: 'video'}, {slug: 'audio'}]}).should.be.false();
        query.queryJSON({id: 3, order: 0, tags: [{slug: 'video'}, {slug: 'photo'}, {slug: 'audio'}]}).should.be.true();
    });

    it('Overrides perform as expected when no attempt to override', function () {
        const query = nql('slug:hello-world', {overrides: 'status:published'});

        query.toJSON().should.eql({$and: [
            {status: 'published'},
            {slug: 'hello-world'}
        ]});

        query.toString().should.eql('slug:hello-world');

        query.queryJSON({slug: 'hello-world', status: 'draft'}).should.be.false();
        query.queryJSON({slug: 'hello-world', status: 'published'}).should.be.true();
    });

    it('Overrides cannot be overriden', function () {
        const query = nql('slug:hello-world+status:draft', {overrides: 'status:published'});

        // @TODO: this could merge more cleanly..
        query.toJSON().should.eql({$and: [
            {status: 'published'},
            {$and: [{slug: 'hello-world'}]}
        ]});

        query.toString().should.eql('slug:hello-world+status:draft');

        query.queryJSON({slug: 'hello-world', status: 'draft'}).should.be.false();
        query.queryJSON({slug: 'hello-world', status: 'published'}).should.be.true();
    });

    it('Defaults are added', function () {
        const query = nql('slug:hello-world', {defaults: 'page:true'});

        query.toJSON().should.eql({$and: [
            {slug: 'hello-world'},
            {page: true}
        ]});

        query.toString().should.eql('slug:hello-world');

        query.queryJSON({slug: 'hello-world', page: true}).should.be.true();
        query.queryJSON({slug: 'hello-world', page: false}).should.be.false();
    });

    it('Defaults can be overriden', function () {
        const query = nql('slug:hello-world+page:false', {defaults: 'page:true'});

        // @TODO: this could merge more cleanly..
        query.toJSON().should.eql({$and: [
            {slug: 'hello-world'},
            {page: false}
        ]});

        query.toString().should.eql('slug:hello-world+page:false');

        query.queryJSON({slug: 'hello-world', page: true}).should.be.false();
        query.queryJSON({slug: 'hello-world', page: false}).should.be.true();
    });

    describe('parsing when options.transformer is set', function () {
        it('sets this.filter to the result of options.transform(nql.parse(queryString)', function () {
            const options = {
                transformer(obj) {
                    return JSON.parse(JSON.stringify(obj));
                }
            };
            const nqlLangParseSpy = sandbox.spy(nqlLang, 'parse');
            const transformerSpy = sandbox.spy(options, 'transformer');

            const query = nql('hello:world', options);
            query.parse();

            transformerSpy.calledOnceWithExactly(nqlLangParseSpy.firstCall.returnValue).should.be.true();
            query.filter.should.equal(transformerSpy.firstCall.returnValue);
        });
    });
});
