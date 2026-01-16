"use strict";var o=function(e,r){return function(){return r||e((r={exports:{}}).exports,r),r.exports}};var a=o(function(S,n){"use strict";function c(){var e=""+this.re;return this.im<0?e+=" - "+-this.im:e+=" + "+this.im,e+="i",e}n.exports=c});var u=o(function(T,s){"use strict";function b(){var e={};return e.type="Complex64",e.re=this.re,e.im=this.im,e}s.exports=b});var h=o(function(d,v){"use strict";var l=require("@stdlib/assert-is-number").isPrimitive,m=require("@stdlib/utils-define-property"),i=require("@stdlib/utils-define-nonenumerable-read-only-property"),p=require("@stdlib/number-float64-base-to-float32"),f=require("@stdlib/string-format"),y=a(),E=u();function t(e,r){if(!(this instanceof t))throw new TypeError("invalid invocation. Constructor must be called with the `new` keyword.");if(!l(e))throw new TypeError(f("invalid argument. Real component must be a number. Value: `%s`.",e));if(!l(r))throw new TypeError(f("invalid argument. Imaginary component must be a number. Value: `%s`.",r));return m(this,"re",{configurable:!1,enumerable:!0,writable:!1,value:p(e)}),m(this,"im",{configurable:!1,enumerable:!0,writable:!1,value:p(r)}),this}i(t,"BYTES_PER_ELEMENT",4);i(t.prototype,"BYTES_PER_ELEMENT",4);i(t.prototype,"byteLength",8);i(t.prototype,"toString",y);i(t.prototype,"toJSON",E);v.exports=t});var w=h();module.exports=w;
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
//# sourceMappingURL=index.js.map
