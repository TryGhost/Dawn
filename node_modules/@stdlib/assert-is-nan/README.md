<!--

@license Apache-2.0

Copyright (c) 2018 The Stdlib Authors.

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

# isNaN

[![NPM version][npm-image]][npm-url] [![Build Status][test-image]][test-url] [![Coverage Status][coverage-image]][coverage-url] <!-- [![dependencies][dependencies-image]][dependencies-url] -->

> Test if a value is NaN.

<section class="installation">

## Installation

```bash
npm install @stdlib/assert-is-nan
```

</section>

<section class="usage">

## Usage

```javascript
var isnan = require( '@stdlib/assert-is-nan' );
```

#### isnan( value )

Tests if a `value` is `NaN`.

<!-- eslint-disable no-new-wrappers -->

```javascript
var Number = require( '@stdlib/number-ctor' );

var bool = isnan( NaN );
// returns true

bool = isnan( new Number( NaN ) );
// returns true

bool = isnan( 3.14 );
// returns false

bool = isnan( null );
// returns false
```

#### isnan.isPrimitive( value )

Tests if a `value` is a `NaN` primitive `number`.

<!-- eslint-disable no-new-wrappers -->

```javascript
var Number = require( '@stdlib/number-ctor' );

var bool = isnan.isPrimitive( NaN );
// returns true

bool = isnan.isPrimitive( 3.14 );
// returns false

bool = isnan.isPrimitive( new Number( NaN ) );
// returns false
```

#### isnan.isObject( value )

Tests if a `value` is a `Number` object having a value of `NaN`.

<!-- eslint-disable no-new-wrappers -->

```javascript
var Number = require( '@stdlib/number-ctor' );

var bool = isnan.isObject( NaN );
// returns false

bool = isnan.isObject( new Number( NaN ) );
// returns true
```

</section>

<!-- /.usage -->

<section class="examples">

## Examples

<!-- eslint-disable no-new-wrappers -->

<!-- eslint no-undef: "error" -->

```javascript
var Number = require( '@stdlib/number-ctor' );
var Symbol = require( '@stdlib/symbol-ctor' );
var isnan = require( '@stdlib/assert-is-nan' );

var bool = isnan( NaN );
// returns true

bool = isnan( new Number( NaN ) );
// returns true

bool = isnan( 5 );
// returns false

bool = isnan( '5' );
// returns false

bool = isnan( null );
// returns false

bool = isnan( Symbol( 'NaN' ) );
// returns false
```

</section>

<!-- /.examples -->

<!-- Section for related `stdlib` packages. Do not manually edit this section, as it is automatically populated. -->

<section class="related">

* * *

## See Also

-   <span class="package-name">[`@stdlib/assert-is-number`][@stdlib/assert/is-number]</span><span class="delimiter">: </span><span class="description">test if a value is a number.</span>

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

[npm-image]: http://img.shields.io/npm/v/@stdlib/assert-is-nan.svg
[npm-url]: https://npmjs.org/package/@stdlib/assert-is-nan

[test-image]: https://github.com/stdlib-js/assert-is-nan/actions/workflows/test.yml/badge.svg?branch=v0.2.2
[test-url]: https://github.com/stdlib-js/assert-is-nan/actions/workflows/test.yml?query=branch:v0.2.2

[coverage-image]: https://img.shields.io/codecov/c/github/stdlib-js/assert-is-nan/main.svg
[coverage-url]: https://codecov.io/github/stdlib-js/assert-is-nan?branch=main

<!--

[dependencies-image]: https://img.shields.io/david/stdlib-js/assert-is-nan.svg
[dependencies-url]: https://david-dm.org/stdlib-js/assert-is-nan/main

-->

[chat-image]: https://img.shields.io/gitter/room/stdlib-js/stdlib.svg
[chat-url]: https://app.gitter.im/#/room/#stdlib-js_stdlib:gitter.im

[stdlib]: https://github.com/stdlib-js/stdlib

[stdlib-authors]: https://github.com/stdlib-js/stdlib/graphs/contributors

[umd]: https://github.com/umdjs/umd
[es-module]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules

[deno-url]: https://github.com/stdlib-js/assert-is-nan/tree/deno
[deno-readme]: https://github.com/stdlib-js/assert-is-nan/blob/deno/README.md
[umd-url]: https://github.com/stdlib-js/assert-is-nan/tree/umd
[umd-readme]: https://github.com/stdlib-js/assert-is-nan/blob/umd/README.md
[esm-url]: https://github.com/stdlib-js/assert-is-nan/tree/esm
[esm-readme]: https://github.com/stdlib-js/assert-is-nan/blob/esm/README.md
[branches-url]: https://github.com/stdlib-js/assert-is-nan/blob/main/branches.md

[stdlib-license]: https://raw.githubusercontent.com/stdlib-js/assert-is-nan/main/LICENSE

<!-- <related-links> -->

[@stdlib/assert/is-number]: https://www.npmjs.com/package/@stdlib/assert-is-number

<!-- </related-links> -->

</section>

<!-- /.links -->
