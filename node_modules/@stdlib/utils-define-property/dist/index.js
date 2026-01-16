"use strict";var n=function(e,t){return function(){return t||e((t={exports:{}}).exports,t),t.exports}};var s=n(function(T,_){"use strict";var w=typeof Object.defineProperty=="function"?Object.defineProperty:null;_.exports=w});var y=n(function(C,v){"use strict";var x=s();function q(){try{return x({},"x",{}),!0}catch(e){return!1}}v.exports=q});var p=n(function(F,c){"use strict";var G=Object.defineProperty;c.exports=G});var g=n(function(z,d){"use strict";var P=require("@stdlib/string-format"),a=Object.prototype,h=a.toString,m=a.__defineGetter__,S=a.__defineSetter__,k=a.__lookupGetter__,O=a.__lookupSetter__;function E(e,t,r){var f,i,l,u;if(typeof e!="object"||e===null||h.call(e)==="[object Array]")throw new TypeError(P("invalid argument. First argument must be an object. Value: `%s`.",e));if(typeof r!="object"||r===null||h.call(r)==="[object Array]")throw new TypeError(P("invalid argument. Property descriptor must be an object. Value: `%s`.",r));if(i="value"in r,i&&(k.call(e,t)||O.call(e,t)?(f=e.__proto__,e.__proto__=a,delete e[t],e[t]=r.value,e.__proto__=f):e[t]=r.value),l="get"in r,u="set"in r,i&&(l||u))throw new Error("invalid argument. Cannot specify one or more accessors and a value or writable attribute in the property descriptor.");return l&&m&&m.call(e,t,r.get),u&&S&&S.call(e,t,r.set),e}d.exports=E});var V=y(),b=p(),A=g(),o;V()?o=b:o=A;module.exports=o;
/**
* @license Apache-2.0
*
* Copyright (c) 2021 The Stdlib Authors.
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
