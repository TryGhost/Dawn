# NQL
The aim is putting together various nql related projects into single, easy to use api. It allows:
 - parsing of NQL expression into Mongo JSON (using [nql-lang](https://github.com/TryGhost/NQL/tree/main/packages/nql-lang))
 - enhancing a database query with additional filters based on provided expression (using [mongo-knex](https://github.com/TryGhost/NQL/tree/main/packages/mongo-knex))
 - querying JSON objects with NQL expressions (using [mingo](https://github.com/kofrasa/mingo))

## Installation
Using npm:
```
npm install @tryghost/nql --save
```
or with yarn:
```
yarn add @tryghost/nql
```

## Example
A simple NQL expression could have following form: `featured:true+slug:['photo', 'video']`
When parsing it to Mongo JSON with `nql(expression).parse()` the output would be:
```javascript
{
    $and: [
        {
            featured: true
        },
        {
            slug: {
                $in: ['photo', 'video']
            }
        }
    ]
}
```

If the same expression would be applied to Knex [QueryBuilder](https://knexjs.org/#Builder) object, the following SQL where statement would be generated:
```sql
where (`posts`.`featured` = true and `posts`.`slug` in ('photo', 'video'))
```

## Usage
Some common usages:
```javascript
nql('id:3').toJSON();
\\ => {id:3}
```

```javascript
nql('id:3').queryJSON({test:true, id:3});
\\ => true
```

```javascript
nql('tags:test', {expansions: {tags: 'tags.slug'}}).toJSON();
\\ => {'tags.slug': test}
```
```javascript
nql('primary_tag:[photo]', {expansions: [
      {key: 'primary_tag', replacement: 'tags.slug', expansion: 'order:0'}
  ]})
\\ => {$and: [{'tags.slug': {$in: ['photo']}}, {order: 0}]}
```

Advanced usage example:

```javascript
// Builds SQL where statement on top of knex Query Builder including:
//  - combining custom filter 'primary_tag:test' with overrides filter and defaults
//  - expanding shortcut property 'primary_tag' into 'tags.slug' and adding 'posts_tags.sort_order:0' filter
//  - builds a where statement with related `tags` table through manyToMany relation
const query = nql('primary_tag:test', {
    relations: {
        tags: {
            tableName: 'tags',
            type: 'manyToMany',
            joinTable: 'posts_tags',
            joinFrom: 'post_id',
            joinTo: 'tag_id'
        }
    },
    expansions: [
        {
            key: 'primary_tag',
            replacement: 'tags.slug',
            expansion: 'posts_tags.sort_order:0'
        }
    ],
    overrides: 'status:published',
    defaults: 'featured:true'
});

query
    .querySQL(knex('posts'))
    .select();
```

## Test
- `yarn lint` run just eslint
- `yarn test` run lint && tests

# Copyright & License

Copyright (c) 2013-2023 Ghost Foundation - Released under the [MIT license](LICENSE).
