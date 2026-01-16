"use strict";var t=function(e,r){return function(){return r||e((r={exports:{}}).exports,r),r.exports}};var i=t(function(b,s){
var o=RegExp.prototype.exec;s.exports=o
});var c=t(function(h,u){
var p=i();function x(e){try{return p.call(e),!0}catch(r){return!1}}u.exports=x
});var a=t(function(j,n){
var f=require('@stdlib/assert-has-tostringtag-support/dist'),g=require('@stdlib/utils-native-class/dist'),q=c(),v=f();function E(e){return typeof e=="object"?e instanceof RegExp?!0:v?q(e):g(e)==="[object RegExp]":!1}n.exports=E
});var R=a();module.exports=R;
/** @license Apache-2.0 */
//# sourceMappingURL=index.js.map
