# postcss-easy-import [![Build Status][ci-img]][ci]

[PostCSS] plugin to inline @import rules content with extra features.

[postcss-import]: https://github.com/postcss/postcss-import
[PostCSS]: https://github.com/postcss/postcss
[ci-img]: https://travis-ci.org/TrySound/postcss-easy-import.svg
[ci]: https://travis-ci.org/TrySound/postcss-easy-import

## Usage

```js
postcss([ require('postcss-easy-import') ])
```

See [PostCSS] docs for examples for your environment.

## Resolving files with globs

The path to the file will be checked and if it contains a glob it will be used
to locate it. These can be mixed and matched with normal module paths:

```css
@import "suitcss-utils-display"; /* node_modules */
@import "./theme.css"; /* relative path */
@import "./components/*.css"; /* glob */
@import "suitcss-utils-size/lib/*.css"; /* glob inside node_modules */
```

## Options

This plugin is a [postcss-import] extension which introduces its own `resolve` option.

### `prefix`

Type: `false` or `string`
Default: `false`

Allows partial-like importing with a prefix before the filename.

```css
@import 'modules/partial.css';
/* will import modules/_partial.css */
```

Prefixed versions are always favoured. Otherwise the non-prefix version is used:

```
├── _baz.css
├── baz.css
├── bar.css
```

The matched files would be `['_baz.css', 'bar.css']`.

### `extensions`

Type: `array` or `string`
Default: `.css`

Defines file extensions which will be looked for.

# License

MIT © [Bogdan Chadkin](mailto:trysound@yandex.ru)
