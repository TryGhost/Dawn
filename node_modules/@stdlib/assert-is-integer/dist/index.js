"use strict";var i=function(r,e){return function(){return e||r((e={exports:{}}).exports,e),e.exports}};var t=i(function(w,c){
var m=require('@stdlib/constants-float64-pinf/dist'),b=require('@stdlib/constants-float64-ninf/dist'),O=require('@stdlib/math-base-assert-is-integer/dist');function f(r){return r<m&&r>b&&O(r)}c.exports=f
});var s=i(function(z,q){
var p=require('@stdlib/assert-is-number/dist').isPrimitive,x=t();function N(r){return p(r)&&x(r)}q.exports=N
});var u=i(function(A,v){
var P=require('@stdlib/assert-is-number/dist').isObject,g=t();function j(r){return P(r)&&g(r.valueOf())}v.exports=j
});var o=i(function(B,a){
var F=s(),d=u();function y(r){return F(r)||d(r)}a.exports=y
});var I=require('@stdlib/utils-define-nonenumerable-read-only-property/dist'),n=o(),R=s(),h=u();I(n,"isPrimitive",R);I(n,"isObject",h);module.exports=n;
/** @license Apache-2.0 */
//# sourceMappingURL=index.js.map
