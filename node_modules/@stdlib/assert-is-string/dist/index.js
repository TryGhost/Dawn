"use strict";var t=function(r,e){return function(){return e||r((e={exports:{}}).exports,e),e.exports}};var i=t(function(L,u){
function O(r){return typeof r=="string"}u.exports=O
});var c=t(function(R,a){
var S=String.prototype.valueOf;a.exports=S
});var f=t(function(k,o){
var x=c();function b(r){try{return x.call(r),!0}catch(e){return!1}}o.exports=b
});var s=t(function(w,v){
var j=require('@stdlib/assert-has-tostringtag-support/dist'),l=require('@stdlib/utils-native-class/dist'),y=f(),m=j();function P(r){return typeof r=="object"?r instanceof String?!0:m?y(r):l(r)==="[object String]":!1}v.exports=P
});var q=t(function(z,p){
var h=i(),T=s();function d(r){return h(r)||T(r)}p.exports=d
});var g=require('@stdlib/utils-define-nonenumerable-read-only-property/dist'),n=q(),C=i(),F=s();g(n,"isPrimitive",C);g(n,"isObject",F);module.exports=n;
/** @license Apache-2.0 */
//# sourceMappingURL=index.js.map
