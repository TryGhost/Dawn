"use strict";var s=function(e,r){return function(){return r||e((r={exports:{}}).exports,r),r.exports}};var a=s(function(q,n){"use strict";var o=require("@stdlib/utils-escape-regexp-string"),g=require("@stdlib/assert-is-function"),t=require("@stdlib/assert-is-string").isPrimitive,m=require("@stdlib/assert-is-regexp"),u=require("@stdlib/string-format"),p=require("@stdlib/string-base-replace");function v(e,r,i){if(!t(e))throw new TypeError(u("invalid argument. First argument must be a string. Value: `%s`.",e));if(t(r))r=new RegExp(o(r),"g");else if(!m(r))throw new TypeError(u("invalid argument. Second argument must be a string or regular expression. Value: `%s`.",r));if(!t(i)&&!g(i))throw new TypeError(u("invalid argument. Third argument must be a string or replacement function. Value: `%s`.",i));return p(e,r,i)}n.exports=v});var f=a();module.exports=f;
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
