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

# Convert Path

[![NPM version][npm-image]][npm-url] [![Build Status][test-image]][test-url] [![Coverage Status][coverage-image]][coverage-url] <!-- [![dependencies][dependencies-image]][dependencies-url] -->

> Convert between POSIX and Windows paths.

<!-- Section to include introductory text. Make sure to keep an empty line after the intro `section` element and another before the `/section` close. -->

<section class="intro">

</section>

<!-- /.intro -->

<!-- Package usage documentation. -->

<section class="installation">

## Installation

```bash
npm install @stdlib/utils-convert-path
```

</section>

<section class="usage">

## Usage

```javascript
var convertPath = require( '@stdlib/utils-convert-path' );
```

#### convertPath( from, to )

Converts between POSIX and Windows paths.

```javascript
var p = convertPath( 'C:\\foo\\bar', 'posix' );
// returns '/c/foo/bar'
```

The following output path conventions are supported:

-   **win32**: Windows path convention; e.g., `C:\\foo\\bar`.
-   **mixed**: mixed path convention (Windows volume convention and POSIX path separator); e.g., `C:/foo/bar`.
-   **posix**: POSIX path convention; e.g., `/c/foo/bar`.

</section>

<!-- /.usage -->

<!-- Package usage notes. Make sure to keep an empty line after the `section` element and another before the `/section` close. -->

<section class="notes">

## Notes

-   A Windows [extended-length path][extended-length-path] **cannot** be converted to either a `mixed` or `posix` path convention, as forward slashes cannot be used as path separators.
-   If a POSIX path begins with `/[A-Za-z]/` (e.g., `/c/`), the path is assumed to begin with a volume name.
-   The function makes no attempt to verify that a provided path is valid. 

</section>

<!-- /.notes -->

<!-- Package usage examples. -->

<section class="examples">

## Examples

<!-- eslint no-undef: "error" -->

```javascript
var convertPath = require( '@stdlib/utils-convert-path' );

var p1;
var p2;

p1 = '/c/foo/bar/beep.c';
p2 = convertPath( p1, 'win32' );
// returns 'c:\foo\bar\beep.c'

p1 = '/c/foo/bar/beep.c';
p2 = convertPath( p1, 'mixed' );
// returns 'c:/foo/bar/beep.c'

p1 = '/c/foo/bar/beep.c';
p2 = convertPath( p1, 'posix' );
// returns '/c/foo/bar/beep.c'

p1 = 'C:\\\\foo\\bar\\beep.c';
p2 = convertPath( p1, 'win32' );
// returns 'C:\\foo\bar\beep.c'

p1 = 'C:\\\\foo\\bar\\beep.c';
p2 = convertPath( p1, 'mixed' );
// returns 'C:/foo/bar/beep.c'

p1 = 'C:\\\\foo\\bar\\beep.c';
p2 = convertPath( p1, 'posix' );
// returns '/c/foo/bar/beep.c'
```

</section>

<!-- /.examples -->

<!-- Section for describing a command-line interface. -->



<!-- Section to include cited references. If references are included, add a horizontal rule *before* the section. Make sure to keep an empty line after the `section` element and another before the `/section` close. -->

<section class="references">

</section>

<!-- /.references -->

<!-- Section for related `stdlib` packages. Do not manually edit this section, as it is automatically populated. -->

<section class="related">

## See Also

-   <span class="package-name">[`@stdlib/utils-convert-path-cli`][@stdlib/utils-convert-path-cli]</span><span class="delimiter">: </span><span class="description">CLI package for use as a command-line utility.</span>


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

[@stdlib/utils-convert-path-cli]: https://www.npmjs.com/package/@stdlib/utils-convert-path-cli

[npm-image]: http://img.shields.io/npm/v/@stdlib/utils-convert-path.svg
[npm-url]: https://npmjs.org/package/@stdlib/utils-convert-path

[test-image]: https://github.com/stdlib-js/utils-convert-path/actions/workflows/test.yml/badge.svg?branch=v0.2.2
[test-url]: https://github.com/stdlib-js/utils-convert-path/actions/workflows/test.yml?query=branch:v0.2.2

[coverage-image]: https://img.shields.io/codecov/c/github/stdlib-js/utils-convert-path/main.svg
[coverage-url]: https://codecov.io/github/stdlib-js/utils-convert-path?branch=main

<!--

[dependencies-image]: https://img.shields.io/david/stdlib-js/utils-convert-path.svg
[dependencies-url]: https://david-dm.org/stdlib-js/utils-convert-path/main

-->

[chat-image]: https://img.shields.io/gitter/room/stdlib-js/stdlib.svg
[chat-url]: https://app.gitter.im/#/room/#stdlib-js_stdlib:gitter.im

[stdlib]: https://github.com/stdlib-js/stdlib

[stdlib-authors]: https://github.com/stdlib-js/stdlib/graphs/contributors

[cli-section]: https://github.com/stdlib-js/utils-convert-path#cli
[cli-url]: https://github.com/stdlib-js/utils-convert-path/tree/cli
[@stdlib/utils-convert-path]: https://github.com/stdlib-js/utils-convert-path/tree/main

[umd]: https://github.com/umdjs/umd
[es-module]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules

[deno-url]: https://github.com/stdlib-js/utils-convert-path/tree/deno
[deno-readme]: https://github.com/stdlib-js/utils-convert-path/blob/deno/README.md
[umd-url]: https://github.com/stdlib-js/utils-convert-path/tree/umd
[umd-readme]: https://github.com/stdlib-js/utils-convert-path/blob/umd/README.md
[esm-url]: https://github.com/stdlib-js/utils-convert-path/tree/esm
[esm-readme]: https://github.com/stdlib-js/utils-convert-path/blob/esm/README.md
[branches-url]: https://github.com/stdlib-js/utils-convert-path/blob/main/branches.md

[stdlib-license]: https://raw.githubusercontent.com/stdlib-js/utils-convert-path/main/LICENSE

[extended-length-path]: https://msdn.microsoft.com/en-us/library/windows/desktop/aa365247(v=vs.85).aspx

[standard-streams]: https://en.wikipedia.org/wiki/Standard_streams

[mdn-regexp]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions

</section>

<!-- /.links -->
