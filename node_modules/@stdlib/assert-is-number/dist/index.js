"use strict";var t=function(r,e){return function(){return e||r((e={exports:{}}).exports,e),e.exports}};var i=t(function(R,n){
function p(r){return typeof r=="number"}n.exports=p
});var o=t(function(k,a){
var x=require('@stdlib/number-ctor/dist'),N=x.prototype.toString;a.exports=N
});var v=t(function(w,c){
var g=o();function j(r){try{return g.call(r),!0}catch(e){return!1}}c.exports=j
});var s=t(function(z,b){
var y=require('@stdlib/assert-has-tostringtag-support/dist'),O=require('@stdlib/utils-native-class/dist'),S=require('@stdlib/number-ctor/dist'),P=v(),h=y();function l(r){return typeof r=="object"?r instanceof S?!0:h?P(r):O(r)==="[object Number]":!1}b.exports=l
});var q=t(function(A,f){
var T=i(),d=s();function C(r){return T(r)||d(r)}f.exports=C
});var m=require('@stdlib/utils-define-nonenumerable-read-only-property/dist'),u=q(),F=i(),G=s();m(u,"isPrimitive",F);m(u,"isObject",G);module.exports=u;
/** @license Apache-2.0 */
//# sourceMappingURL=index.js.map
