<!--

@license Apache-2.0

Copyright (c) 2022 The Stdlib Authors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

-->


<details>
  <summary>
    About stdlib...
  </summary>
  <p>We believe in a future in which the web is a preferred environment for numerical computation. To help realize this future, we've built stdlib. stdlib is a standard library, with an emphasis on numerical and scientific computation, written in JavaScript (and C) for execution in browsers and in Node.js.</p>
  <p>The library is fully decomposable, being architected in such a way that you can swap out and mix and match APIs and functionality to cater to your exact preferences and use cases.</p>
  <p>When you use stdlib, you can be absolutely certain that you are using the most thorough, rigorous, well-written, studied, documented, tested, measured, and high-quality code out there.</p>
  <p>To join us in bringing numerical computing to the web, get started by checking us out on <a href="https://github.com/stdlib-js/stdlib">GitHub</a>, and please consider <a href="https://opencollective.com/stdlib">financially supporting stdlib</a>. We greatly appreciate your continued support!</p>
</details>

# replace

[![NPM version][npm-image]][npm-url] [![Build Status][test-image]][test-url] [![Coverage Status][coverage-image]][coverage-url] <!-- [![dependencies][dependencies-image]][dependencies-url] -->

> Replace search occurrences with a replacement string.

<section class="installation">

## Installation

```bash
npm install @stdlib/string-base-replace
```

</section>

<section class="usage">

## Usage

```javascript
var replace = require( '@stdlib/string-base-replace' );
```

#### replace( str, search, newval )

Replaces search occurrences with a replacement string.

```javascript
var out = replace( 'beep', /e/g, 'o' );
// returns 'boop'
```

If provided a function as the third argument, the function is invoked for each match, and the function's return value is used as the replacement string.

```javascript
function replacer( match, p1 ) {
    return '/' + p1 + '/';
}
var str = 'Oranges and lemons';
var out = replace( str, /([^\s]+)/gi, replacer );
// returns '/Oranges/ /and/ /lemons/'
```

</section>

<!-- /.usage -->

<section class="notes">

## Notes

-   The function assumes that the `search` argument is a [regular expression][mdn-regexp]. Accordingly, the function should **not** be used as a general drop-in replacement for [`String.prototype.replace`][mdn-string-replace].

</section>

<!-- /.notes -->

<section class="examples">

## Examples

<!-- eslint no-undef: "error" -->

```javascript
var capitalize = require( '@stdlib/string-base-capitalize' );
var replace = require( '@stdlib/string-base-replace' );

var out = replace( 'Hello World', /world/i, 'Mr. President' );
// returns 'Hello Mr. President'

function replacer( match, p1 ) {
    return capitalize( p1 );
}
var str = 'Oranges and lemons say the bells of St. Clement\'s';
out = replace( str, /([^\s]*)/gi, replacer );
// returns 'Oranges And Lemons Say The Bells Of St. Clement\'s'
```

</section>

<!-- /.examples -->

<!-- Section for related `stdlib` packages. Do not manually edit this section, as it is automatically populated. -->

<section class="related">

</section>

<!-- /.related -->

<!-- Section for all links. Make sure to keep an empty line after the `section` element and another before the `/section` close. -->


<section class="main-repo" >

* * *

## Notice

This package is part of [stdlib][stdlib], a standard library for JavaScript and Node.js, with an emphasis on numerical and scientific computing. The library provides a collection of robust, high performance libraries for mathematics, statistics, streams, utilities, and more.

For more information on the project, filing bug reports and feature requests, and guidance on how to develop [stdlib][stdlib], see the main project [repository][stdlib].

#### Community

[![Chat][chat-image]][chat-url]

---

## License

See [LICENSE][stdlib-license].


## Copyright

Copyright &copy; 2016-2024. The Stdlib [Authors][stdlib-authors].

</section>

<!-- /.stdlib -->

<!-- Section for all links. Make sure to keep an empty line after the `section` element and another before the `/section` close. -->

<section class="links">

[npm-image]: http://img.shields.io/npm/v/@stdlib/string-base-replace.svg
[npm-url]: https://npmjs.org/package/@stdlib/string-base-replace

[test-image]: https://github.com/stdlib-js/string-base-replace/actions/workflows/test.yml/badge.svg?branch=v0.2.2
[test-url]: https://github.com/stdlib-js/string-base-replace/actions/workflows/test.yml?query=branch:v0.2.2

[coverage-image]: https://img.shields.io/codecov/c/github/stdlib-js/string-base-replace/main.svg
[coverage-url]: https://codecov.io/github/stdlib-js/string-base-replace?branch=main

<!--

[dependencies-image]: https://img.shields.io/david/stdlib-js/string-base-replace.svg
[dependencies-url]: https://david-dm.org/stdlib-js/string-base-replace/main

-->

[chat-image]: https://img.shields.io/gitter/room/stdlib-js/stdlib.svg
[chat-url]: https://app.gitter.im/#/room/#stdlib-js_stdlib:gitter.im

[stdlib]: https://github.com/stdlib-js/stdlib

[stdlib-authors]: https://github.com/stdlib-js/stdlib/graphs/contributors

[umd]: https://github.com/umdjs/umd
[es-module]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules

[deno-url]: https://github.com/stdlib-js/string-base-replace/tree/deno
[deno-readme]: https://github.com/stdlib-js/string-base-replace/blob/deno/README.md
[umd-url]: https://github.com/stdlib-js/string-base-replace/tree/umd
[umd-readme]: https://github.com/stdlib-js/string-base-replace/blob/umd/README.md
[esm-url]: https://github.com/stdlib-js/string-base-replace/tree/esm
[esm-readme]: https://github.com/stdlib-js/string-base-replace/blob/esm/README.md
[branches-url]: https://github.com/stdlib-js/string-base-replace/blob/main/branches.md

[stdlib-license]: https://raw.githubusercontent.com/stdlib-js/string-base-replace/main/LICENSE

[mdn-string-replace]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace

[mdn-regexp]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp

</section>

<!-- /.links -->
