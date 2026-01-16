"use strict";var t=function(r,e){return function(){return e||r((e={exports:{}}).exports,e),e.exports}};var i=t(function(L,n){
function b(r){return typeof r=="boolean"}n.exports=b
});var u=t(function(R,a){
var x=Boolean.prototype.toString;a.exports=x
});var v=t(function(k,c){
var B=u();function g(r){try{return B.call(r),!0}catch(e){return!1}}c.exports=g
});var s=t(function(w,f){
var j=require('@stdlib/assert-has-tostringtag-support/dist'),y=require('@stdlib/utils-native-class/dist'),m=require('@stdlib/boolean-ctor/dist'),O=v(),S=j();function P(r){return typeof r=="object"?r instanceof m?!0:S?O(r):y(r)==="[object Boolean]":!1}f.exports=P
});var p=t(function(z,q){
var h=i(),T=s();function d(r){return h(r)||T(r)}q.exports=d
});var l=require('@stdlib/utils-define-nonenumerable-read-only-property/dist'),o=p(),C=i(),F=s();l(o,"isPrimitive",C);l(o,"isObject",F);module.exports=o;
/** @license Apache-2.0 */
//# sourceMappingURL=index.js.map
