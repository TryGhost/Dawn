# Mongo Knex

## Installation
1. Make sure that `gstenv` is green. See [Dev Environment](https://github.com/TryGhost/Team/blob/master/Engineering/Dev%20Environment.md) for docs.
2. `git clone` this repo & `cd` into it as usual
3. Run `yarn` to install top-level dependencies.

## Run
- Use: `yarn dev`
- View: [http://localhost:9999](http://localhost:9999)

## Test
- `yarn lint` run just eslint
- `yarn test` run lint && tests
- `NODE_ENV=testing-mysql yarn test`
  - Manual database creation is currently required.

## Debug

`DEBUG=mongo-knex:*`
`DEBUG=mongo-knex:converter`
`DEBUG=mongo-knex:converter-extended`

## Config

`config.[env].json`

# Copyright & License

Copyright (c) 2013-2023 Ghost Foundation - Released under the [MIT license](LICENSE).
