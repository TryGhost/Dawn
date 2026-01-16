const Promise = require('bluebird');
const TABLES = [
    'posts_comments',
    'comments',
    'posts_tags',
    'posts_authors',
    'posts_meta',
    'posts',
    'tags',
    'users'
];

module.exports.up = function (knex) {
    // Before all tests, we load any base data (data that won't change)
    return Promise.resolve()
        .then(() => knex.schema.createTable('users', (table) => {
            table.increments('id').primary();
            table.string('name', 191);
            table.string('slug', 191);
        }))
        .then(() => knex.schema.createTable('posts', (table) => {
            table.increments('id').primary();
            table.string('title', 191).defaultTo('(Untitled)');
            table.boolean('featured').defaultsTo(false);
            table.string('image', 191).nullable();
            table.string('status', 191).nullable();
            table.dateTime('published_at').nullable();
            table.integer('author_id').unsigned().references('users.id');
        }))
        .then(() => knex.schema.createTable('posts_meta', (table) => {
            table.increments('id').primary();
            table.integer('post_id').unsigned().references('posts.id');
            table.string('meta_title', 2000).nullable();
            table.string('meta_description', 2000).nullable();
            table.string('email_subject', 300).nullable();
            table.integer('like_count').unsigned();
        }))
        .then(() => knex.schema.createTable('tags', (table) => {
            table.increments('id').primary();
            table.string('name', 191);
            table.string('slug', 191);
            table.string('visibility', 191).defaultTo('public');
            table.dateTime('created_at');
        }))
        .then(() => knex.schema.createTable('posts_tags', (table) => {
            table.increments('id').primary();
            table.integer('post_id').unsigned().references('posts.id');
            table.integer('tag_id').unsigned().references('tags.id');
            table.integer('sort_order').defaultTo(0);
        }))
        .then(() => knex.schema.createTable('posts_authors', (table) => {
            table.increments('id').primary();
            table.integer('post_id').unsigned().references('posts.id');
            table.integer('author_id').unsigned().references('users.id');
            table.integer('sort_order').defaultTo(0);
        }))
        .then(() => knex.schema.createTable('comments', (table) => {
            table.increments('id').primary();
            table.string('comment_provider_id').index();
            table.string('content');
        }))
        .then(() => knex.schema.createTable('posts_comments', (table) => {
            table.increments('id').primary();
            table.integer('post_id').unsigned().references('posts.id');
            table.string('comment_id').references('comments.comment_provider_id');
        }));
};

module.exports.down = function (knex) {
    return Promise.each(TABLES, table => knex.schema.dropTableIfExists(table));
};

module.exports.tables = TABLES;
