"use strict";var b=function(n,a){return function(){return a||n((a={exports:{}}).exports,a),a.exports}};var j=b(function($,S){"use strict";function A(n){return typeof n=="object"&&n!==null&&!Array.isArray(n)}S.exports=A});var N=b(function(ee,J){"use strict";var C=Object.keys;function F(n){var a,g;for(a={},g=0;g<n.length;g++)a[n[g]]=!0;return C(a)}J.exports=F});var x=b(function(re,P){"use strict";var K=j(),k=Object.prototype.hasOwnProperty;function G(n,a){return K(a)?k.call(a,"basedir")&&(n.basedir=a.basedir,typeof n.basedir!="string")?new TypeError("invalid option. `basedir` option must be a string. Option: `"+n.basedir+"`."):k.call(a,"paths")&&(n.paths=a.paths,typeof n.paths!="string")?new TypeError("invalid option. `paths` option must be a string. Option: `"+n.paths+"`."):null:new TypeError("invalid argument. Options argument must be an object. Value: `"+a+"`.")}P.exports=G});var R=b(function(ie,E){"use strict";function U(){return{filename:"manifest.json",basedir:"",paths:""}}E.exports=U});var V=b(function(te,D){"use strict";var v=require("path"),T=require("process").cwd,z=require("debug"),B=require("resolve").sync,H=require("@stdlib/fs-resolve-parent-path").sync,I=require("@stdlib/utils-convert-path"),L=j(),Q=N(),W=x(),X=R(),s=z("library-manifest:main"),c=Object.prototype.hasOwnProperty,Y=Object.keys;function M(n,a,g){var p,u,q,w,t,d,h,o,r,l,m,O,f,e,i,y;if(typeof n!="string")throw new TypeError("invalid argument. First argument must be a string. Value: `"+n+"`.");if(d=X(),arguments.length>2){if(m=W(d,g),m)throw m;d.basedir=v.resolve(T(),d.basedir)}else d.basedir=T();if(s("Options: %s",JSON.stringify(d)),n=v.resolve(d.basedir,n),O=v.dirname(n),s("Manifest file path: %s",n),t=require(n),t=JSON.parse(JSON.stringify(t)),s("Manifest: %s",JSON.stringify(t)),!L(a))throw new TypeError("invalid argument. Second argument must be an object. Value: `"+a+"`.");for(s("Provided conditions: %s",JSON.stringify(a)),p=Y(t.options),e=0;e<p.length;e++)r=p[e],c.call(a,r)&&(t.options[r]=a[r]);for(s("Conditions for matching a configuration: %s",JSON.stringify(t.options)),s("Resolving matching configuration."),e=0;e<t.confs.length;e++){for(f=t.confs[e],i=0;i<p.length&&(r=p[i],!(!c.call(f,r)||f[r]!==t.options[r]));i++);if(i===p.length){o=JSON.parse(JSON.stringify(f)),s("Matching configuration: %s",JSON.stringify(o));break}}if(o===void 0)return s("Unable to resolve a matching configuration."),{};for(e=0;e<t.fields.length;e++)if(r=t.fields[e].field,c.call(o,r)&&(f=o[r],t.fields[e].resolve))for(i=0;i<f.length;i++)f[i]=v.resolve(O,f[i]);for(h=o.dependencies,s("Resolving %d dependencies.",h.length),q={basedir:d.basedir},e=0;e<h.length;e++){for(s("Resolving dependency: %s",h[e]),u=B(h[e],q),s("Dependency entry point: %s",u),u=H("package.json",{dir:v.dirname(u)}),u=v.dirname(u),s("Dependency path: %s",u),w={basedir:u},f=M(v.join(u,d.filename),a,w),s("Dependency manifest: %s",JSON.stringify(f)),s("Merging dependency manifest."),i=0;i<t.fields.length;i++)if(r=t.fields[i].field,c.call(f,r)){if(l=f[r],t.fields[i].resolve)for(y=0;y<l.length;y++)l[y]=v.resolve(u,l[y]);o[r]=o[r].concat(l)}s("Resolved dependency: %s",h[e])}for(s("Removing duplicate entries."),e=0;e<t.fields.length;e++)r=t.fields[e].field,c.call(o,r)&&(o[r]=Q(o[r]));for(s("Generating relative paths."),e=0;e<t.fields.length;e++)if(r=t.fields[e].field,c.call(o,r)&&t.fields[e].resolve&&t.fields[e].relative)for(l=o[r],i=0;i<l.length;i++)l[i]=v.relative(O,l[i]);if(d.paths){for(s("Converting paths to specified convention."),e=0;e<t.fields.length;e++)if(r=t.fields[e].field,c.call(o,r))for(l=o[r],i=0;i<l.length;i++)l[i]=I(l[i],d.paths)}return s("Final configuration: %s",JSON.stringify(o)),o}D.exports=M});var Z=V();module.exports=Z;
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
/**
* @license Apache-2.0
*
* Copyright (c) 2023 The Stdlib Authors.
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
