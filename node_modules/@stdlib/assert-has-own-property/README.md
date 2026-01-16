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

# hasOwnProperty

[![NPM version][npm-image]][npm-url] [![Build Status][test-image]][test-url] [![Coverage Status][coverage-image]][coverage-url] <!-- [![dependencies][dependencies-image]][dependencies-url] -->

> Test if an object has a specified property.

<section class="installation">

## Installation

```bash
npm install @stdlib/assert-has-own-property
```

</section>

<section class="usage">

## Usage

```javascript
var hasOwnProp = require( '@stdlib/assert-has-own-property' );
```

#### hasOwnProp( value, property )

Returns a `boolean` indicating if a `value` has a specified `property`.

```javascript
var value = {
    'beep': 'boop'
};

var bool = hasOwnProp( value, 'beep' );
// returns true

bool = hasOwnProp( value, 'bap' );
// returns false
```

</section>

<!-- /.usage -->

<section class="notes">

## Notes

-   In contrast to the native [Object.prototype.hasOwnProperty][mdn-object-has-own-property], this function does **not** throw when provided `null` or `undefined`. Instead, the function returns `false`.

    ```javascript
    var bool = hasOwnProp( null, 'a' );
    // returns false

    bool = hasOwnProp( void 0, 'a' );
    // returns false
    ```

-   Value arguments other than `null` or `undefined` are coerced to `objects`.

    ```javascript
    var bool = hasOwnProp( 'beep', 'length' );
    // returns true
    ```

-   Property arguments are coerced to `strings`.

    ```javascript
    var value = {
        'null': false
    };
    var bool = hasOwnProp( value, null );
    // returns true

    value = {
        '[object Object]': false
    };
    bool = hasOwnProp( value, {} );
    // returns true
    ```

</section>

<!-- /.notes -->

<section class="examples">

## Examples

<!-- eslint-disable object-curly-newline -->

<!-- eslint no-undef: "error" -->

```javascript
var hasOwnProp = require( '@stdlib/assert-has-own-property' );

var bool = hasOwnProp( { 'a': 'b' }, 'a' );
// returns true

bool = hasOwnProp( { 'a': 'b' }, 'c' );
// returns false

bool = hasOwnProp( { 'a': 'b' }, null );
// returns false

bool = hasOwnProp( {}, 'hasOwnProperty' );
// returns false

bool = hasOwnProp( null, 'a' );
// returns false

bool = hasOwnProp( void 0, 'a' );
// returns false

bool = hasOwnProp( { 'null': false }, null );
// returns true

bool = hasOwnProp( { '[object Object]': false }, {} );
// returns true
```

</section>

<!-- /.examples -->

<!-- Section for related `stdlib` packages. Do not manually edit this section, as it is automatically populated. -->

<section class="related">

* * *

## See Also

-   <span class="package-name">[`@stdlib/assert-has-property`][@stdlib/assert/has-property]</span><span class="delimiter">: </span><span class="description">test if an object has a specified property, either own or inherited.</span>

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

[npm-image]: http://img.shields.io/npm/v/@stdlib/assert-has-own-property.svg
[npm-url]: https://npmjs.org/package/@stdlib/assert-has-own-property

[test-image]: https://github.com/stdlib-js/assert-has-own-property/actions/workflows/test.yml/badge.svg?branch=v0.2.2
[test-url]: https://github.com/stdlib-js/assert-has-own-property/actions/workflows/test.yml?query=branch:v0.2.2

[coverage-image]: https://img.shields.io/codecov/c/github/stdlib-js/assert-has-own-property/main.svg
[coverage-url]: https://codecov.io/github/stdlib-js/assert-has-own-property?branch=main

<!--

[dependencies-image]: https://img.shields.io/david/stdlib-js/assert-has-own-property.svg
[dependencies-url]: https://david-dm.org/stdlib-js/assert-has-own-property/main

-->

[chat-image]: https://img.shields.io/gitter/room/stdlib-js/stdlib.svg
[chat-url]: https://app.gitter.im/#/room/#stdlib-js_stdlib:gitter.im

[stdlib]: https://github.com/stdlib-js/stdlib

[stdlib-authors]: https://github.com/stdlib-js/stdlib/graphs/contributors

[umd]: https://github.com/umdjs/umd
[es-module]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules

[deno-url]: https://github.com/stdlib-js/assert-has-own-property/tree/deno
[deno-readme]: https://github.com/stdlib-js/assert-has-own-property/blob/deno/README.md
[umd-url]: https://github.com/stdlib-js/assert-has-own-property/tree/umd
[umd-readme]: https://github.com/stdlib-js/assert-has-own-property/blob/umd/README.md
[esm-url]: https://github.com/stdlib-js/assert-has-own-property/tree/esm
[esm-readme]: https://github.com/stdlib-js/assert-has-own-property/blob/esm/README.md
[branches-url]: https://github.com/stdlib-js/assert-has-own-property/blob/main/branches.md

[stdlib-license]: https://raw.githubusercontent.com/stdlib-js/assert-has-own-property/main/LICENSE

[mdn-object-has-own-property]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty

<!-- <related-links> -->

[@stdlib/assert/has-property]: https://www.npmjs.com/package/@stdlib/assert-has-property

<!-- </related-links> -->

</section>

<!-- /.links -->
