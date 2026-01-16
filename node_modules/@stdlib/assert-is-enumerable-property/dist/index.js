"use strict";var t=function(e,r){return function(){return r||e((r={exports:{}}).exports,r),r.exports}};var s=t(function(I,n){
var m=Object.prototype.propertyIsEnumerable;n.exports=m
});var c=t(function(S,a){
var v=s(),u;function b(){return!v.call("beep","0")}u=b();a.exports=u
});var l=t(function(j,o){
var q=require('@stdlib/assert-is-string/dist'),E=require('@stdlib/assert-is-nan/dist').isPrimitive,f=require('@stdlib/assert-is-integer/dist').isPrimitive,g=s(),x=c();function P(e,r){var i;return e==null?!1:(i=g.call(e,r),!i&&x&&q(e)?(r=+r,!E(r)&&f(r)&&r>=0&&r<e.length):i)}o.exports=P
});var d=l();module.exports=d;
/** @license Apache-2.0 */
//# sourceMappingURL=index.js.map
