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

# lowercase

[![NPM version][npm-image]][npm-url] [![Build Status][test-image]][test-url] [![Coverage Status][coverage-image]][coverage-url] <!-- [![dependencies][dependencies-image]][dependencies-url] -->

> Convert a string to lowercase.

<section class="intro">

</section>

<!-- /.intro -->

<section class="installation">

## Installation

```bash
npm install @stdlib/string-base-lowercase
```

</section>

<section class="usage">

## Usage

```javascript
var lowercase = require( '@stdlib/string-base-lowercase' );
```

#### lowercase( str )

Converts a string to lowercase.

```javascript
var str = lowercase( 'bEEp' );
// returns 'beep'
```

</section>

<!-- /.usage -->

<section class="examples">

## Examples

<!-- eslint no-undef: "error" -->

```javascript
var lowercase = require( '@stdlib/string-base-lowercase' );

var str = lowercase( 'Beep' );
// returns 'beep'

str = lowercase( 'BeEp' );
// returns 'beep'

str = lowercase( 'Beep BOOP' );
// returns 'beep boop'

str = lowercase( '$**_Beep_BoOp_**$' );
// returns '$**_beep_boop_**$'

str = lowercase( '' );
// returns ''
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

[npm-image]: http://img.shields.io/npm/v/@stdlib/string-base-lowercase.svg
[npm-url]: https://npmjs.org/package/@stdlib/string-base-lowercase

[test-image]: https://github.com/stdlib-js/string-base-lowercase/actions/workflows/test.yml/badge.svg?branch=v0.4.0
[test-url]: https://github.com/stdlib-js/string-base-lowercase/actions/workflows/test.yml?query=branch:v0.4.0

[coverage-image]: https://img.shields.io/codecov/c/github/stdlib-js/string-base-lowercase/main.svg
[coverage-url]: https://codecov.io/github/stdlib-js/string-base-lowercase?branch=main

<!--

[dependencies-image]: https://img.shields.io/david/stdlib-js/string-base-lowercase.svg
[dependencies-url]: https://david-dm.org/stdlib-js/string-base-lowercase/main

-->

[chat-image]: https://img.shields.io/gitter/room/stdlib-js/stdlib.svg
[chat-url]: https://app.gitter.im/#/room/#stdlib-js_stdlib:gitter.im

[stdlib]: https://github.com/stdlib-js/stdlib

[stdlib-authors]: https://github.com/stdlib-js/stdlib/graphs/contributors

[umd]: https://github.com/umdjs/umd
[es-module]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules

[deno-url]: https://github.com/stdlib-js/string-base-lowercase/tree/deno
[deno-readme]: https://github.com/stdlib-js/string-base-lowercase/blob/deno/README.md
[umd-url]: https://github.com/stdlib-js/string-base-lowercase/tree/umd
[umd-readme]: https://github.com/stdlib-js/string-base-lowercase/blob/umd/README.md
[esm-url]: https://github.com/stdlib-js/string-base-lowercase/tree/esm
[esm-readme]: https://github.com/stdlib-js/string-base-lowercase/blob/esm/README.md
[branches-url]: https://github.com/stdlib-js/string-base-lowercase/blob/main/branches.md

[stdlib-license]: https://raw.githubusercontent.com/stdlib-js/string-base-lowercase/main/LICENSE

</section>

<!-- /.links -->
