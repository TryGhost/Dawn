"use strict";var i=function(e,r){return function(){return r||e((r={exports:{}}).exports,r),r.exports}};var t=i(function(x,u){
var g=require('@stdlib/assert-is-integer/dist').isPrimitive;function q(e){return g(e)&&e>=0}u.exports=q
});var s=i(function(P,v){
var N=require('@stdlib/assert-is-integer/dist').isObject;function O(e){return N(e)&&e.valueOf()>=0}v.exports=O
});var c=i(function(d,a){
var m=t(),I=s();function b(e){return m(e)||I(e)}a.exports=b
});var o=require('@stdlib/utils-define-nonenumerable-read-only-property/dist'),n=c(),f=t(),j=s();o(n,"isPrimitive",f);o(n,"isObject",j);module.exports=n;
/** @license Apache-2.0 */
//# sourceMappingURL=index.js.map
