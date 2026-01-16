"use strict";var e=function(r,i){return function(){return i||r((i={exports:{}}).exports,i),i.exports}};var s=e(function(R,n){
var m=require('@stdlib/assert-is-number/dist').isPrimitive,o=require('@stdlib/math-base-assert-is-nan/dist');function b(r){return m(r)&&o(r)}n.exports=b
});var t=e(function(g,a){
var O=require('@stdlib/assert-is-number/dist').isObject,f=require('@stdlib/math-base-assert-is-nan/dist');function j(r){return O(r)&&f(r.valueOf())}a.exports=j
});var c=e(function(h,v){
var p=s(),x=t();function N(r){return p(r)||x(r)}v.exports=N
});var q=require('@stdlib/utils-define-nonenumerable-read-only-property/dist'),u=c(),P=s(),d=t();q(u,"isPrimitive",P);q(u,"isObject",d);module.exports=u;
/** @license Apache-2.0 */
//# sourceMappingURL=index.js.map
